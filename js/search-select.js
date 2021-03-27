var SearchSelect = function (data) {
	this.init();

	if (! Types.isObject(data)) {
		throw "SearchSelect data is not type of Object!";
	}

	this.set(data);

	this.e.set();
};

/**
 * @param {{
 * 		SearchSelect: SearchSelect,
 * 		handleEvent: Function,
 * 		isXHR: Boolean|mixed
 * 	}} data
 * @constructor
 */
SearchSelect.Event = function (data) {
	if (! (data.SearchSelect instanceof SearchSelect)) {
		throw "SearchSelect.Event: data.SearchSelect is not object of class SearchSelect!";
	}
	this.SearchSelect = data.SearchSelect;
	if (! Types.isFunction(data.handleEvent)) {
		throw "SearchSelect.Event: data.handleEvent is not type of Function!";
	}
	this._handleEvent = data.handleEvent;
	if (Types.isBool(data.isXHR)) {
		this.isXHR = data.isXHR;
	}
};

/**
 * @param {
 * 		{el: string | DOMElements | NodeList | Element}
 * 		| {class: string|mixed, val: string|mixed, type: string|mixed, isResult: Boolean|mixed, txt: string|mixed}
 * 		} props
 * @param {Boolean} isGet
 * @constructor
 */
SearchSelect.ResItem = function (props, isGet = false) {
	this.init();

	if (isGet) {
		let li_el = new DOMElements(props.el);

		this.setters.virtual.class(li_el.attr(this.attrs.class));
		this.setters.virtual.val(li_el.attr(this.attrs.val));
		this.setters.virtual.type(li_el.attr(this.attrs.type));
		this.setters.virtual.isResult(li_el.attr(this.attrs.isResult));
		this.setters.virtual.txt(li_el.txt());

		this.set(li_el);
	} else {
		if (!!props.class) {
			this.setters.virtual.class(props.class);
		}
		if (!!props.val) {
			this.setters.virtual.val(props.val);
		}
		if (!!props.type) {
			this.setters.virtual.type(props.type);
		}
		if (Types.isBool(props.isResult)) {
			this.setters.virtual.isResult(props.isResult);
		}
		if (!!props.txt) {
			this.setters.virtual.txt(props.txt);
		}

		this.create();
	}
};

/**
 * @type {{const: string, dyn: string}}
 */
SearchSelect.ResItem.Types = {
	dyn: "dyn",
	const: "const"
};


