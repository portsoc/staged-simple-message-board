import { ShadowElement } from '../shadow-element/shadow-element.mjs';

/**
 * EditableMessage
 * A message that can be updated by the user and saved to the server
 */
export class EditableMessage extends ShadowElement {
  /**
   * connectedCallback
   * When the element is added to the
   * DOM display the readonly UI
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace('.mjs', '.html');
    await this.loadTemplate(templateURL);
    this.showReadonly();

    // Add mouseenter handler to input/pre element
    const msg = this.shadow.querySelector('#message');
    msg.addEventListener('mouseenter', this.activateMessage.bind(this))
  }

  activateMessage() {
    // Dispatch custom event with URL
    const event = new CustomEvent('messageactive', {
      bubbles: true,
      composed: true,
      detail: { url: this.url }
    });
    console.log('dispatching messageactive event', event);
    
    
    this.dispatchEvent(event);
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
    this.showTemplate('read-template');
    const msg = this.shadow.querySelector('#message');
    msg.textContent = this.textContent;
    msg.addEventListener('dblclick', this.showEdit.bind(this));
    this.shadow.querySelector('button#edit').addEventListener('click', this.showEdit.bind(this));
  }

  /**
   * Show the UI for when the EM is in 'edit mode'
   */
  showEdit() {
    this.clearShadow();
    this.showTemplate('edit-template');
    const msg = this.shadow.querySelector('#message');
    msg.value = this.textContent;
    msg.focus();
    msg.setSelectionRange(msg.value.length, msg.value.length);

    this.shadow.querySelector('button#save').addEventListener('click', this.save.bind(this));
    this.shadow.querySelector('button#cancel').addEventListener('click', this.showReadonly.bind(this));

    msg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.save();
      if (e.key === 'Escape') this.showReadonly();
    });
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

  /**
   * attr is a utility finction for setter functions that either
   * sets the value of an attribue or removes the attribute if the
   * value is undefined.
   * @param {*} name
   * @param {*} value
   */
  attr(name, value) {
    if (value === undefined) {
      this.removeAttribute(name); // remove if undefined
    } else {
      this.setAttribute(name, value); // set if defined
    }
  }

  /** getters and setters */

  get dbid() { return this.getAttribute('dbid'); }
  get modified() { return this.getAttribute('modified'); }
  get url() { return this.getAttribute('url'); }

  set dbid(value) { this.attr('dbid', value); }
  set modified(value) { this.attr('modified', value); }
  set url(value) { this.attr('url', value); }
}

customElements.define('editable-message', EditableMessage);
