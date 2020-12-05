DOM = {
    get: function (el) {
        return document.querySelector(el);
    },
    gets: function (els) {
        return document.querySelectorAll(els);
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
    getAttr: function (el, attr, isFind = true) {
        if (isFind) {
            return document.querySelector(el).getAttribute(attr);
        } else {
            return el.getAttribute(attr);
        }
    },
    setAttr: function (el, attr, val, isFind = true) {
        if (isFind) {
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

    getTxt: function (el, isFind = true) {
        if (isFind) {
            return document.querySelector(el).textContent;
        } else {
            return el.textContent;
        }
    },
    setTxt: function (el, txt, isFind = true) {
        if (isFind) {
            document.querySelector(el).textContent = txt;
        } else {
            el.textContent = txt;
        }
    },

    classGetList: function (el) {
        return this.get(el).classList;
    },
    classAdd: function (el, _class) {
        this.classGetList(el).add(_class);
    },

    show: function (el) {
        this.get(el).style.display = "block";
    },
    hide: function (el) {
        this.get(el).style.display = "none";
    },

    addEventListener: function (el, event, handler, isIntercept = false) {
        this.get(el).addEventListener(event, handler, isIntercept);
    }
};