SearchSelect.prototype = {
	/**
	 * @type {Object} Классы соответствующих элементов (исключительно пользовательский объект).
	 */
	classes: function () {
		let not_selected = 'not-selected';

		this.el 				= 'search-select-block';
		this.search 			= 'search-pole ' + not_selected;	// классы поля с поиском
		this.res 				= 'result-selected';				// классы невидимого поля со значением списка
		this.resList 			= 'result-list';					// класс для списка

		this.notFound 			= 'not-result';
		this.resSelected 		= 'selected';
		this.resNotSelected 	= not_selected;
	},
	/**
	 * @type {Object}
	 */
	placeholder: function () {
		this.attr 	= 'placeholder';
		this.val 	= 'Search';
	},

	/**
	 * @type {Object} Селекторы элементов (относительно основного блока).
	 */
	els: function () {
		this.token 		= 'input[type=hidden].search-token';
		this.search		= 'input.search-pole';
		this.res		= 'input[type=hidden].result-selected';
		this.resList	= 'ul[name=result_list]';
		this.list		= 'li';
	},
	/**
	 * @type {Object}  Названия атрибутов для соответствующих свойств класса.
	 */
	attrs: function () {
		this.handler			= "data-handler";
		this.isShowAll			= "data-is-show-all";
		this.isEBeforeChange	= "data-is-e-before-change";
		this.searchMinLen		= "data-search-min-len";
		this.selected			= "data-selected";
		this.constList			= "data-const-list";
		this.notFoundList		= "data-not-found-list";
	},

	/**
	 * @type {Boolean} Показывать ли все значения списка при нажатии на пробел/при клике.
	 */
	isShowAll: true,
	/**
	 * @type {Boolean} Вызывать ли обработчик перед присвоением скрытому полю выбранного пользователем значения.
	 */
	isEBeforeChange: false,
	/**
	 * Вызвать обработчик (перед присвоением значения полю).
	 *
	 * @param {String} txt		Текст выбранного значения.
	 * @param {String} val		Выбранное значение.
	 */
	eBeforeChangeTrigger: function (txt, val) {
		let data = {
			txt: txt,
			val: val
		};
		if (Types.isObject(this.eBeforeChange)) {
			this.eBeforeChange.handler(data);
		} else {
			this.eBeforeChange(data);
		}
	},
	/**
	 * @type {String}
	 */
	ajaxErrorMsg: "The request failed!",
	/**
	 * @type {Number} Минимальная длинна слова, с которой начинается поиск
	 */
	searchMinLen: 1,

	/**
	 * @type {Array}
	 */
	constList: [],
	/**
	 * @type {Object[]}
	 */
	notFoundList: [
		{ txt: "Nothing found!" }
	],

	init: function () {
		this.classes		= new this.classes();
		this.placeholder 	= new this.placeholder();
		this.attrs 			= new this.attrs();
		this.els 			= new this.els();
		this.setters 		= new this.setters(this);
		this.getters 		= new this.getters(this);
		this.res 			= new this.res(this);
		this.resList 		= new this.resList(this);
		this.e 				= new this.e(this);
	},
	/**
	 * @param {Object} data
	 */
	set: function (data) {
		this.setters.el(data.el);
		this.checkEls();

		let props = data.data;
		if (! Types.isObject(props)) {
			props = {};
		}

		this.setters.handler(props.handler);
		this.setters.isShowAll(props.isShowAll);
		this.setters.isEBeforeChange(props.isEBeforeChange);
		if (this.isEBeforeChange) {
			this.setters.eBeforeChange(props.eBeforeChange);
		}
		this.setters.ajaxErrorMsg(props.ajaxErrorMsg);
		this.setters.searchMinLen(props.searchMinLen);
		this.setters.classes(props.classes);
		this.setters.placeholder(props.placeholder);
		this.setters.selected(props.selected);
		this.setters.constList(props.constList);
		this.setters.notFoundList(props.notFoundList);
	},

	/**
	 * Проверить существование элемента в DOM. Выбросить исключение, если элемента не существует.
	 *
	 * @param {(string | DOMElements | NodeList | Element)} el
	 */
	check: function (el) {
		el = new DOMElements(el);
		if (el.length == 0) throw "Element " + el.selector + " not found";
	},
	/**
	 * Проверяет существование обязательных элементов DOM.
	 */
	checkEls: function () {
		this.check(this.getters.el());
		this.check(this.getters.searchEl());
		this.check(this.getters.resEl());
		this.check(this.getters.resListEl());
	},

	setters: function (_this) {
		this.parent = _this;

		/**
		 * @param {Object|mixed} classes
		 */
		this.classes 		 = function (classes) {
			let _this = this.parent;

			if (Types.isObject(classes)) {
				for (let _class in classes) {
					_this.classes[_class] = classes[_class];
				}
			}

			for (let _class in _this.classes) {
				if (! _this.els.hasOwnProperty(_class)) continue;

				let cur_el = new DOMElements(_this.els[_class]);

				if (cur_el.length == 0) {
					continue;
				}

				let classes_el = cur_el.classList();
				if (classes_el.length == 0) {
					let classes = _this.classes[_class].split(' ');
					for (let i = 0; i < classes.length; i++) {
						cur_el.addClass(classes[i]);
					}
				}
			}
		};

		/**
		 * @param {String | mixed} placeholder
		 */
		this.placeholder 	 = function (placeholder) {
			let _this = this.parent;
			let attr = _this.placeholder.attr;
			let search_el = _this.getters.searchEl();
			if (Types.isString(placeholder)) {
				search_el.attr(attr, placeholder)
			} else if (! search_el.hasAttr(attr)) {
				search_el.attr(attr, _this.placeholder.val);
			}
		};
		/**
		 * @param {(string | DOMElements | NodeList | Element)} el
		 */
		this.el 			 = function (el) {
			this.parent.els.el = new DOMElements(el);
		};
		/**
		 * @param {String | mixed} handler 	Путь к обработчику скрипта, может быть не передан
		 * 									(тогда программа попытается найти его в атрибуте главного блока).
		 */
		this.handler 		 = function (handler) {
			let _this = this.parent;
			if (Types.isString(handler)) {
				_this.handler = handler;
			} else if (_this.getters.el().hasAttr(_this.attrs.handler)) {
				_this.handler = _this.getters.el().attr(_this.attrs.handler);
			} else {
				throw "SearchSelect.handler is not define!";
			}
		};
		/**
		 * @param {string} flag
		 * @param {boolean | mixed} isActive
		 * @param {string | null} attr		Ключ атрибута массива SearchSelect.attrs с именем атрибута, из которого,
		 * 									если не корректно isActive, будет взято значение флага.
		 * 									Если не указано, в качестве ключа будет использовано значение flag.
		 */
		this.flag = function (flag, isActive, attr = null) {
			let _this = this.parent;
			attr = Types.isNull(attr) ? flag : attr;

			if (Types.isBool(isActive)) {
				_this[flag] = isActive;
			} else if (_this.getters.el().hasAttr(_this.attrs[attr])) {
				_this[flag] = Types.toBool(_this.getters.el().attr(_this.attrs[attr]));
			}
		};
		/**
		 * @param {Boolean|mixed} isShowAll
		 */
		this.isShowAll 		 = function (isShowAll) {
			this.flag('isShowAll', isShowAll);
		};
		/**
		 * @param {Boolean|mixed} isEBeforeChange
		 */
		this.isEBeforeChange = function (isEBeforeChange) {
			this.flag('isEBeforeChange', isEBeforeChange);
		};
		/**
		 * @param {Function|Object} handler
		 */
		this.eBeforeChange   = function (handler) {
			if (! Types.isFunction(handler) && ! Types.isObject(handler)) {
				throw "You forgot to pass a handler for eBeforeChange!";
			}
			this.parent.eBeforeChange = handler;
		};
		/**
		 * @param {String|mixed} msg
		 */
		this.ajaxErrorMsg	 = function (msg) {
			if (Types.isString(msg)) {
				this.parent.ajaxErrorMsg = msg;
			}
		};
		/**
		 * @param {Number|mixed} searchMinLen
		 */
		this.searchMinLen	 = function (searchMinLen) {
			let _this = this.parent;
			if (Types.isNumber(searchMinLen)) {
				_this.searchMinLen = searchMinLen;
			} else if (_this.getters.el().hasAttr(_this.attrs.searchMinLen)) {
				_this.searchMinLen = Types.toNumber(_this.getters.el().attr(_this.attrs.searchMinLen));
			}
		};
		/**
		 * @param {string} val
		 */
		this.search			 = function (val) {
			this.parent.getters.searchEl().val(val);
		};
		/**
		 * @param {string} res
		 */
		this.res			 = function (res) {
			this.parent.getters.resEl().val(res);
		};
		/**
		 * @param {Object|mixed} selected
		 */
		this.selected		 = function (selected) {
			let _this = this.parent;

			let el 				= _this.getters.el();
			let selected_attr 	= _this.attrs.selected;
			if (el.hasAttr(selected_attr)) {
				let selected_attr_val = el.attr(selected_attr);
				if (Types.isString(selected_attr_val)) {
					try {
						selected = JSON.parse(selected_attr_val);
					} catch (e) {
						throw "SearchSelect: selected value is not type of JSON!";
					}
				}
			}

			if (Types.isObject(selected)) {
				_this.res.set(selected);
			} else {
				_this.res.reset();
			}
		};
		/**
		 * @param {Object|Array|mixed} constList
		 */
		this.constList		 = function (constList) {
			let _this = this.parent;

			let el 				= _this.getters.el();
			let const_list_attr = _this.attrs.constList;
			if (el.hasAttr(const_list_attr)) {
				let const_list_attr_val = el.attr(const_list_attr);
				if (Types.isString(const_list_attr_val)) {
					try {
						constList = JSON.parse(const_list_attr_val);
					} catch (e) {
						throw "SearchSelect: constList value is not type of JSON!";
					}
				}
			}

			if (Types.isObject(constList) || Types.isArray(constList)) {
				_this.constList = constList;
			}

			let const_list = _this.constList;
			for (let i = 0; i < const_list.length; i++) {
				const_list[i].type = SearchSelect.ResItem.Types.const;
			}
			_this.resList.set(const_list);
		};
		/**
		 * @param {Object|Array|mixed} notFoundList
		 */
		this.notFoundList 	 = function (notFoundList) {
			let _this = this.parent;

			let el 					= _this.getters.el();
			let not_found_list_attr = _this.attrs.notFoundList;
			if (el.hasAttr(not_found_list_attr)) {
				let not_found_list_attr_val = el.attr(not_found_list_attr);
				if (Types.isString(not_found_list_attr_val)) {
					try {
						notFoundList = JSON.parse(not_found_list_attr_val);
					} catch (e) {
						throw "SearchSelect: notFoundList value is not type of JSON!";
					}
				}
			}

			if (Types.isObject(notFoundList) || Types.isArray(notFoundList)) {
				_this.notFoundList = notFoundList;
			}

			let not_found_list = _this.notFoundList;
			for (let i = 0; i < not_found_list.length; i++) {
				if (!not_found_list[i].class) {
					not_found_list[i].class = _this.classes.notFound;
				}
				not_found_list[i].isResult = false;
			}
		}
	},

	getters: function (_this) {
		this.parent = _this;

		/**
		 * @return {DOMElements}
		 */
		this.el = function () {
			return _this.els.el;
		};

		/**
		 * @param {string|DOMElements} el
		 * @return {string}
		 */
		this.selector = function (el) {
			if (el instanceof DOMElements) return el.selector ?? "";
			else if (Types.isString(el)) return el;
			else throw "undefined type of parameter el";
		};
		/**
		 * @param {string} el
		 * @return {string}
		 */
		this.dependentSelector = function (el) {
			return this.selector(this.el()) + " " + this.selector(el);
		};

		/**
		 * @param {string} el
		 * @param {boolean} isDependent
		 * @return {DOMElements}
		 */
		this.getEl = function (el, isDependent = true) {
			return new DOMElements(isDependent ? this.dependentSelector(_this.els[el]) : _this.els[el]);
		};
		/**
		 * @return {DOMElements}
		 */
		this.searchEl = function () {
			return this.getEl('search');
		};
		/**
		 * @return {DOMElements}
		 */
		this.tokenEl 			= function () {
			return this.getEl('token');
		};
		/**
		 * @return {DOMElements}
		 */
		this.resEl 				= function () {
			return this.getEl('res');
		};
		/**
		 * @return {DOMElements}
		 */
		this.resListEl 			= function () {
			return this.getEl('resList');
		};
		/**
		 * @return {DOMElements}
		 */
		this.listEl 			= function () {
			return this.getEl('list');
		};

		/**
		 * @return {string}
		 */
		this.searchVal 			= function () {
			return this.searchEl().val();
		};
		/**
		 * @return {string}
		 */
		this.res				= function () {
			return this.resEl().val();
		};

		/**
		 * @return {string}
		 */
		this.handler 			= function () {
			return this.parent.handler;
		};
		/**
		 * @return {string}
		 */
		this.token				= function () {
			let token_el = this.tokenEl();
			if (token_el.length > 0) {
				return token_el.val();
			} else {
				return "";
			}
		}
		/**
		 * @return {{search: string, token: string}}
		 */
		this.dataForHandler 	= function () {
			let __this = this;

			return {
				search:  __this.searchVal(),
				token: __this.token()
			};
		};
	},

	/**
	 * @param {Object} json
	 * @return {string}
	 */
	jsonToQuery: function (json) {
		if (! Types.isObject(json)) {
			throw "SearchSelect.jsonInQuery(json) - parameter json is not Object!";
		}
		let query = "";
		for (let q in json) {
			query += q + "=" + encodeURIComponent(json[q]) + "&";
		}

		return query;
	},
	/**
	 * @param {String|Object} query
	 * @param {Function} callback
	 * @return {XMLHttpRequest}
	 */
	send: function (query, callback) {
		if (Types.isObject(query)) {
			query = this.jsonToQuery(query);
		}

		let _this = this;
		let xhr = new XMLHttpRequest();

		xhr.open('GET', this.getters.handler() + "?" + query);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'json';
		xhr.send();

		xhr.onload = function () {
			if (this.status == 200) {
				callback(this.response);
			} else {
				alert(_this.ajaxErrorMsg);
				throw "HTTP request failed! Query: " + query + ". Status: " + this.status + " " + this.statusText;
			}
		};
		xhr.onerror = function() {
			alert(_this.ajaxErrorMsg);
			throw "Request failed!";
		};

		return xhr;
	},

	e: function (_this) {
		this.parent = _this;

		this.set 			= function () {
			let _this = this.parent;
			let __this = this;

			_this.getters.searchEl().on('click', new SearchSelect.Event({
				SearchSelect: _this,
				handleEvent: __this.searchClick,
				isXHR: true
			})).
			on("input", new SearchSelect.Event({
				SearchSelect: _this,
				handleEvent: __this.searchInput,
				isXHR: true
			}));

			DOMElements.make("html").on("mouseup", new SearchSelect.Event({
				SearchSelect: _this,
				handleEvent: __this.htmlMouseUp
			}), true).
			on("keyup", new SearchSelect.Event({
				SearchSelect: _this,
				handleEvent: __this.htmlKeyUp
			}));

			_this.getters.resListEl().on("click", new SearchSelect.Event({
				SearchSelect: _this,
				handleEvent: __this.resListClick
			}));
		};

		this.searchClick 	= function (e) {
			if (_this.isShowAll) {
				try {
					let query = {
						isAll: 1,
						token: _this.getters.token()
					};
					this.XHR = _this.send(query, function (data) {
						_this.resList.reset();
						_this.resList.set(data);
						_this.resList.show();
					});
				} catch (err) {
					_this.resList.hide();
					console.error(err.name + " " + err.message + err.stack);
				}
			} else {
				_this.resList.show();
			}
		};
		this.searchInput 	= function (e) {
			_this.res.reset();
			if (_this.getters.searchVal().length >= _this.searchMinLen) {
				let __this = this;
				try {
					__this.XHR = _this.search(function (data) {
						let res_list = _this.resList;
						res_list.reset();
						res_list.set(data);
						res_list.show();
					});
				} catch (err) {
					_this.resList.hide();
					console.error(err.name + " " + err.message + err.stack);
				}
			} else {
				_this.resList.hide();
			}
		};
		this.htmlKeyUp 		= function (e) {
			if (e.keyCode == 9) {
				_this.resList.hide();
			}
		};
		this.htmlMouseUp 	= function (e) {
			_this.resList.hide();
		};
		this.resListClick	= function (e) {
			let cur_li = new SearchSelect.ResItem({
				el: e.target
			}, true);
			if (cur_li.getters.isResult()) {
				_this.res.set(cur_li);
			} else {
				_this.resList.show();
			}
		}
	},

	res: function (_this) {
		this.parent = _this;

		/**
		 * @param {string} newRes
		 * @return {boolean}
		 */
		this.isChange	= function (newRes) {
			if (newRes !== this.parent.getters.res()) {
				return true;
			}
			return false;
		};
		/**
		 * @param {SearchSelect.ResItem|{val: string, txt: string}} data
		 */
		this.set 		= function (data) {
			if (!Types.isObject(data)) {
				throw "Result selected is not type of Object!";
			}
			let _this = this.parent;

			let val;
			let txt;
			if (data instanceof SearchSelect.ResItem) {
				val = data.getters.val();
				txt = data.getters.txt();
			} else {
				val = data.val;
				txt = data.txt;
			}

			if (_this.isEBeforeChange && this.isChange(val)) {
				_this.eBeforeChangeTrigger(txt, val);
			}

			_this.setters.res(val);
			_this.setters.search(txt);

			_this.getters.searchEl().removeClass(_this.classes.resNotSelected);
			_this.getters.searchEl().addClass(_this.classes.resSelected);
		};
		this.reset 		= function () {
			let _this = this.parent;

			let val = "";
			if (_this.isEBeforeChange && this.isChange(val)) {
				_this.eBeforeChangeTrigger(_this.getters.searchVal(), val);
			}

			_this.setters.res(val);

			_this.getters.searchEl().removeClass(_this.classes.resSelected);
			_this.getters.searchEl().addClass(_this.classes.resNotSelected);
		};
	},

	resList: function (_this) {
		this.parent = _this;

		/**
		 * @param {Object|Array} resList
		 */
		this.set 	= function (resList) {
			if (! Types.isObject(resList) && ! Types.isArray(resList)) {
				throw "SearchSelect.resList is not type of Array or Object!";
			}
			if (Types.isNull(resList)) {
				throw "SearchSelect.resList is null!";
			}
			let _this = this.parent;

			for (let i = 0; i < resList.length; i++) {
				let new_li = new SearchSelect.ResItem(resList[i]);
				_this.getters.resListEl().appendChild(new_li.get().get(0));
			}
		};
		this.reset 	= function () {
			this.parent.getters.listEl().forEach(function (el) {
				let res_li = new SearchSelect.ResItem({ el: el }, true);
				if (res_li.getters.type() !== SearchSelect.ResItem.Types.const) {
					res_li.remove();
				}
			});
		};

		this.show 	= function () {
			this.parent.getters.resListEl().show();
		};
		this.hide 	= function () {
			this.parent.getters.resListEl().hide();
		};
	},

	/**
	 * @param {Function} callback
	 * @return {XMLHttpRequest}
	 */
	search: function (callback) {
		let _this = this;

		let xhr = this.send(_this.getters.dataForHandler(), function (data) {
			if (Types.isNull(data)) {
				data = _this.notFoundList;
			} else if (data.length == 0) {
				data = _this.notFoundList;
			}
			callback(data);
		});

		return xhr;
	}
};

