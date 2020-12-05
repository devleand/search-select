SearchSelectEvent = function (data) {
	if (!(data.SearchSelect instanceof SearchSelect)) {
		throw "SearchSelectEvent: data.SearchSelect is not object of class SearchSelect!";
	}
	this.SearchSelect = data.SearchSelect;
	if (!Types.isFunction(data.handleEvent)) {
		throw "SearchSelectEvent: data.handleEvent is not type of Function!";
	}
	this._handleEvent = data.handleEvent;
	if (Types.isBool(data.isXHR)) {
		this.isXHR = data.isXHR;
	}
};
SearchSelectEvent.prototype = {
	isXHR: false,
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

SearchSelect = function (data) {
	this.classes		= new this.classes();
	this.placeholder 	= new this.placeholder();
	this.attrs 			= new this.attrs();
	this.els 			= new this.els();
	this.setters 		= new this.setters(this);
	this.getters 		= new this.getters(this);
	this.res 			= new this.res(this);
	this.resList 		= new this.resList(this);
	this.e 				= new this.e(this);

	if (!Types.isObject(data)) {
		throw "SearchSelect data is not type of Object!";
	}
	this.setters.el(data.el);

	let props = data.data;
	if (!Types.isObject(props)) {
		props = {};
	}

	this.setters.handler(props.handler, true);
	this.setters.isShowAll(props.isShowAll, true);
	this.setters.isEBeforeChange(props.isEBeforeChange, true);
	if (this.isEBeforeChange) {
		this.setters.eBeforeChange(props.eBeforeChange);
	}
	this.setters.ajaxErrorMsg(props.ajaxErrorMsg);
	this.setters.searchMinLen(props.searchMinLen, true);
	this.setters.classes(props.classes);
	this.setters.placeholder(props.placeholder);
	if (Types.isObject(props.selected)) {
		this.res.set(props.selected);
	} else {
		this.res.reset();
	}
	this.setters.constList(props.constList);
	this.setters.notFoundList(props.notFoundList);

	this.e.set();
};

SearchSelect.prototype = {
	// классы соответствующих элементов (исключительно пользовательский объект)
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
	placeholder: function () {
		this.attr 	= 'placeholder';
		this.val 	= 'Search';
	},

	// селекторы элементов (относительно основного блока)
	els: function () {
		this.token 		= 'input[name^=_token]';
		this.search		= 'input[name=search_val]';
		this.res		= 'input[type=hidden][name^=search]';
		this.resList	= 'ul[name=result_list]';
		this.list		= 'li';
	},
	// названия атрибутов для соответствующих свойств класса
	attrs: function () {
		this.handler			= "data-handler";
		this.isShowAll			= "data-is-show-all";
		this.isEBeforeChange	= "data-is-e-before-change";
		this.searchMinLen		= "data-search-min-len";
	},

	// показывать ли все значения списка при нажатии на пробел/при клике
	isShowAll: true,
	// вызывать ли обработчик перед присвоением скрытому полю выбранного пользователем значения
	isEBeforeChange: false,
	ajaxErrorMsg: "The request failed!",
	// минимальная длинна слова, с которой начинается поиск
	searchMinLen: 1,

	constList: [],
	notFoundList: [
		{ txt: "Nothing found!" }
	],

	setters: function (_this) {
		this.parent = _this;

		this.classes 		 = function (classes) {
			let _this = this.parent;
			let clas;

			if (Types.isObject(classes)) {
				for (clas in classes) {
					_this.classes[clas] = classes[clas];
				}
			}

			for (clas in _this.classes) {
				let cur_el = _this.getters.fullEl(clas);
				if (Types.isUndefined(cur_el)) {
					continue;
				}

				let classes_el = DOM.classGetList(cur_el);
				if (classes_el.length == 0) {
					let classes = _this.classes[clas].split(' ');
					for (let i = 0; i < classes.length; i++) {
						DOM.classAdd(cur_el, classes[i]);
					}
				}
			}
		};
		this.placeholder 	 = function (placeholder) {
			let _this = this.parent;
			let attr = _this.placeholder.attr;
			let search_el = _this.getters.searchEl();
			if (Types.isString(placeholder)) {
				DOM.setAttr(search_el, attr, placeholder);
			} else if (!DOM.hasAttr(search_el, attr)) {
				DOM.setAttr(search_el, attr, _this.placeholder.val);
			}
		};
		this.el 			 = function (el) {
			let _this = this.parent;
			if (!Types.isString(el)) {
				throw "SearchSelect data.el is not type of String!";
			}
			if (!DOM.isEl(el)) {
				throw "SearchSelect data.el does not exist!";
			}
			_this.els.el = el;
		};
		this.handler 		 = function (handler, isAuto = false) {
			// isAuto			- если true, то, если значение handler некорректно, попытается найт его в атрибуте
			let _this = this.parent;
			if (Types.isString(handler)) {
				_this.handler = handler;
			} else if (isAuto && DOM.hasAttr(_this.getters.el(), _this.attrs.handler)) {
				_this.handler = DOM.getAttr(_this.getters.el(), _this.attrs.handler);
			} else {
				throw "SearchSelect.handler is not define!";
			}
		};
		this.isShowAll 		 = function (isShowAll, isAuto = false) {
			// isAuto		- если true, то, если значение handler некорректно, попытается найти в атрибуте
			let _this = this.parent;
			if (Types.isBool(isShowAll)) {
				_this.isShowAll = isShowAll;
			} else if (isAuto && DOM.hasAttr(_this.getters.el(), _this.attrs.isShowAll)) {
				_this.isShowAll = Types.toBool(DOM.getAttr(_this.getters.el(), _this.attrs.isShowAll));
			}
		};
		this.isEBeforeChange = function (isEBeforeChange, isAuto = false) {
			// isAuto	- если true, то, если значение isEBeforeChange некорректно, попытается найти в атрибуте
			let _this = this.parent;
			if (Types.isBool(isEBeforeChange)) {
				_this.isEBeforeChange = isEBeforeChange;
			} else if (isAuto && DOM.hasAttr(_this.getters.el(), _this.attrs.isEBeforeChange)) {
				_this.isEBeforeChange = Types.toBool(DOM.getAttr(_this.getters.el(), _this.attrs.isEBeforeChange));
			}
		};
		this.eBeforeChange   = function (handler) {
			if (!Types.isFunction(handler)) {
				throw "You forgot to pass a handler for eBeforeChange!";
			}
			this.parent.eBeforeChange = handler;
		};
		this.ajaxErrorMsg	 = function (msg) {
			if (Types.isString(msg)) {
				this.parent.ajaxErrorMsg = msg;
			}
		};
		this.searchMinLen	 = function (searchMinLen, isAuto = false) {
			// isAuto	- если true, то, если значение searchMinLen некорректно, попытается найти в атрибуте
			let _this = this.parent;
			if (Types.isNumber(searchMinLen)) {
				_this.searchMinLen = searchMinLen;
			} else if (isAuto && DOM.hasAttr(_this.getters.el(), _this.attrs.searchMinLen)) {
				_this.searchMinLen = Types.toNumber(DOM.getAttr(_this.getters.el(), _this.attrs.searchMinLen));
			}
		};
		this.search			 = function (val) {
			let _this = this.parent;
			DOM.setVal(_this.getters.searchEl(), val);
		};
		this.res			 = function (res) {
			let _this = this.parent;
			DOM.setVal(_this.getters.resEl(), res);
		};
		this.constList		 = function (constList) {
			let _this = this.parent;
			if (Types.isObject(constList) || Types.isArray(constList)) {
				_this.constList = constList;
			}

			let const_list = _this.constList;
			for (let i = 0; i < const_list.length; i++) {
				const_list[i].type = ResItemTypes.const;
			}
			_this.resList.set(const_list);
		};
		this.notFoundList 	 = function (notFoundList) {
			let _this = this.parent;
			if (Types.isObject(notFoundList) || Types.isArray(notFoundList)) {
				_this.notFoundList = notFoundList;
			}

			let not_found_list = _this.notFoundList;
			for (let i = 0; i < not_found_list.length; i++) {
				if (!!not_found_list[i].class) {
					continue;
				}
				not_found_list[i].class = _this.classes.notFound;
			}
		}
	},

	getters: function (_this) {
		this.parent = _this;

		this.el = function () {
			return this.fullEl('el');
		};
		// возвращает полный селектор для элемента el
		this.fullEl 			= function (el) {
			let _this = this.parent;
			if (Types.isUndefined(_this.els[el])) {
				return undefined;
			}
			return _this.els[el] == _this.els.el ? _this.els[el] : _this.els.el + " " + _this.els[el];
		};
		this.searchEl 			= function () {
			return this.fullEl('search');
		};
		this.tokenEl 			= function () {
			return this.fullEl('token');
		};
		this.resEl 				= function () {
			return this.fullEl('res');
		};
		this.resListEl 			= function () {
			return this.fullEl('resList');
		};
		this.listEl 			= function () {
			return this.fullEl('list');
		};

		this.searchVal 			= function () {
			let _this = this.parent;
			if (!DOM.isEl(this.searchEl())) {
				throw "SearchSelect.els.search is not exist!";
			}

			return DOM.getVal(this.searchEl());
		};

		this.handler 			= function () {
			return this.parent.handler;
		};
		this.token				= function () {
			let token_el = this.tokenEl();
			if (DOM.isEl(token_el)) {
				return DOM.getVal(token_el);
			} else {
				return "";
			}
		}
		this.dataForHandler 	= function () {
			let __this = this;

			return {
				search:  __this.searchVal(),
				token: __this.token()
			};
		};
	},

	jsonToQuery: function (json) {
		if (!Types.isObject(json)) {
			throw "SearchSelect.jsonInQuery(json) - parameter json is not Object!";
		}
		let query = "";
		for (let q in json) {
			query += q + "=" + encodeURIComponent(json[q]) + "&";
		}

		return query;
	},
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

			DOM.addEventListener(_this.getters.searchEl(), "click", new SearchSelectEvent({
				SearchSelect: _this,
				handleEvent: __this.searchClick,
				isXHR: true
			}));
			DOM.addEventListener(_this.getters.searchEl(), "input", new SearchSelectEvent({
				SearchSelect: _this,
				handleEvent: __this.searchInput,
				isXHR: true
			}));
			DOM.addEventListener("html", "mouseup", new SearchSelectEvent({
				SearchSelect: _this,
				handleEvent: __this.htmlMouseUp
			}), true);
			DOM.addEventListener("html", "keyup", new SearchSelectEvent({
				SearchSelect: _this,
				handleEvent: __this.htmlKeyUp
			}));
			DOM.addEventListener(_this.getters.resListEl(), "click", new SearchSelectEvent({
				SearchSelect: _this,
				handleEvent: __this.resListClick
			}));
		};

		this.searchClick 	= function (e) {
			let _this = this.SearchSelect;

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
				} catch (e) {
					_this.resList.hide();
					console.error(e.name + " " + e.message + e.stack);
				}
			} else {
				_this.resList.reset();
				_this.resList.show();
			}
		};
		this.searchInput 	= function (e) {
			let _this = this.SearchSelect;

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
				} catch (e) {
					_this.resList.hide();
					console.error(e.name + " " + e.message + e.stack);
				}
			} else {
				_this.resList.hide();
			}
		};
		this.htmlKeyUp 		= function (e) {
			if (e.keyCode == 9) {
				this.SearchSelect.resList.hide();
			}
		};
		this.htmlMouseUp 	= function (e) {
			this.SearchSelect.resList.hide();
		};
		this.resListClick	= function (e) {
			let cur_li = new ResItem({
				el: e.target
			}, true);
			this.SearchSelect.res.set(cur_li);
		}
	},

	res: function (_this) {
		this.parent = _this;

		this.set 	= function (data) {
			if (!Types.isObject(data)) {
				throw "Result selected is not type of Object!";
			}
			let _this = this.parent;
			
			let val;
			let txt;
			if (data instanceof ResItem) {
				val = data.getters.val();
				txt = data.getters.txt();
			} else {
				val = data.val;
				txt = data.txt;
			}
			_this.setters.res(val);
			_this.setters.search(txt);
			DOM.setAttr(_this.getters.searchEl(), 'class',_this.classes.search + ' ' + _this.classes.resSelected);
		};
		this.reset 	= function () {
			let _this = this.parent;
			_this.setters.res("");
			DOM.setAttr(_this.getters.searchEl(), 'class',_this.classes.search + ' ' + _this.classes.resNotSelected);
		};
	},

	resList: function (_this) {
		this.parent = _this;

		this.set 	= function (resList) {
			if (!Types.isObject(resList) && !Types.isArray(resList)) {
				throw "SearchSelect.resList is not type of Array or Object!";
			}
			if (Types.isNull(resList)) {
				throw "SearchSelect.resList is null!";
			}
			let _this = this.parent;

			for (let i = 0; i < resList.length; i++) {
				let new_li = new ResItem(resList[i]);
				DOM.get(_this.getters.resListEl()).append(new_li.get());
			}
		};
		this.reset 	= function () {
			let _this = this.parent;
			let res_list = DOM.gets(_this.getters.listEl());
			for (let i = 0; i < res_list.length; i++) {
				let res_li = new ResItem({ el: res_list[i] }, true);
				if (res_li.getters.type() !== ResItemTypes.const) {
					res_li.remove();
				}
			}
		};

		this.show 	= function () {
			DOM.show(this.parent.getters.resListEl());
		};
		this.hide 	= function () {
			DOM.hide(this.parent.getters.resListEl());
		};
	},

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

