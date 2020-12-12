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
                resList: 'result-list',
                notFound: 'not-result',
                resSelected: 'selected',
                resNotSelected: 'not-selected'
            },

            // путь к обработчику поиска
            handler: "search-select.php",
            // показывать ли все значения списка при клике
            isShowAll: true,
            // вызывать ли обработчик перед присвоением скрытому полю выбранного пользователем значения
            isEBeforeChange: true,
            // Сам обработчик - класс или функция. Если класс, то будет вызван метод handler
			// Функция-обработчик принимает 1 аргумент - { txt: "Selected text", val: "Selected value" }
            eBeforeChange: function (data) {},
            // данное сообщение будет выведено, если запрос к handler не удастся
            ajaxErrorMsg: "",

            // placeholder поля с поиском
            placeholder: "",
            // минимальная длинна слова, с которой начинается поиск
            searchMinLen: 1,
            searchVal: "",

            selected: { txt: "Все товары", 	val: "-1" },
            constList: [
                { txt: "Все товары", 	val: "-1" },
                { txt: "Все заказчики", val: "-2" }
            ],
            notFoundList: [
                { txt: "Ничего не найдено"   },
                { txt: "Попробуйте ещё раз!" }
            ]
        }
         */
    }
);

//console.log(new_search_select);