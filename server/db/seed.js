'use strict';

const { db, init } = require('./database');
const bcrypt = require('bcryptjs');

const RESET = process.argv.includes('--reset');

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const rnd  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const GENRES = [
  { name: 'Классика',           description: 'Великие произведения мировой литературы',  color: '#8B4513' },
  { name: 'Антиутопия',         description: 'Мрачные образы будущего общества',          color: '#2F4F4F' },
  { name: 'Научная фантастика', description: 'Исследование науки и будущего',             color: '#4169E1' },
  { name: 'Фэнтези',            description: 'Магические миры и приключения',             color: '#6A0DAD' },
  { name: 'Детектив',           description: 'Загадки и расследования',                   color: '#8B0000' },
  { name: 'Биография',          description: 'Реальные жизни и истории',                  color: '#DAA520' },
  { name: 'Психология',         description: 'Наука о поведении и разуме',                color: '#20B2AA' },
  { name: 'История',            description: 'События и личности прошлого',               color: '#CD853F' },
  { name: 'Триллер',            description: 'Напряжение, саспенс, неожиданные повороты', color: '#DC143C' },
  { name: 'Роман',              description: 'Истории о любви и человеческих отношениях', color: '#DB7093' },
  { name: 'Философия',          description: 'Размышления о смысле бытия',                color: '#708090' },
  { name: 'Саморазвитие',       description: 'Инструменты для роста и продуктивности',    color: '#3CB371' }
];