SearchSelect.Event.prototype = {
	/**
	 * @type {Boolean}
	 */
	isXHR: false,

	/**
	 * @type {Object}
	 */
	XHR: {
		abort: function () {}
	},

	handleEvent: function (e) {
		if (this.isXHR) {
			this.XHR.abort();
		}
		this._handleEvent(e);
	}
};

SearchSelect.ResItem.prototype = {
	/**
	 * @type {DOMElements}
	 */
	docObj: null,

	/**
	 * @type {String}
	 */
	tag: "li",
	/**
	 * @type {String}
	 */
	class: "",
	/**
	 * @type {String}
	 */
	val: "",
	/**
	 * @type {String}
	 */
	type: SearchSelect.ResItem.Types.dyn,
	/**
	 * @type {Boolean}
	 */
	isResult: true,
	/**
	 * @type {String}
	 */
	txt: "",

	/**
	 * @type {Object}
	 */
	attrs: function () {
		this.class 		= "class";
		this.val 		= "data-val";
		this.type		= "data-type";
		this.isResult	= "data-is-result";
	},

	init: function () {
		this.attrs 		= new this.attrs();
		this.setters 	= new this.setters(this);
		this.getters 	= new this.getters(this);
	},

	/**
	 * @param {DOMElements} docObj
	 */
	set: function (docObj) {
		this.docObj = docObj;
	},
	/**
	 * @return {DOMElements}
	 */
	get: function () {
		return this.docObj;
	},

	create: function () {
		let li = DOMElements.create(this.tag);
		this.set(li);

		this.setters.document.class(this.getters.class());
		this.setters.document.val(this.getters.val());
		this.setters.document.type(this.getters.type());
		this.setters.document.isResult(this.getters.isResult());
		this.setters.document.txt(this.getters.txt());
	},
	remove: function () {
		this.get().remove();
		this.set(null);
	},

	setters: function (_this) {
		this.parent 	= _this;

		/**
		 * @private
		 * @param {SearchSelect.ResItem.setters} __this
		 */
		this.virtual 	= function (__this) {
			this.parent = __this;

			this.class 		= function (_class) {
				this.parent.parent.class = _class;
			};
			this.val 		= function (val) {
				this.parent.parent.val = val;
			};
			this.type 		= function (type) {
				this.parent.parent.type = type;
			};
			this.isResult 	= function (isResult) {
				let _this = this.parent.parent;
				if (Types.isBool(isResult)) {
					_this.isResult = isResult;
				} else if (Types.isString(isResult)) {
					_this.isResult = Types.toNumber(isResult) > 0 ? true : false;
				} else {
					throw "SearchSelect.ResItem: isResult is undefined type!";
				}
			};
			this.txt 		= function (txt) {
				this.parent.parent.txt = txt;
			};
		};

		/**
		 * @private
		 * @param {SearchSelect.ResItem.setters} __this
		 */
		this.document 	= function (__this) {
			this.parent = __this;

			this.class 		= function (_class) {
				let _this = this.parent.parent;
				_this.get().attr(_this.attrs.class, _class);
			};
			this.val 		= function (val) {
				let _this = this.parent.parent;
				_this.get().attr(_this.attrs.val, val);
			};
			this.type 		= function (type) {
				let _this = this.parent.parent;
				_this.get().attr(_this.attrs.type, type);
			};
			this.isResult 	= function (isResult) {
				if (isResult) {
					isResult = "1";
				} else {
					isResult = "0";
				}
				let _this = this.parent.parent;
				_this.get().attr(_this.attrs.isResult, isResult);
			};
			this.txt 		= function (txt) {
				let _this = this.parent.parent;
				_this.get().txt(txt);
			};
		};

		this.virtual 	= new this.virtual(this);
		this.document 	= new this.document(this);

		this.class 		= function (_class) {
			this.virtual.class(_class);
			if (!Types.isNull(this.parent.get())) {
				this.document.class(_class);
			}
		};
		this.val 		= function (val) {
			this.virtual.val(val);
			if (!Types.isNull(this.parent.get())) {
				this.document.val(val);
			}
		};
		this.type 		= function (type) {
			this.virtual.type(type);
			if (!Types.isNull(this.parent.get())) {
				this.document.type(type);
			}
		};
		this.isResult 	= function (isResult) {
			this.virtual.isResult(isResult);
			if (!Types.isNull(this.parent.get())) {
				this.document.isResult(isResult);
			}
		};
		this.txt 		= function (txt) {
			this.virtual.txt(txt);
			if (!Types.isNull(this.parent.get())) {
				this.document.txt(txt);
			}
		};
	},
	getters: function (_this) {
		this.parent = _this;

		this.tag 		= function () {
			return this.parent.tag;
		}
		this.class 		= function () {
			return this.parent.class;
		};
		this.val 		= function () {
			return this.parent.val;
		};
		this.type 		= function () {
			return this.parent.type;
		};
		this.isResult 	= function () {
			return this.parent.isResult;
		};
		this.txt 		= function () {
			return this.parent.txt;
		};
	}
};