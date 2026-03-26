class DOMController {
    static insert(element, targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.error(`Target element not found: ${targetSelector}`);
            return;
        }
        target.appendChild(element);
    }

    static insertHTML(html, targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.error(`Target element not found: ${targetSelector}`);
            return;
        }
        target.insertAdjacentHTML('beforeend', html);
    }

    static insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    static clear(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.error(`Target element not found: ${targetSelector}`);
            return;
        }
        target.innerHTML = '';
    }

    static remove(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    static replace(element, newElement) {
        if (element && element.parentNode) {
            element.parentNode.replaceChild(newElement, element);
        }
    }

    static getElement(selector) {
        return document.querySelector(selector);
    }

    static getElements(selector) {
        return document.querySelectorAll(selector);
    }

    static createElement(tag, className = '', attributes = {}) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    }
}