const BOOKS = [
  { title: 'Мастер и Маргарита',               author: 'Михаил Булгаков',                genre: 'Классика',           year: 1967, pages: 480  },
  { title: 'Преступление и наказание',         author: 'Фёдор Достоевский',              genre: 'Классика',           year: 1866, pages: 671  },
  { title: 'Война и мир',                      author: 'Лев Толстой',                    genre: 'Классика',           year: 1869, pages: 1440 },
  { title: 'Анна Каренина',                    author: 'Лев Толстой',                    genre: 'Классика',           year: 1878, pages: 964  },
  { title: 'Идиот',                            author: 'Фёдор Достоевский',              genre: 'Классика',           year: 1869, pages: 639  },
  { title: 'Братья Карамазовы',                author: 'Фёдор Достоевский',              genre: 'Классика',           year: 1880, pages: 940  },
  { title: 'Мёртвые души',                     author: 'Николай Гоголь',                 genre: 'Классика',           year: 1842, pages: 352  },
  { title: 'Отцы и дети',                      author: 'Иван Тургенев',                  genre: 'Классика',           year: 1862, pages: 224  },
  { title: 'Обломов',                          author: 'Иван Гончаров',                  genre: 'Классика',           year: 1859, pages: 496  },
  { title: 'Евгений Онегин',                   author: 'Александр Пушкин',               genre: 'Классика',           year: 1833, pages: 224  },
  { title: 'Герой нашего времени',             author: 'Михаил Лермонтов',               genre: 'Классика',           year: 1840, pages: 192  },
  { title: 'Великий Гэтсби',                   author: 'Фрэнсис Скотт Фицджеральд',     genre: 'Классика',           year: 1925, pages: 218  },
  { title: 'Старик и море',                    author: 'Эрнест Хемингуэй',               genre: 'Классика',           year: 1952, pages: 128  },
  { title: 'По ком звонит колокол',            author: 'Эрнест Хемингуэй',               genre: 'Классика',           year: 1940, pages: 480  },
  { title: 'Убить пересмешника',               author: 'Харпер Ли',                      genre: 'Классика',           year: 1960, pages: 336  },
  { title: 'Над пропастью во ржи',             author: 'Джером Сэлинджер',               genre: 'Классика',           year: 1951, pages: 277  },
  { title: 'Портрет Дориана Грея',             author: 'Оскар Уайльд',                   genre: 'Классика',           year: 1890, pages: 254  },
  { title: 'Гордость и предубеждение',         author: 'Джейн Остин',                    genre: 'Классика',           year: 1813, pages: 432  },
  { title: 'Джейн Эйр',                        author: 'Шарлотта Бронте',                genre: 'Классика',           year: 1847, pages: 507  },
  { title: '1984',                             author: 'Джордж Оруэлл',                  genre: 'Антиутопия',         year: 1949, pages: 328  },
  { title: 'О дивный новый мир',               author: 'Олдос Хаксли',                   genre: 'Антиутопия',         year: 1932, pages: 311  },
  { title: 'Скотный двор',                     author: 'Джордж Оруэлл',                  genre: 'Антиутопия',         year: 1945, pages: 112  },
  { title: 'Мы',                               author: 'Евгений Замятин',                genre: 'Антиутопия',         year: 1924, pages: 224  },
  { title: 'Рассказ служанки',                 author: 'Маргарет Этвуд',                 genre: 'Антиутопия',         year: 1985, pages: 311  },
  { title: 'Повелитель мух',                   author: 'Уильям Голдинг',                 genre: 'Антиутопия',         year: 1954, pages: 224  },
  { title: 'Fahrenheit 451',                   author: 'Рэй Брэдбери',                   genre: 'Антиутопия',         year: 1953, pages: 256  },
  { title: 'Голодные игры',                    author: 'Сьюзен Коллинз',                 genre: 'Антиутопия',         year: 2008, pages: 374  },
  { title: 'Дюна',                             author: 'Фрэнк Герберт',                  genre: 'Научная фантастика', year: 1965, pages: 688  },
  { title: 'Автостопом по галактике',          author: 'Дуглас Адамс',                   genre: 'Научная фантастика', year: 1979, pages: 224  },
  { title: 'Основание',                        author: 'Айзек Азимов',                   genre: 'Научная фантастика', year: 1951, pages: 255  },
  { title: 'Я, робот',                         author: 'Айзек Азимов',                   genre: 'Научная фантастика', year: 1950, pages: 253  },
  { title: 'Конец вечности',                   author: 'Айзек Азимов',                   genre: 'Научная фантастика', year: 1955, pages: 256  },
  { title: 'Марсианин',                        author: 'Энди Уэйр',                      genre: 'Научная фантастика', year: 2011, pages: 369  },
  { title: 'Игра Эндера',                      author: 'Орсон Скотт Кард',               genre: 'Научная фантастика', year: 1985, pages: 352  },
  { title: 'Нейромант',                        author: 'Уильям Гибсон',                  genre: 'Научная фантастика', year: 1984, pages: 271  },
  { title: 'Солярис',                          author: 'Станислав Лем',                  genre: 'Научная фантастика', year: 1961, pages: 204  },
  { title: 'Пикник на обочине',                author: 'Аркадий и Борис Стругацкие',     genre: 'Научная фантастика', year: 1972, pages: 224  },
  { title: 'Трудно быть богом',                author: 'Аркадий и Борис Стругацкие',     genre: 'Научная фантастика', year: 1964, pages: 232  },
  { title: 'Гиперион',                         author: 'Дэн Симмонс',                    genre: 'Научная фантастика', year: 1989, pages: 482  },
  { title: 'Задача трёх тел',                  author: 'Лю Цысинь',                      genre: 'Научная фантастика', year: 2008, pages: 400  },
  { title: 'Цветы для Элджернона',             author: 'Дэниел Киз',                     genre: 'Научная фантастика', year: 1966, pages: 311  },
  { title: 'Левая рука тьмы',                  author: 'Урсула Ле Гуин',                 genre: 'Научная фантастика', year: 1969, pages: 300  },
  { title: 'Властелин колец',                  author: 'Дж. Р. Р. Толкин',               genre: 'Фэнтези',            year: 1954, pages: 1178 },
  { title: 'Хоббит',                           author: 'Дж. Р. Р. Толкин',               genre: 'Фэнтези',            year: 1937, pages: 310  },
  { title: 'Гарри Поттер и философский камень', author: 'Дж. К. Роулинг',                genre: 'Фэнтези',            year: 1997, pages: 309  },
  { title: 'Гарри Поттер и тайная комната',    author: 'Дж. К. Роулинг',                 genre: 'Фэнтези',            year: 1998, pages: 341  },
  { title: 'Гарри Поттер и узник Азкабана',    author: 'Дж. К. Роулинг',                 genre: 'Фэнтези',            year: 1999, pages: 435  },
  { title: 'Гарри Поттер и Кубок огня',        author: 'Дж. К. Роулинг',                 genre: 'Фэнтези',            year: 2000, pages: 636  },
  { title: 'Гарри Поттер и орден Феникса',     author: 'Дж. К. Роулинг',                 genre: 'Фэнтези',            year: 2003, pages: 870  },
  { title: 'Игра престолов',                   author: 'Джордж Р. Р. Мартин',            genre: 'Фэнтези',            year: 1996, pages: 694  },
  { title: 'Битва королей',                    author: 'Джордж Р. Р. Мартин',            genre: 'Фэнтези',            year: 1998, pages: 743  },
  { title: 'Буря мечей',                       author: 'Джордж Р. Р. Мартин',            genre: 'Фэнтези',            year: 2000, pages: 973  },
  { title: 'Ведьмак: Последнее желание',       author: 'Анджей Сапковский',              genre: 'Фэнтези',            year: 1993, pages: 288  },
  { title: 'Кровь эльфов',                     author: 'Анджей Сапковский',              genre: 'Фэнтези',            year: 1994, pages: 307  },
  { title: 'Меч предназначения',               author: 'Анджей Сапковский',              genre: 'Фэнтези',            year: 1992, pages: 352  },
  { title: 'Имя ветра',                        author: 'Патрик Ротфусс',                 genre: 'Фэнтези',            year: 2007, pages: 662  },
  { title: 'Американские боги',                author: 'Нил Гейман',                     genre: 'Фэнтези',            year: 2001, pages: 465  },
  { title: 'Хорошие предзнаменования',         author: 'Терри Пратчетт, Нил Гейман',     genre: 'Фэнтези',            year: 1990, pages: 288  },
  { title: 'Эрагон',                           author: 'Кристофер Паолини',              genre: 'Фэнтези',            year: 2003, pages: 503  },
  { title: 'Тёмные начала',                    author: 'Филип Пулман',                   genre: 'Фэнтези',            year: 1995, pages: 399  },
  { title: 'Убийство в Восточном экспрессе',   author: 'Агата Кристи',                   genre: 'Детектив',           year: 1934, pages: 256  },
  { title: 'Десять негритят',                  author: 'Агата Кристи',                   genre: 'Детектив',           year: 1939, pages: 272  },
  { title: 'Убийство в доме викария',          author: 'Агата Кристи',                   genre: 'Детектив',           year: 1930, pages: 256  },
  { title: 'Приключения Шерлока Холмса',       author: 'Артур Конан Дойл',               genre: 'Детектив',           year: 1892, pages: 307  },
  { title: 'Собака Баскервилей',               author: 'Артур Конан Дойл',               genre: 'Детектив',           year: 1902, pages: 256  },
  { title: 'Девушка с татуировкой дракона',    author: 'Стиг Ларссон',                   genre: 'Детектив',           year: 2005, pages: 533  },
  { title: 'Острые предметы',                  author: 'Гиллиан Флинн',                  genre: 'Детектив',           year: 2006, pages: 254  },
  { title: 'Исчезнувшая',                      author: 'Гиллиан Флинн',                  genre: 'Детектив',           year: 2012, pages: 422  },
  { title: 'В лесу',                           author: 'Тана Френч',                     genre: 'Детектив',           year: 2007, pages: 444  },
  { title: 'Тайная история',                   author: 'Донна Тартт',                    genre: 'Детектив',           year: 1992, pages: 559  },
  { title: 'Щегол',                            author: 'Донна Тартт',                    genre: 'Детектив',           year: 2013, pages: 771  },
  { title: 'Стив Джобс',                       author: 'Уолтер Айзексон',                genre: 'Биография',          year: 2011, pages: 656  },
  { title: 'Илон Маск',                        author: 'Уолтер Айзексон',                genre: 'Биография',          year: 2023, pages: 615  },
  { title: 'Долгий путь к свободе',            author: 'Нельсон Мандела',                genre: 'Биография',          year: 1994, pages: 656  },
  { title: 'Моя история',                      author: 'Мишель Обама',                   genre: 'Биография',          year: 2018, pages: 448  },
  { title: 'Открытие',                         author: 'Мари Кюри',                      genre: 'Биография',          year: 1923, pages: 248  },
  { title: 'Воспоминания, сновидения, размышления', author: 'Карл Густав Юнг',           genre: 'Биография',          year: 1962, pages: 416  },
  { title: 'Исповедь',                         author: 'Лев Толстой',                    genre: 'Биография',          year: 1882, pages: 128  },
  { title: 'Открытое письмо',                  author: 'Ричард Фейнман',                 genre: 'Биография',          year: 1985, pages: 352  },
  { title: 'Думай медленно — решай быстро',    author: 'Даниэль Канеман',                genre: 'Психология',         year: 2011, pages: 499  },
  { title: 'Sapiens. Краткая история человечества', author: 'Юваль Ной Харари',          genre: 'Психология',         year: 2011, pages: 512  },
  { title: 'Влияние. Психология убеждения',    author: 'Роберт Чалдини',                 genre: 'Психология',         year: 1984, pages: 304  },
  { title: '48 законов власти',                author: 'Роберт Грин',                    genre: 'Психология',         year: 1998, pages: 452  },
  { title: 'Игры, в которые играют люди',      author: 'Эрик Берн',                      genre: 'Психология',         year: 1964, pages: 287  },
  { title: 'Человек в поисках смысла',         author: 'Виктор Франкл',                  genre: 'Психология',         year: 1946, pages: 156  },
  { title: 'Антихрупкость',                    author: 'Нассим Николас Талеб',           genre: 'Психология',         year: 2012, pages: 519  },
  { title: 'Чёрный лебедь',                    author: 'Нассим Николас Талеб',           genre: 'Психология',         year: 2007, pages: 400  },
  { title: 'Поток',                            author: 'Михай Чиксентмихайи',            genre: 'Психология',         year: 1990, pages: 303  },
  { title: 'Искусство любить',                 author: 'Эрих Фромм',                     genre: 'Психология',         year: 1956, pages: 144  },
  { title: 'Иметь или быть',                   author: 'Эрих Фромм',                     genre: 'Психология',         year: 1976, pages: 271  },
  { title: 'Бег с волками',                    author: 'Кларисса Пинкола Эстес',         genre: 'Психология',         year: 1992, pages: 520  },
  { title: 'Краткая история времени',          author: 'Стивен Хокинг',                  genre: 'История',            year: 1988, pages: 212  },
  { title: 'Homo Deus',                        author: 'Юваль Ной Харари',               genre: 'История',            year: 2015, pages: 448  },
  { title: '21 урок для XXI века',             author: 'Юваль Ной Харари',               genre: 'История',            year: 2018, pages: 384  },
  { title: 'Происхождение видов',              author: 'Чарльз Дарвин',                  genre: 'История',            year: 1859, pages: 502  },
  { title: 'Государь',                         author: 'Никколо Макиавелли',             genre: 'История',            year: 1532, pages: 176  },
  { title: 'Записки о галльской войне',        author: 'Гай Юлий Цезарь',               genre: 'История',            year: -51,  pages: 289  },
  { title: 'Искусство войны',                  author: 'Сунь-цзы',                       genre: 'История',            year: -500, pages: 112  },
  { title: 'Гибель Запада',                    author: 'Освальд Шпенглер',               genre: 'История',            year: 1918, pages: 448  },
  { title: 'Третий рейх: от прихода к власти', author: 'Уильям Ширер',                   genre: 'История',            year: 1960, pages: 1249 },
  { title: 'Молчание ягнят',                   author: 'Томас Харрис',                   genre: 'Триллер',            year: 1988, pages: 338  },
  { title: 'Код да Винчи',                     author: 'Дэн Браун',                      genre: 'Триллер',            year: 2003, pages: 454  },
  { title: 'Ангелы и демоны',                  author: 'Дэн Браун',                      genre: 'Триллер',            year: 2000, pages: 616  },
  { title: 'Оно',                              author: 'Стивен Кинг',                    genre: 'Триллер',            year: 1986, pages: 1138 },
  { title: 'Сияние',                           author: 'Стивен Кинг',                    genre: 'Триллер',            year: 1977, pages: 447  },
  { title: 'Мизери',                           author: 'Стивен Кинг',                    genre: 'Триллер',            year: 1987, pages: 310  },
  { title: 'Зелёная миля',                     author: 'Стивен Кинг',                    genre: 'Триллер',            year: 1996, pages: 400  },
  { title: 'Девочка, которая застряла в паутине', author: 'Давид Лагеркранц',            genre: 'Триллер',            year: 2015, pages: 416  },
  { title: 'Чужак',                            author: 'Альбер Камю',                    genre: 'Триллер',            year: 1942, pages: 159  },
  { title: 'Сто лет одиночества',              author: 'Габриэль Гарсиа Маркес',         genre: 'Роман',              year: 1967, pages: 417  },
  { title: 'Любовь во время чумы',             author: 'Габриэль Гарсиа Маркес',         genre: 'Роман',              year: 1985, pages: 348  },
  { title: 'Маленький принц',                  author: 'Антуан де Сент-Экзюпери',        genre: 'Роман',              year: 1943, pages: 96   },
  { title: 'Алхимик',                          author: 'Пауло Коэльо',                   genre: 'Роман',              year: 1988, pages: 208  },
  { title: 'Три товарища',                     author: 'Эрих Мария Ремарк',              genre: 'Роман',              year: 1936, pages: 432  },
  { title: 'Триумфальная арка',                author: 'Эрих Мария Ремарк',              genre: 'Роман',              year: 1945, pages: 480  },
  { title: 'На западном фронте без перемен',   author: 'Эрих Мария Ремарк',              genre: 'Роман',              year: 1929, pages: 296  },
  { title: 'Грозовой перевал',                 author: 'Эмили Бронте',                   genre: 'Роман',              year: 1847, pages: 342  },
  { title: 'Красное и чёрное',                 author: 'Стендаль',                       genre: 'Роман',              year: 1830, pages: 558  },
  { title: 'Норвежский лес',                   author: 'Харуки Мураками',                genre: 'Роман',              year: 1987, pages: 296  },
  { title: 'Кафка на пляже',                   author: 'Харуки Мураками',                genre: 'Роман',              year: 2002, pages: 505  },
  { title: 'Охота на овец',                    author: 'Харуки Мураками',                genre: 'Роман',              year: 1982, pages: 320  },
  { title: '1Q84',                             author: 'Харуки Мураками',                genre: 'Роман',              year: 2009, pages: 928  },
  { title: 'Так говорил Заратустра',           author: 'Фридрих Ницше',                  genre: 'Философия',          year: 1883, pages: 352  },
  { title: 'По ту сторону добра и зла',        author: 'Фридрих Ницше',                  genre: 'Философия',          year: 1886, pages: 256  },
  { title: 'Бытие и время',                    author: 'Мартин Хайдеггер',               genre: 'Философия',          year: 1927, pages: 589  },
  { title: 'Критика чистого разума',           author: 'Иммануил Кант',                  genre: 'Философия',          year: 1781, pages: 784  },
  { title: 'Государство',                      author: 'Платон',                         genre: 'Философия',          year: -380, pages: 416  },
  { title: 'Миф о Сизифе',                     author: 'Альбер Камю',                    genre: 'Философия',          year: 1942, pages: 128  },
  { title: 'Тошнота',                          author: 'Жан-Поль Сартр',                genre: 'Философия',          year: 1938, pages: 253  },
  { title: 'Дао Дэ Цзин',                      author: 'Лао-цзы',                        genre: 'Философия',          year: -600, pages: 112  },
  { title: 'Размышления',                      author: 'Марк Аврелий',                   genre: 'Философия',          year: 175,  pages: 254  },
  { title: 'Этика',                            author: 'Бенедикт Спиноза',               genre: 'Философия',          year: 1677, pages: 288  },
  { title: '7 навыков высокоэффективных людей', author: 'Стивен Кови',                   genre: 'Саморазвитие',       year: 1989, pages: 432  },
  { title: 'Думай и богатей',                  author: 'Наполеон Хилл',                  genre: 'Саморазвитие',       year: 1937, pages: 320  },
  { title: 'Сила настоящего',                  author: 'Экхарт Толле',                   genre: 'Саморазвитие',       year: 1997, pages: 229  },
  { title: 'Атомные привычки',                 author: 'Джеймс Клир',                    genre: 'Саморазвитие',       year: 2018, pages: 320  },
  { title: 'Глубокая работа',                  author: 'Кэл Ньюпорт',                    genre: 'Саморазвитие',       year: 2016, pages: 296  },
  { title: 'Сила воли',                        author: 'Келли Макгонигал',               genre: 'Саморазвитие',       year: 2011, pages: 282  },
  { title: 'Не давай себе умереть',            author: 'Дэвид Гоггинс',                  genre: 'Саморазвитие',       year: 2018, pages: 363  },
  { title: 'Магия утра',                       author: 'Хэл Элрод',                      genre: 'Саморазвитие',       year: 2012, pages: 194  },
  { title: 'Эссенциализм',                     author: 'Грег МакКеон',                   genre: 'Саморазвитие',       year: 2014, pages: 260  },
  { title: 'Принцип 80/20',                    author: 'Ричард Кох',                     genre: 'Саморазвитие',       year: 1997, pages: 272  },
  { title: 'Начни с главного',                 author: 'Гэри Келлер',                    genre: 'Саморазвитие',       year: 2013, pages: 240  },
  { title: 'Мышление и богатство',             author: 'Наполеон Хилл',                  genre: 'Саморазвитие',       year: 1953, pages: 288  }
];

