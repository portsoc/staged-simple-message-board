/**
 * EditableMessage
 * A message that can be updated by the user and saved to the server
 */
export class EditableMessage extends HTMLElement {

  /**
   * connectedCallback
   * When the element is added to the
   * DOM display the readonly UI
   */
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const templateURL = import.meta.url.replace('.js', '.html');
    this.templatePage = await fetch(templateURL);
    this.shadow.innerHTML = await this.templatePage.text();
    this.showReadonly();
  }

  /**
   * Empty the shadow DOM by selecting
   * everything that's neither template
   * nor style and removing all matches. 
   */
  clearShadow() {
    const elems = this.shadow.querySelectorAll(':not(template, style)');
    elems.forEach(elem => elem.remove());
  }

  /**
   * Show the UI for when the EM is in 'readonly mode'
   */
  showReadonly() {
    this.clearShadow();
    const readonly = this.shadow.querySelector('#read-template');
    const clone = readonly.content.cloneNode(true);
    this.shadow.append(clone);
    const msg = this.shadow.querySelector('#message');
    msg.textContent = this.textContent;
    msg.addEventListener('dblclick', this.showEdit.bind(this));
    this.shadow.querySelector('button#edit').addEventListener('click', this.showEdit.bind(this));
    this.shadow.querySelector('#message').textContent = this.textContent;
  }

  /**
   * Show the UI for when the EM is in 'edit mode'
   */
  showEdit() {
    this.clearShadow();
    const template = this.shadow.querySelector('#edit-template');
    const clone = template.content.cloneNode(true);
    this.shadow.append(clone);
    this.shadow.querySelector('#message').value = this.textContent;
    this.shadow.querySelector('button#save').addEventListener('click', this.save.bind(this));
    this.shadow.querySelector('button#cancel').addEventListener('click', this.cancel.bind(this));

    // place the cursor after the text in #message
    const msg = this.shadow.querySelector('#message');
    msg.focus();
    msg.setSelectionRange(msg.value.length, msg.value.length);

    msg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.save();
      if (e.key === 'Escape') this.cancel();
    });
  }

  cancel() {
    this.showReadonly();
  }

  /**
   * getter for the url attribute, necessary for the save method
   */
  get url() {
    return this.getAttribute('url');
  }

  /**
   * getter for the url attribute, necessary for the save method
   */
  set url(value) {
    if (value) {
      this.setAttribute('url', value);
    } else {
      this.removeAttribute('url');
    }
  }

  get dbid() {
    return this.getAttribute('dbid');
  }

  /**
   * Send a PUT request to the server with the new message.
   * The URL for the fetch request comes from the
   * URL attribute of this custom element
   */
  async save() {
    const method = 'PUT';
    const headers = { 'Content-Type': 'application/json' };
    const msg = this.shadow.querySelector('#message').value;
    const body = JSON.stringify({ msg });
    const options = { method, headers, body };
    const response = await fetch(this.url, options);
    if (response.ok) {
      this.textContent = msg;
      this.showReadonly();
    } else {
      console.error('Failed to save message');
    }
  }
}

customElements.define('editable-message', EditableMessage);
