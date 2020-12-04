SearchSelect = function (data) {
	this.setters.parent = this;
	this.getters.parent = this;
	this.resList.parent = this

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
	if (!!props.resVal) {
		this.setters.res(props.resVal);
	}
	if (Types.isObject(props.defaultList) || Types.isArray(props.defaultList)) {
		for (let i = 0; i < props.defaultList.length; i++) {
			props.defaultList[i].type = ResItemTypes.const;
		}
		this.resList.set(props.defaultList);
	}
	this.setters.notFoundList(props.notFoundList);
};

SearchSelect.prototype = {
	// классы соответствующих элементов (исключительно пользовательский объект)
	classes: {
		el: 		'search-select-block',
		search: 	'search-pole not-selected',		// классы поля с поиском
		res: 		'result-selected',				// классы невидимого поля со значением списка
		resList: 	'result-list'					// класс для списка
	},
	placeholder: {
		attr: 	'placeholder',
		val: 	'Search'
	},

	// селекторы элементов (относительно основного блока)
	els: {
		token: 		'input[name^=_token]',
		search: 	'input[name=search_val]',
		res: 		'input[name=search_select_result]',
		resList: 	'ul[name=result_list]',
		list:		'li'
	},
	// названия атрибутов для соответствующих свойств класса
	attrs: {
		handler: 			"data-handler",
		isShowAll: 			"data-is-show-all",
		isEBeforeChange: 	"data-is-e-before-change",
		searchMinLen: 		"data-search-min-len"
	},

	// показывать ли все значения списка при нажатии на пробел/при клике
	isShowAll: true,
	// вызывать ли обработчик перед присвоением скрытому полю выбранного пользователем значения
	isEBeforeChange: false,
	ajaxErrorMsg: "The request failed!",
	// минимальная длинна слова, с которой начинается поиск
	searchMinLen: 1,

	notFoundClass:	'not-result',
	notFoundList: [
		{ txt: "Nothing found!" }
	],

	setters: {
		parent: this,

		classes: function (classes) {
			let _this = this.parent;
			let clas;

			if (Types.isObject(classes)) {
				for (clas in classes) {
					_this.classes[clas] = classes[clas];
				}
			} else {
				for (clas in _this.classes) {
					let cur_el = _this.getters.fullEl(clas);
					if (Types.isUndefined(cur_el)) {
						continue;
					}
					let classes_el = DOM.get(cur_el).classList;
					let kol_classes = classes_el.length;
					if (kol_classes > 0) {
						_this.classes[clas] = "";
						for (let i = 0; i < kol_classes; i++) {
							_this.classes[clas] += classes_el[i];
							_this.classes[clas] += i == kol_classes - 1 ? "" : " ";
						}
					}
				}
			}

			for (clas in _this.classes) {
				let cur_el = _this.getters.fullEl(clas);
				if (Types.isUndefined(cur_el)) {
					continue;
				}
				let classes_el = DOM.get(cur_el).classList;
				let classes = _this.classes[clas].split(' ');

				for (let i = 0; i < classes.length; i++) {
					classes_el.add(classes[i]);
				}
			}
		},
		placeholder: function (placeholder) {
			let _this = this.parent;
			let attr = _this.placeholder.attr;
			let search_el = _this.getters.searchEl();
			if (Types.isString(placeholder)) {
				DOM.setAttr(search_el, attr, placeholder);
			} else if (!DOM.hasAttr(search_el, attr)) {
				DOM.setAttr(search_el, attr, _this.placeholder.val);
			}
		},

		el: function (el) {
			let _this = this.parent;
			if (!Types.isString(el)) {
				throw "SearchSelect data.el is not type of String!";
			}
			if (!DOM.isEl(el)) {
				throw "SearchSelect data.el does not exist!";
			}
			_this.els.el = el;
		},
		handler: function (handler, isAuto = false) {
			// isAuto			- если true, то, если значение handler некорректно, попытается найт его в атрибуте
			let _this = this.parent;
			if (Types.isString(handler)) {
				_this.handler = handler;
			} else if (isAuto && DOM.hasAttr(_this.getters.el(), _this.attrs.handler)) {
				_this.handler = DOM.getAttr(_this.getters.el(), _this.attrs.handler);
			} else {
				throw "SearchSelect.handler is not define!";
			}
		},
		isShowAll: function (isShowAll, isAuto = false) {
			// isAuto		- если true, то, если значение handler некорректно, попытается найти в атрибуте
			let _this = this.parent;
			if (Types.isBool(isShowAll)) {
				_this.isShowAll = isShowAll;
			} else if (isAuto && DOM.hasAttr(_this.getters.el(), _this.attrs.isShowAll)) {
				_this.isShowAll = Types.toBool(DOM.getAttr(_this.getters.el(), _this.attrs.isShowAll));
			}
		},
		isEBeforeChange: function (isEBeforeChange, isAuto = false) {
			// isAuto	- если true, то, если значение isEBeforeChange некорректно, попытается найти в атрибуте
			let _this = this.parent;
			if (Types.isBool(isEBeforeChange)) {
				_this.isEBeforeChange = isEBeforeChange;
			} else if (isAuto && DOM.hasAttr(_this.getters.el(), _this.attrs.isEBeforeChange)) {
				_this.isEBeforeChange = Types.toBool(DOM.getAttr(_this.getters.el(), _this.attrs.isEBeforeChange));
			}
		},
		eBeforeChange: function (handler) {
			if (!Types.isFunction(handler)) {
				throw "You forgot to pass a handler for eBeforeChange!";
			}
			this.parent.eBeforeChange = handler;
		},
		ajaxErrorMsg: function (msg) {
			if (Types.isString(msg)) {
				this.parent.ajaxErrorMsg = msg;
			}
		},
		searchMinLen: function (searchMinLen, isAuto = false) {
			// isAuto	- если true, то, если значение searchMinLen некорректно, попытается найти в атрибуте
			let _this = this.parent;
			if (Types.isNumber(searchMinLen)) {
				_this.searchMinLen = searchMinLen;
			} else if (isAuto && DOM.hasAttr(_this.getters.el(), _this.attrs.searchMinLen)) {
				_this.searchMinLen = Types.toNumber(DOM.getAttr(_this.getters.el(), _this.attrs.searchMinLen));
			}
		},
		res: function (res) {
			let _this = this.parent;
			DOM.setVal(_this.getters.resEl(), res);
		},
		notFoundList: function (notFoundList) {
			let _this = this.parent;
			if (Types.isObject(notFoundList) || Types.isArray(notFoundList)) {
				_this.notFoundList = notFoundList;
			}

			let not_found_list = _this.notFoundList;
			for (let i = 0; i < not_found_list.length; i++) {
				if (!!not_found_list[i].class) {
					continue;
				}
				not_found_list[i].class = _this.notFoundClass;
			}
		}
	},

	getters: {
		parent: this,

		el: function () {
			return this.fullEl('el');
		},
		// возвращает полный селектор для элемента el
		fullEl: function (el) {
			let _this = this.parent;
			if (Types.isUndefined(_this.els[el])) {
				return undefined;
			}
			return _this.els[el] == _this.els.el ? _this.els[el] : _this.els.el + " " + _this.els[el];
		},
		searchEl: function () {
			return this.fullEl('search');
		},
		tokenEl: function () {
			return this.fullEl('token');
		},
		resEl: function () {
			return this.fullEl('res');
		},
		resListEl: function () {
			return this.fullEl('resList');
		},
		listEl: function () {
			return this.fullEl('list');
		},

		searchVal: function () {
			let _this = this.parent;
			if (!DOM.isEl(this.searchEl())) {
				throw "SearchSelect.els.search is not exist!";
			}

			return DOM.getVal(this.searchEl());
		},

		handler: function () {
			return this.parent.handler;
		},
		dataForHandler: function () {
			let data = {
				val:  this.searchVal()
			};
			if (DOM.isEl(this.tokenEl())) {
				data['token'] = DOM.getVal(this.tokenEl());
			}

			return data;
		}
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
	},

	/*
	e: {
		parent: this,

		set: function () {
			let _this = this.parent;
			if (_this.isShowAll) {
				DOM.addEventListener(_this.getters.searchEl(), "click", this.searchClick.fun);
			}
		},

		searchClick: {
			parent: this,

			isFreedom: true,
			fun: function (e) {
				if (!this.isFreedom) {
					return;
				}

				let _this = this.parent.parent;
				let __this = this;
				this.isFreedom = false;

				let query = {
					isAll: 1
				};
				_this.send(query, function (data) {
					_this.resList.reset();
					_this.resList.set(data);
					_this.resList.show();
					__this.isFreedom = true;
					console.log("ttt");
				});
			}
		}
	},
	 */

	resList: {
		parent: this,

		set: function (resList) {
			if (!Types.isObject(resList) && !Types.isArray(resList)) {
				throw "SearchSelect.resList is not type of Array or Object!";
			}
			let _this = this.parent;

			for (let i = 0; i < resList.length; i++) {
				let new_li = new ResItem(resList[i]);
				DOM.get(_this.getters.resListEl()).append(new_li.get());
			}
		},
		reset: function () {
			let _this = this.parent;
			let res_list = DOM.gets(_this.getters.listEl());
			for (let i = 0; i < res_list.length; i++) {
				let res_li = res_list[i];
				if (DOM.getAttr(res_li, ResItem.prototype.attrs.type) !== ResItemTypes.const) {
					res_li.remove();
				}
			}
		},

		show: function () {
			DOM.show(this.parent.getters.resListEl());
		},
		hide: function () {
			DOM.hide(this.parent.getters.resListEl());
		}
	}
};

