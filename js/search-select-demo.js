let new_search_select = new SearchSelect(
    {
        el: '#search-select-demo',
        /*
        data: {
            classes: {
                main: 'search-select-block',
                // классы поля с поиском
                search: 'search-pole not-selected',
                // классы невидимого поля со значением списка
                res: 'result-selected',
                resList: 'result-list'
            },

            // путь к обработчику поиска
            handler: "search-select.php",
            // показывать ли все значения списка при нажатии на пробел/при клике
            isShowAll: true,
            // вызывать ли обработчик перед присвоением скрытому полю выбранного пользователем значения
            isEBeforeChange: false,

            // placeholder поля с поиском
            placeholder: "",
            // минимальная длинна слова, с которой начинается поиск
            searchMinLen: 1,
            searchVal: "",

            // атрибут value невидимого поля со значением списка
            resVal: '-1',
            defaultList: [
                { txt: "Все товары", 	val: "-1" },
                { txt: "Все заказчики", val: "-2" }
            ]
        }
         */
    }
);

console.log(new_search_select.classes);