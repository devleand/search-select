SearchSelect = function (data) {
	this.setters.parent = this;
	this.getters.parent = this;

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
	this.setters.searchMinLen(props.searchMinLen, true);
	this.setters.classes(props.classes);
	this.setters.placeholder(props.placeholder);
	if (!!props.resVal) {
		this.setters.res(props.resVal);
	}
	if (Types.isObject(props.defaultList) || Types.isArray(props.defaultList)) {
		for (let i = 0; i < props.defaultList.length; i++) {
			props.defaultList[i].type = 'const';
		}
		this.setters.resList(props.defaultList);
	}
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
		attr: 'placeholder',
		val: 'Search'
	},

	// селекторы элементов (относительно основного блока)
	els: {
		token: 		'input[name^=_token]',
		search: 	'input[name=search_val]',
		res: 		'input[name=search_select_result]',
		resList: 	'ul[name=result_list]'
	},
	// названия атрибутов для соответствующих свойств класса
	attrs: {
		handler: "data-handler",
		isShowAll: "data-is-show-all",
		isEBeforeChange: "data-is-e-before-change",
		searchMinLen: "data-search-min-len"
	},

	// показывать ли все значения списка при нажатии на пробел/при клике
	isShowAll: true,
	// вызывать ли обработчик перед присвоением скрытому полю выбранного пользователем значения
	isEBeforeChange: false,
	// минимальная длинна слова, с которой начинается поиск
	searchMinLen: 1,

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
					let classes_el = DOM.get(_this.getters.fullEl(clas)).classList;
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
				let classes_el = DOM.get(_this.getters.fullEl(clas)).classList;
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
		resList: function (resList) {
			if (!Types.isObject(resList) && !Types.isArray(resList)) {
				throw "SearchSelect.resList is not type of Array or Object!";
			}
			let _this = this.parent;

			for (let i = 0; i < resList.length; i++) {
				let new_li = new ResItem(resList[i]);
				DOM.get(_this.getters.resListEl()).append(new_li.get());
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

		searchVal: function () {
			let _this = this.parent;
			if (!DOM.isEl(this.searchEl())) {
				throw "SearchSelect.els.search is not exist!";
			}

			return DOM.getVal(this.searchEl());
		},

		dataForHandler: function () {
			let _this = this.parent;
			let __this = this;

			let data = {
				val: __this.searchVal()
			};
			if (DOM.isEl(this.tokenEl())) {
				data['token'] = DOM.getVal(this.tokenEl());
			}

			return data;
		}
	}
};

ResItem = function (props, isGet = false) {
	if (isGet) {
		let li_el = props.el;

		this.val = DOM.getAttr(li_el, this.attrs.val);
		this.txt = DOM.getTxt(li_el);
		this.type = DOM.getAttr(li_el, this.attrs.type);

		this.set(DOM.get(li_el));
	} else {
		let li = DOM.create(this.tag);

		DOM.setAttr(li, this.attrs.val, props.val, false);
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
	type: "dyn",

	attrs: {
		val: "data-val",
		type: "data-type"
	},

	set: function (docObj) {
		this.docObj = docObj;
	},
	get: function () {
		return this.docObj;
	}
};