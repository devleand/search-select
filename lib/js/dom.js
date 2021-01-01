DOM = {
    /**
     * Returns a list of DOM items
     *
     * @param mixed     els
     * @param bool      isFind
     * @returns {NodeListOf<HTMLElementTagNameMap[*]> | *[]}
     */
    getElsList: function (els, isFind) {
        if (isFind) {
            els = this.gets(els);
        } else {
            if (!Types.isNodeList(els) && !(els instanceof Array)) {
                els = [ els ];
            }
        }

        return els;
    },

    get: function (el, parent = null) {
        if (Types.isNull(parent)) {
            parent = document;
        }
        return parent.querySelector(el);
    },
    gets: function (selector, parent = null) {
        if (Types.isNull(parent)) {
            parent = document;
        }
        return parent.querySelectorAll(selector);
    },

    getClone: function (el, deep = true, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.cloneNode(deep);
    },

    getParent: function (el, selector, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.closest(selector);
    },
    getChildren: function (el, selector, isFind = true) {
        let dom_els = this.getElsList(el, isFind), l = dom_els.length;

        let children = [];
        for (let i = 0; i < l; i++) {
            let current = this.gets(selector, dom_els[i]), count = current.length;
            for (let j = 0; j < count; j++) {
                children.push(current[j]);
            }
        }

        return children;
    },
    create: function (el) {
        return document.createElement(el);
    },

    // проверяет наличие элементов по селектору
    isEl: function (selector) {
        return this.gets(selector).length > 0 ? true : false;
    },

    getTagName: function (el, isFind = true) {
        if (isFind) {
            el = DOM.get(el);
        }
        return el.tagName;
    },

    // проверяет наличие атрибута у элемента
    hasAttr: function (el, attr, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.hasAttribute(attr);
    },
    // возвращает значение атрибута элемента
    getAttr: function (el, attr, isFind = true) {
        if (isFind) {
            return this.get(el).getAttribute(attr);
        } else {
            return el.getAttribute(attr);
        }
    },
    setAttr: function (els, attr, val, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;

        for (let i = 0; i < l; i++) {
            dom_els[i].setAttribute(attr, val);
        }
    },

    getProp: function (el, prop, isFind = true) {
        if (isFind) {
            return this.get(el)[prop];
        } else {
            return el[prop];
        }
    },
    setProp: function (els, prop, val, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;

        for (let i = 0; i < l; i++) {
            dom_els[i][prop] = val;
        }
    },

    getVal: function (el, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.value;
    },
    setVal: function (els, val, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;

        for (let i = 0; i < l; i++) {
            dom_els[i].value = val;
        }
    },

    getTxt: function (el, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.textContent;
    },
    setTxt: function (els, txt, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;

        for (let i = 0; i < l; i++) {
            dom_els[i].textContent = txt;
        }
    },

    getHTML: function (el, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.innerHTML;
    },
    setHTML: function (els, html, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;

        for (let i = 0; i < l; i++) {
            dom_els[i].innerHTML = html;
        }
    },

    hasClass: function (els, className, isFind = true) {
        className = " " + className + " ";

        let dom_els = this.getElsList(els, isFind), l = dom_els.length;
        for (let i = 0; i < l; i++) {
            if ((" " + dom_els[i].className + " ").replace(/[\n\t]/g, " ").indexOf(className) >= 0) {
                return true;
            }
        }

        return false;
    },
    classGetList: function (el, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.classList;
    },
    classAdd: function (els, ...classes) {
        let dom_els = this.gets(els), l = dom_els.length, kol_cl = classes.length;
        for (let i = 0; i < l; i++) {
            let class_list = this.classGetList(dom_els[i], false);
            for (let j = 0; j < kol_cl; j++) {
                class_list.add(classes[j]);
            }
        }
    },
    classRemove: function (els, ...classes) {
        let dom_els = this.gets(els), l = dom_els.length, kol_cl = classes.length;
        for (let i = 0; i < l; i++) {
            let class_list = this.classGetList(dom_els[i], false);
            for (let j = 0; j < kol_cl; j++) {
                class_list.remove(classes[j]);
            }
        }
    },

    show: function (els, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;
        for (let i = 0; i < l; i++) {
            dom_els[i].style.display = "block";
        }
    },
    hide: function (els, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;
        for (let i = 0; i < l; i++) {
            dom_els[i].style.display = "none";
        }
    },

    addEventListener: function (els, event, handler, isIntercept = false, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;

        for (let i = 0; i < l; i++) {
            dom_els[i].addEventListener(event, handler, isIntercept);
        }
    },

    trigger: function (els, event, isFind = true) {
        let dom_els = this.getElsList(els, isFind), l = dom_els.length;

        let e = new Event(event);
        for (let i = 0; i < l; i++) {
            dom_els[i].dispatchEvent(e);
        }
    }
};
