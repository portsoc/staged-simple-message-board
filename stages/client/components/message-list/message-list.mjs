import { ShadowElement } from '../shadow-element/shadow-element.mjs';

/**
 * MessageList component
 * A custom element that displays a list of messages fetched from a server
 * @extends ShadowElement
 */
export class MessageList extends ShadowElement {
  /**
   * Specifies which attributes should trigger attributeChangedCallback
   * @returns {string[]} Array of attribute names to observe
   */
  static get observedAttributes() {
    return ['url'];
  }

  /**
   * Lifecycle callback when element is added to DOM
   * Loads template, fetches initial messages, and sets up event listeners
   */
  async connectedCallback() {
    const templateURL = import.meta.url.replace('.mjs', '.html');
    await this.loadTemplate(templateURL);
    await this.fetchMessages();
    // Listen for new messages added to refresh the list
    this.addEventListener('messageadded', this.fetchMessages);
  }

  /**
   * Fetches messages from the server and updates the display
   * If fetch fails, shows an error message
   */
  async fetchMessages() {
    let messages;
    const url = this.url;
    if (url) {
      const response = await fetch(url);
      if (response.ok) {
        messages = await response.json();
      } else {
        messages = [{ msg: 'failed to load messages :-(' }];
      }
    }

    // Clear existing messages and display new ones
    this.clearShadow();
    messages.forEach(message => {
      const clone = this.showTemplate('message');
      clone.textContent = message.msg;
      clone.url = `./messages/${message.id}`;
    });
  }

  /**
   * Getter/setter for url attribute
   * Used to specify the endpoint for fetching messages
   */
  get url() { return this.getAttribute('url'); }
  set url(value) { this.attr('url', value); }

  /**
   * Handles changes to observed attributes
   * Refreshes messages when url changes
   * @param {string} name The name of the changed attribute
   */
  attributeChangedCallback(name) {
    if (name === 'url') {
      this.fetchMessages();
    }
  }
}

// Register the custom element with the browser
customElements.define('message-list', MessageList);