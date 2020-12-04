DOM = {
    get: function (el) {
        return document.querySelector(el);
    },
    create: function (el) {
        return document.createElement(el);
    },

    // проверяет наличие элемента по селектору
    isEl: function (el) {
        return document.querySelector(el) === null ? false : true;
    },

    // проверяет наличие атрибута у элемента
    hasAttr: function (el, attr) {
        return document.querySelector(el).hasAttribute(attr);
    },
    // возвращает значение атрибута элемента
    getAttr: function (el, attr) {
        return document.querySelector(el).getAttribute(attr);
    },
    setAttr: function (el, attr, val, isExists = true) {
        if (isExists) {
            return document.querySelector(el).setAttribute(attr, val);
        } else {
            return el.setAttribute(attr, val);
        }
    },

    getVal: function (el) {
        return document.querySelector(el).value;
    },
    setVal: function (el, val) {
        document.querySelector(el).value = val;
    },

    getTxt: function (el) {
        return document.querySelector(el).textContent;
    },
    setTxt: function (el, txt, isExists = true) {
        if (isExists) {
            document.querySelector(el).textContent = txt;
        } else {
            el.textContent = txt;
        }
    },

    addEventListener: function (el, event, handler) {
        this.get(el).addEventListener(event, handler);
    }
};