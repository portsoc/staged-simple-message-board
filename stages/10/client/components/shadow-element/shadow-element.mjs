/**
 * Represents a custom HTML element with a shadow DOM.
 * @extends HTMLElement
 */
export class ShadowElement extends HTMLElement {
  /**
   * Creates an instance of ShadowElement and attaches a shadow DOM.
   */
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /**
   * Loads an HTML template from a specified URL and inserts it into the shadow DOM.
   * @param {string} templateURL - The URL of the HTML template to load.
   * @returns {Promise<void>} A promise that resolves when the template is loaded and inserted.
   */
  async loadTemplate(templateURL) {
    const response = await fetch(templateURL);
    this.shadow.innerHTML = await response.text();
  }

  /**
   * Clears the shadow DOM, removing all elements except for <template> and <style> elements.
   */
  clearShadow() {
    const elems = this.shadow.querySelectorAll(':not(template, style)');
    elems.forEach(elem => elem.remove());
  }

  /**
   * Sets or removes an attribute on the element.
   * @param {string} name - The name of the attribute.
   * @param {string} [value] - The value of the attribute. If omitted, the attribute is removed.
   */
  attr(name, value) {
    if (value === undefined) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }
  }

  /**
   * Displays content from a specified template within the shadow DOM.
   * @param {string} templateId - The ID of the template to clone and display.
   * @returns {DocumentFragment|null} The cloned template content, or null if the template is not found.
   */
  showTemplate(templateId) {
    const template = this.shadow.querySelector(`#${templateId}`);
    if (!template) {
      console.error(`Template not found: ${templateId}`);
      return null;
    }
    const clone = template.content.cloneNode(true);
    this.shadow.append(clone);
    return this.shadow.lastElementChild;
  }
}