ResItemTypes = {
	dyn: "dyn",
	const: "const"
};
ResItem = function (props, isGet = false) {
	this.attrs 		= new this.attrs();
	this.setters 	= new this.setters(this);
	this.getters 	= new this.getters(this);

	if (isGet) {
		let li_el = props.el;

		this.class 	= DOM.getAttr(li_el, this.attrs.class, false);
		this.val 	= DOM.getAttr(li_el, this.attrs.val, false);
		this.type 	= DOM.getAttr(li_el, this.attrs.type, false);
		this.txt 	= DOM.getTxt(li_el, false);

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
		if (!!props.txt) {
			this.setters.virtual.txt(props.txt);
		}

		this.create();
	}
};
ResItem.prototype = {
	docObj: null,

	tag: "li",
	class: "",
	val: "",
	type: ResItemTypes.dyn,
	txt: "",

	attrs: function () {
		this.class 	= "class";
		this.val 	= "data-val";
		this.type	= "data-type";
	},

	set: function (docObj) {
		this.docObj = docObj;
	},
	get: function () {
		return this.docObj;
	},

	create: function () {
		let li = DOM.create(this.tag);
		this.set(li);

		this.setters.document.class(this.getters.class());
		this.setters.document.val(this.getters.val());
		this.setters.document.type(this.getters.type());
		this.setters.document.txt(this.getters.txt());
	},
	remove: function () {
		this.get().remove();
		this.set(null);
	},

	setters: function (_this) {
		this.parent 	= _this;

		// protected methods
		this.virtual 	= function (__this) {
			this.parent = __this;

			this.class 	= function (_class) {
				this.parent.parent.class = _class;
			};
			this.val 	= function (val) {
				this.parent.parent.val = val;
			};
			this.type 	= function (type) {
				this.parent.parent.type = type;
			};
			this.txt 	= function (txt) {
				this.parent.parent.txt = txt;
			};
		};
		this.virtual 	= new this.virtual(this);
		this.document 	= function (__this) {
			this.parent = __this;

			this.class 	= function (_class) {
				let _this = this.parent.parent;
				DOM.setAttr(_this.get(), _this.attrs.class, _class, false);
			};
			this.val 	= function (val) {
				let _this = this.parent.parent;
				DOM.setAttr(_this.get(), _this.attrs.val, val, false);
			};
			this.type 	= function (type) {
				let _this = this.parent.parent;
				DOM.setAttr(_this.get(), _this.attrs.type, type, false);
			};
			this.txt 	= function (txt) {
				let _this = this.parent.parent;
				DOM.setTxt(_this.get(), txt, false);
			};
		};
		this.document 	= new this.document(this);

		// public methods
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
		this.txt 		= function (txt) {
			this.virtual.txt(txt);
			if (!Types.isNull(this.parent.get())) {
				this.document.txt(txt);
			}
		};
	},
	getters: function (_this) {
		this.parent = _this;

		this.tag 	= function () {
			return this.parent.tag;
		}
		this.class 	= function () {
			return this.parent.class;
		};
		this.val 	= function () {
			return this.parent.val;
		};
		this.type 	= function () {
			return this.parent.type;
		};
		this.txt 	= function () {
			return this.parent.txt;
		};
	}
};