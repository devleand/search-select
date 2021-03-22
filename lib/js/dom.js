/**
 * @param {(string | DOMElements | NodeList | Element)} els     Селектор или элемент(-ы) DOM
 * @constructor
 */
var DOMElements = function (els) {
    this.els = els;
    this.eventList = new DOMEventList(this);
    if (Types.isString(els)) this.selector = els;
};
DOMElements.prototype = {
    /**
     * @type {(NodeList | Array<Node>)}
     * @private
     */
    _els: null,

    /**
     * @type {DOMEventList}
     */
    _eventList: null,

    /**
     * @type {undefined|string}
     */
    selector: undefined,

    set els (value) {
        this._els = DOMElements.getAsList(value);
    },

    set eventList (value) {
        if (! value instanceof DOMEventList) throw "Event list must be instance of DOMEventList";
        this._eventList = value;
    },

    get els () {
        return this._els;
    },

    get eventList () {
        return this._eventList;
    },

    /**
     * @return {number}
     */
    get length () {
        return this.els.length;
    },

    get tagName () {
        return this.els[0].tagName;
    },

    /**
     * @param {number} index
     * @returns {Node}
     */
    get: function (index) {
        return this.els[index];
    },

    /**
     * @param {function} callback
     */
    forEach: function (callback) {
        let l = this.els.length;
        for (let i = 0; i < l; i++) {
            if (callback(this.els[i]) === false) return;
        }
    },

    /**
     * @param {boolean} deep
     * @returns {DOMElements}
     */
    clone: function (deep= true) {
        let els = [];
        this.forEach(function (el) {
            els.push(el.cloneNode(deep));
        });

        return new this(els);
    },

    /**
     * @param {string} selector
     * @returns {DOMElements}
     */
    parent: function (selector) {
        let els = [];
        this.forEach(function (el) {
            let parent = el.closest(selector);
            if (Types.isNull(parent)) return;
            els.push(parent);
        });

        return new this(els);
    },

    /**
     * @param {string} selector
     * @returns {DOMElements}
     */
    children: function (selector) {
        let els = [];
        this.forEach(function (el) {
            let current = DOMElements.gets(selector, el), count = current.length;
            for (let i = 0; i < count; i++) {
                els.push(current[i]);
            }
        });

        return new this(els);
    },

    /**
     * @param {string} attr
     * @returns {boolean}
     */
    hasAttr: function (attr) {
        return this.get(0).hasAttribute(attr);
    },

    /**
     * @param {string} attr
     * @param {(null | string)} value
     * @returns {(undefined | string)}
     */
    attr: function (attr, value = null) {
        if (Types.isNull(value)) {
            return this.get(0).getAttribute(attr);
        } else {
            this.forEach(function (el) {
                el.setAttribute(attr, value);
            });
        }
    },

    /**
     * @param {string} prop
     * @param {(null | string)} value
     * @returns {(undefined | boolean)}
     */
    prop: function (prop, value = null) {
        if (Types.isNull(value)) {
            return this.get(0)[prop];
        } else {
            this.forEach(function (el) {
                el[prop] = value;
            });
        }
    },

    /**
     * @param {(null | mixed)} value
     * @returns {undefined | string}
     */
    val: function (value = null) {
        if (Types.isNull(value)) {
            return this.get(0).value;
        } else {
            this.forEach(function (el) {
                el.value = value;
            });
        }
    },

    /**
     * @param {(null | mixed)} value
     * @returns {undefined | string}
     */
    txt: function (value = null) {
        if (Types.isNull(value)) {
            return this.get(0).textContent;
        } else {
            this.forEach(function (el) {
                el.textContent = value;
            });
        }
    },

    /**
     * @param {(null | string)} value
     * @returns {undefined | string}
     */
    html: function (value = null) {
        if (Types.isNull(value)) {
            return this.get(0).innerHTML;
        } else {
            this.forEach(function (el) {
                el.innerHTML = value;
            });
        }
    },

    /**
     * @param {string} className
     * @returns {boolean}
     */
    hasClass: function (className) {
        let returned = false;
        className = " " + className + " ";

        this.forEach(function (el) {
            if ((" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(className) >= 0) {
                returned = true;
                return false;
            }
        });

        return returned;
    },

    /**
     * @returns {DOMTokenList}
     */
    classList: function () {
        return this.get(0).classList;
    },

    addClass: function (...classes) {
        let kol_cl = classes.length;

        this.forEach(function (el) {
            let class_list = DOMElements.classList(el);
            for (let i = 0; i < kol_cl; i++) {
                class_list.add(classes[i]);
            }
        });
    },

    removeClass: function (...classes) {
        let kol_cl = classes.length;

        this.forEach(function (el) {
            let class_list = DOMElements.classList(el);
            for (let i = 0; i < kol_cl; i++) {
                class_list.remove(classes[i]);
            }
        });
    },

    /**
     * @param {string} style
     * @param {(null | string)} value
     * @returns {undefined | string}
     */
    style: function (style, value = null) {
        if (Types.isNull(value)) {
            return this.get(0).style[style];
        } else {
            this.forEach(function (el) {
                el.style[style] = value;
            });
        }
    },

    /**
     * @param {string} display
     */
    display: function (display) {
          this.style('display', display);
    },

    /**
     * @param {string} display
     */
    show: function () {
        this.display("block");
    },

    hide: function () {
        this.display("none");
    },

    /**
     * @param {Element} nodes
     */
    appendChild: function (...nodes) {
        this.forEach(function (el) {
            el.appendChild(...nodes);
        });
    },
    /**
     * @param {Node | DOMString} nodes
     */
    append: function (...nodes) {
        this.forEach(function (el) {
            el.append(...nodes);
        });
    },
    remove: function () {
        this.forEach(function (el) {
            el.remove();
        });
    },

    /**
     * @param {string} event
     * @param {string, function, object} prop1
     * @param {null, function, object, boolean} prop2
     * @param {null, object, boolean} prop3
     * @return {DOMElements}
     */
    on: function (event, prop1, prop2 = null, prop3 = null) {
        let props = [ prop1 ];
        if (! Types.isNull(prop2)) props.push(prop2);
        if (! Types.isNull(prop3)) props.push(prop3);

        let target = null, handler = null, options = {};
        switch (props.length) {
            case 1:
                handler = props[0];
                break;

            case 2:
                let first = props[0];
                if (Types.isString(first)) {
                    target = first;
                    handler = props[1];
                } else {
                    handler = first;
                    options = props[1];
                }
                break;

            case 3:
                target = props[0];
                handler = props[1];
                options = props[2];
                break;
        }

        this.eventList.addEventListener(event, new DOMEventListener(handler, options, target));

        return this;
    },

    trigger: function (event) {
        this.eventList.trigger(event);
    }
};

/**
 * @param el
 * @return {DOMElements}
 */
DOMElements.make = function (el) {
    return new DOMElements(el);
};

DOMElements.helpers = {
    /**
     * @param {(null | Document | Node)} parent
     * @return {(Document | Node)}
     */
    calcParent: function (parent) {
        return Types.isNull(parent) ? document : parent;
    }
};

/**
 *
 * @param {string} selector
 * @param {(null | Document | Node)} parent
 * @returns {Element}
 */
DOMElements.get = function (selector, parent = null) {
    return this.helpers.calcParent(parent).querySelector(selector);
};

/**
 *
 * @param {string} selector
 * @param {(null | Document | Node)} parent
 * @returns {NodeListOf}
 */
DOMElements.gets = function (selector, parent = null) {
    return this.helpers.calcParent(parent).querySelectorAll(selector);
};

/**
 * @returns {(NodeList | Array)}
 */
DOMElements.getAsList = function (els) {
    if (Types.isString(els)) {
        els = this.gets(els);
    } else if (els instanceof  DOMElements) {
        els = els.els;
    } else if (Types.isElement(els)) {
        els = [ els ];
    } else if (! Types.isNodeList(els) && ! Types.isArray(els)) {
        console.error(els);
        throw "Undefined element";
    }

    return els;
};

/**
 * @param {string} tagName
 * @returns {DOMElements}
 */
DOMElements.create = function (tagName) {
    return new DOMElements(document.createElement(tagName));
};

/**
 * @param {(string | NodeList | Element)} els     Селектор или элемент(-ы) DOM
 * @returns {DOMTokenList}
 */
DOMElements.classList = function (el) {
    let _this = new DOMElements(el);
    return _this.classList();
};

/**
 * Сравнить mainEls с els.
 *
 * @param {(string | DOMElements | NodeList | Element)} mainEls
 * @param {(string | DOMElements | Element)} els
 * @return {Boolean}
 */
DOMElements.compare = function (mainEls, els) {
    let returned = false;
    mainEls = new DOMElements(mainEls);
    els = new DOMElements(els);

    mainEls.forEach(function (el) {
        els.forEach(function (el2) {
            if (el === el2) {
                returned = true;
                return false;
            }
        });
        if (returned) return false;
    });

    return returned;
};

/**
 * @param {DOMElements} event
 * @constructor
 */
var DOMEventList = function (els) {
    this.els = els;
};
DOMEventList.prototype = {
    /**
     * @type {DOMElements}
     */
    _els: null,
    /**
     * @type {Object<Array<DOMEventListener>>}
     */
    events: [],

    set els (value) {
        if (! value instanceof DOMElements) throw "Target element must be instance of DOMElements";
        this._els = value;
    },

    get els () {
        return this._els;
    },

    /**
     * @param {string} event
     * @param {DOMEventListener} listener
     * @return {Number}
     */
    pushEvent: function (event, listener) {
        if (! this.events[event]) {
            this.events[event] = [];
        }
        return this.events[event].push(listener);
    },

    /**
     * @param {DOMElements} els
     * @param {string} event
     * @param {DOMEventListener} listener
     * @return {Number}
     */
    addEventListener: function (event, listener) {
        this.els.forEach(function (el) {
            el.addEventListener(event, listener, listener.options);
        });

        return this.pushEvent(event, listener);
    },

    /**
     * @param {string} event
     */
    trigger: function (event) {
        let e = new Event(event);
        this.forEach(function (el) {
            el.dispatchEvent(e);
        });
    }
};

/**
 * @param {function, object} handler
 * @param {Object | Boolean} options
 * @param {null | string} target
 * @constructor
 */
var DOMEventListener = function (handler, options = {}, target = null) {
    this.handler = handler;
    this.options = options;
    this.target = target;
};
DOMEventListener.prototype = {
    /**
     * @type {Function | object}
     */
    handler: null,
    /**
     * @type {Object | Boolean}
     */
    options: {},
    /**
     * @type {null | string}
     */
    target: null,

    handleEvent: function (e) {
        if (! Types.isNull(this.target)) {
            if (! DOMElements.compare(e.target, this.target)) return;
        }

        if (Types.isObject(this.handler)) {
            this.handler.handleEvent(e);
        } else {
            this.handler(e);
        }
    }
};