ResItemTypes = {
	dyn: "dyn",
	const: "const"
};
ResItem = function (props, isGet = false) {
	this.getters.parent = this;

	if (isGet) {
		let li_el = props.el;

		this.val = DOM.getAttr(li_el, this.attrs.val);
		this.txt = DOM.getTxt(li_el);
		this.type = DOM.getAttr(li_el, this.attrs.type);

		this.set(DOM.get(li_el));
	} else {
		let li = DOM.create(this.tag);

		if (!!props.val) {
			DOM.setAttr(li, this.attrs.val, props.val, false);
		} else {
			DOM.setAttr(li, this.attrs.val, this.val, false);
		}
		DOM.setTxt(li, props.txt, false);
		if (!!props.type) {
			DOM.setAttr(li, this.attrs.type, props.type, false);
		} else {
			DOM.setAttr(li, this.attrs.type, this.type, false);
		}

		this.set(li);
	}
};
ResItem.prototype = {
	docObj: null,

	tag: "li",
	val: "",
	txt: "",
	type: ResItemTypes.dyn,

	attrs: {
		val: "data-val",
		type: "data-type"
	},

	set: function (docObj) {
		this.docObj = docObj;
	},
	get: function () {
		return this.docObj;
	},

	getters: {
		parent: this,

		tag: function () {
			return this.parent.tag;
		}
	}
};