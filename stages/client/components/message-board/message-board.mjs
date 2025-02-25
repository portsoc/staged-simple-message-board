import { ShadowElement } from '../shadow-element/shadow-element.mjs';

/**
 * MessageBoard component
 * A custom element that manages a message list and message input form
 * @extends ShadowElement
 */
export class MessageBoard extends ShadowElement {
  /**
   * Specifies which attributes should trigger attributeChangedCallback
   * @returns {string[]} Array of attribute names to observe
   */
  static get observedAttributes() {
    return ['url'];
  }

  /**
   * Lifecycle callback when element is added to DOM
   * Loads template and sets up event listeners
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace('.mjs', '.html');
    await this.loadTemplate(templateURL);

    // Set up message list component
    this.ml = this.shadow.querySelector('#ml');
    this.ml.url = this.url;

    // Set up message input with keyboard event handling
    this.message = this.shadow.querySelector('#message');
    this.message.addEventListener('keyup', this.checkKeys.bind(this));

    // Set up send button
    this.send = this.shadow.querySelector('#send');
    this.send.addEventListener('click', this.storeMessage.bind(this));

    // Listen for MessageActive events
    this.addEventListener('messageactive', this.showDetail.bind(this));
  }

  /**
   * Event handler for keyboard input
   * Stores a message when Enter key is pressed
   * @param {KeyboardEvent} e 
   */
  checkKeys(e) {
    if (e.key === 'Enter') {
      this.storeMessage();
    }
  }

  /**
   * Sends a message to the server
   * Posts JSON message data and triggers message list refresh on success
   */
  async storeMessage() {
    const payload = { msg: this.message.value };

    const response = await fetch('messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      this.message.value = '';
      // Trigger message list refresh via custom event
      this.ml.dispatchEvent(new CustomEvent('messageadded', { bubbles: true }));
    } else {
      console.log('failed to send message', response);
    }
  }

  /**
   * Getter/setter for url attribute
   * Used to specify the endpoint for message operations
   */
  get url() { return this.getAttribute('url'); }
  set url(value) { this.attr('url', value); }

  /**
   * Handles changes to observed attributes
   * @param {string} name The name of the changed attribute
   */
  attributeChangedCallback(name) {
    if (name === 'url') {
      // TODO handle url changes
    }
  }

  /**
   * Display detail information when a message becomes active
   * @param {CustomEvent} e Event containing message URL in detail
   */
  async showDetail(e) {
    const response = await fetch(e.detail.url);
    if (response.ok) {
      const detail = await response.json();
      const detailElement = this.shadow.querySelector('#detail');
      detailElement.textContent = `Message received on server at ${detail.time}`;
    }
  }
}

customElements.define('message-board', MessageBoard);