const DESCRIPTIONS = [
  'Одно из величайших произведений мировой литературы.',
  'Глубокое исследование человеческой природы.',
  'Книга, которая перевернула моё представление о мире.',
  'Классика жанра — читается на одном дыхании.',
  'Обязательное чтение для всех, кто интересуется этой темой.',
  'Невероятно захватывающее произведение.',
  'Автор мастерски создаёт живых персонажей.',
  'Держит в напряжении до последней страницы.',
  'Богатый язык, незабываемые образы.',
  '',
];

const STATUSES = ['read', 'read', 'read', 'reading', 'wishlist', 'wishlist'];

if (RESET) {
  console.log('[seed] Сбрасываем базу данных...');

  db.exec('DELETE FROM books');
  db.exec('DELETE FROM genres');
  db.exec('DELETE FROM users');

  try { db.exec("DELETE FROM sqlite_sequence WHERE name IN ('books','genres','users')"); } catch {}
}

init();

const insertGenre = db.prepare('INSERT OR IGNORE INTO genres (name, description, color) VALUES (?, ?, ?)');

for (const g of GENRES) insertGenre.run(g.name, g.description, g.color);

console.log('[seed] Жанры добавлены');

const hash = bcrypt.hashSync('demo123', 10);

db.prepare('INSERT OR IGNORE INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)').run(
  'Demo User', 'demo@books.com', hash, '2024-01-01'
);

const userId = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@books.com').id;

const insertBook = db.prepare(`
  INSERT INTO books (user_id, title, author, genre, year, pages, status, rating, description, added_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;

for (const book of BOOKS) {
  const exists = db.prepare('SELECT id FROM books WHERE user_id = ? AND title = ?').get(userId, book.title);

  if (exists) continue;

  const status  = pick(STATUSES);
  const rating  = status === 'read' ? rnd(3, 5) : 0;
  const daysAgo = rnd(1, 730);
  const addedAt = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

  insertBook.run(userId, book.title, book.author, book.genre, book.year, book.pages, status, rating, pick(DESCRIPTIONS), addedAt);
  
  inserted++;
}

console.log(`[seed] Добавлено ${inserted} книг для пользователя id=${userId}`);
console.log('[seed] Готово! Логин: demo@books.com / demo123');
