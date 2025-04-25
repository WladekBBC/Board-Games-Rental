export type Language = 'pl' | 'ua' 

export const translations = {
  pl: {
    // Nagłówki
    appTitle: 'Wypożyczalnia Gier Planszowych',
    manageGame: 'Zarządzaj Grami',
    addNewGame: 'Dodaj Nową Grę',
    gameList: 'Lista Gier',
    areYouSure: 'Czy na pewno chcesz usunąć tę grę ',
    
    
    // Logowanie
    LoginToService: 'Logowanie do serwisu',
    login: 'Zaloguj',
    password: 'Hasło',
    or: 'Lub',
    loginError: 'Nieprawidłowy email lub hasło',
    loginWithGoogle: 'Zaloguj przez Google',
    loginGoogleError: 'Nie udało się zalogować przez google',
    loginLoading: 'Logowanie...',
    
    // Formularze
    gameTitle: 'Tytuł Gry',
    gameDesc: 'Opis',
    gameImageUrl: 'Link do Obrazka',
    gameCategory: 'Kategoria',
    gameNumber: 'Ilość Sztuk',
    validating: 'Sprawdzanie...',
    
    // Przyciski
    addGame: 'Dodaj Grę',
    editGame: 'Edytuj',
    deleteGame: 'Usuń',
    cancel: 'Anuluj',
    save: 'Zapisz',
    gameAdding: 'Dodawanie...',
    
    // Status
    notDefined: 'Nie określono',
    gameAvailable: 'Dostępna',
    gameUnavailable: 'Niedostępna',
    available: 'Dostępne',
    qt: 'szt.',
    
    // Komunikaty
    confirmDelete: 'Czy na pewno chcesz usunąć tę grę?',
    addGameError: 'Błąd podczas dodawania gry',
    editGameError: 'Błąd podczas edycji gry',
    deleteGameError: 'Błąd podczas usuwania gry',
    rentGameError: 'Błąd podczas wypożyczania gry',
    rerentGameError: 'Błąd podczas przedłużania wypożyczenia',
    deleteGameRentError: 'Błąd podczas usuwania wypożyczenia',
    returnGameError: 'Błąd podczas zwrotu gry',
    gameNotFound: 'Nie znaleziono gry',
    gameUnavailableMessage: 'Gra niedostępna - wszystkie egzemplarze wypożyczone',
    gameRented: 'Gra została wypożyczona',
    gameRerented: 'Wypożyczenie zostało przedłużone',
    gameDeletedRent: 'Wypożyczenie zostało usunięte',
    gameReturned: 'Gra została zwrócona',
    warning: 'Uwaga',
    permissionDenied: 'Brak uprawnień do tej strony',
    
    // Walidacja
    enterTitle: 'Proszę wprowadzić tytuł gry',
    enterDesc: 'Proszę wprowadzić opis gry',
    enterImageUrl: 'Proszę dodać link do obrazka',
    invalidImageUrl: 'Nieprawidłowy link do obrazka lub rozmiar przekracza 5MB',
    invalidQuantity: 'Ilość nie może być ujemna',
    
    // Menu
    home: 'Strona Główna',
    games: 'Gry',
    rentals: 'Wypożyczenia',
    profile: 'Profil',
    logout: 'Wyloguj',
    
    // Statystyki
    totalGames: 'Wszystkich Gier',
    availableCopies: 'Dostępnych Kopii',
    activeRentals: 'Aktywne Wypożyczenia',
    yourActiveRentals: 'Twoje Aktywne Wypożyczenia',

    // Wypożyczenia
    manageRent: 'Zarządzanie Wypożyczeniami',
    addRent: 'Dodaj Wypożyczenie',
    indexNumber: 'Numer Indeksu',
    gameId: 'ID Gry',
    selectGame: 'Wybierz Grę',
    renting: 'Wypożycz',
    piece: 'szt.',
    rentDate: 'Data Wypożyczenia',
    returnDate: 'Data Zwrotu',
    actions: 'Akcje',
    return: 'Zwróć',
    gameDescription: 'Opis Gry',
    saveChanges: 'Zapisz Zmiany'
  },
  ua: {
    // Заголовки
    appTitle: 'Оренда Настільних Ігор',
    manageGame: 'Управління Іграми',
    addNewGame: 'Додати Нову Гру',
    gameList: 'Список Ігор',
    areYouSure: 'Ви впевнені, що хочете видалити цю гру ',
    
    // Вхід
    LoginToService: 'Вхід до сервісу',
    login: 'Увійти',
    password: 'Пароль',
    or: 'Або',
    loginError: 'Неправильний email або пароль',
    loginWithGoogle: 'Увійти через Google',
    loginGoogleError: 'Не вдалося увійти через google',
    loginLoading: 'Вхід...',
    
    // Форми
    gameTitle: 'Назва Гри',
    gameDesc: 'Опис',
    gameImageUrl: 'Посилання на Зображення',
    gameCategory: 'Категорія',
    gameNumber: 'Кількість',
    validating: 'Перевірка...',
    
    // Кнопки
    addGame: 'Додати Гру',
    editGame: 'Редагувати',
    deleteGame: 'Видалити',
    cancel: 'Скасувати',
    save: 'Зберегти',
    gameAdding: 'Додавання...',
    
    // Статус
    notDefined: 'Не визначено',
    gameAvailable: 'Доступна',
    gameUnavailable: 'Недоступна',
    available: 'Доступно',
    qt: 'шт.',
    
    // Повідомлення
    confirmDelete: 'Ви впевнені, що хочете видалити цю гру?',
    addGameError: 'Помилка при додаванні гри',
    editGameError: 'Помилка при редагуванні гри',
    deleteGameError: 'Помилка при видаленні гри',
    rentGameError: 'Помилка при оренді гри',
    rerentGameError: 'Помилка при продовженні оренди',
    deleteGameRentError: 'Помилка при видаленні оренди',
    returnGameError: 'Помилка при поверненні гри',
    gameNotFound: 'Гру не знайдено',
    gameUnavailableMessage: 'Гра недоступна - всі примірники орендовані',
    gameRented: 'Гру орендовано',
    gameRerented: 'Оренду продовжено',
    gameDeletedRent: 'Оренду видалено',
    gameReturned: 'Гру повернуто',
    warning: 'Увага',
    permissionDenied: 'Немає прав доступу до цієї сторінки',
    
    // Валідація
    enterTitle: 'Будь ласка, введіть назву гри',
    enterDesc: 'Будь ласка, введіть опис гри',
    enterImageUrl: 'Будь ласка, додайте посилання на зображення',
    invalidImageUrl: 'Неправильне посилання на зображення або розмір перевищує 5MB',
    invalidQuantity: 'Кількість не може бути від\'ємною',
    
    // Меню
    home: 'Головна',
    games: 'Ігри',
    rentals: 'Оренда',
    profile: 'Профіль',
    logout: 'Вийти',
    
    // Статистика
    totalGames: 'Всього Ігор',
    availableCopies: 'Доступних Копій',
    activeRentals: 'Активні Оренди',
    yourActiveRentals: 'Ваші Активні Оренди',

    // Оренда
    manageRent: 'Управління Орендою',
    addRent: 'Додати Оренду',
    indexNumber: 'Номер Індексу',
    gameId: 'ID Гри',
    selectGame: 'Виберіть Гру',
    renting: 'Орендувати',
    piece: 'шт.',
    rentDate: 'Дата Оренди',
    returnDate: 'Дата Повернення',
    actions: 'Дії',
    return: 'Повернути',
    gameDescription: 'Опис Гри',
    saveChanges: 'Зберегти Зміни'
  }
} as const; 