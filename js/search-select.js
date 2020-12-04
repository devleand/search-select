Vue.component('search-select', {
	props: {
		classes: {
			type: Object,
			default: function() {
				return {
					main: 'search-select-block',
					// классы поля с поиском
					search: 'search-pole not-selected',
					// классы невидимого поля со значением списка
					res: 'result-selected',
					resList: 'result-list'
				};
			}
		},

		// путь к обработчику поиска
		handler: {
			type: String,
			required: true
		},
		// показывать ли все значения списка при нажатии на пробел/при клике
		isShowAll: {
			type: Boolean,
			default: true
		},
		// вызывать ли обработчик перед присвоением скрытому полю выбранного пользователем значения
		isEBeforeChange: {
			type: Boolean,
			default: false
		},

		// placeholder поля с поиском
		placeholder: {
			type: String,
			default: ""
		},
		// минимальная длинна слова, с которой начинается поиск
		searchMinLen: {
			type: Number,
			default: 1
		},
		searchVal: {
			type: String,
			default: ""
		},

		// атрибуты name и value невидимого поля со значением списка
		res: {
			type: Object,
			default: function() {
				return {
					val: '',
					name: 'search_select_result'
				};
			}
		},
		defaultList: {
			type: Array,
			default: function() {
				return [];
			}
		}
	},

	template:
		'<div v-bind:class = "classes.main" v-bind:data-handler = "handler" v-bind:data-is-show-all = "isShowAll" v-bind:data-is-e-before-change = "isEBeforeChange" v-bind:data-search-min-len = "searchMinLen">' +
		'    <input type = "search" v-bind:class = "classes.search" v-bind:placeholder = "placeholder" v-bind:value = "searchVal">' +
		'    <input v-bind:class = "classes.res" type = "hidden" v-bind:value = "res.val" v-bind:name = "res.name">' +
		'    <ul v-bind:class = "classes.resList">' +
		'		<li ' +
		'			v-for = "li in defaultList"' +
		'			v-bind:data-value = "li.val"'+
		'			data-type = "const"' +
		'		>{{ li.txt }}</li>' +
		'	</ul>' +
		'</div>'
});

let new_search_select = new Vue({
	el: '#search-select-demo'
});