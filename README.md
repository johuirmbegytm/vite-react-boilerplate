# Лабораторно-практична робота №7
## Дослідження бойлерплейту фронтенд-додатку
### Мета: 
Отримати практичні навички розгортання та запуску сучасного фронтенд-проекту. Детально вивчити його структуру, залежності та ключові файли, щоб зрозуміти, як інструменти (Vite, React, TypeScript) працюють разом.
### Завдання  
Вам необхідно самостійно розгорнути, запустити та дослідити проект-бойлерплейт, що знаходиться за посиланням: https://github.com/RicardoValdovinos/vite-react-boilerplate.
### Хід роботи:

1.	Клонування та запуск
* Розгортаємо проєкт:  
  Клонуємо репозиторій на свій комп'ютер та встановіть усі залежності за допомогою команди ```pnpm install``` і налаштуйте його командою ```pnpm run setup```.

  ![1](https://github.com/johuirmbegytm/vite-react-boilerplate/blob/main/images/1.png)

  ![2](https://github.com/johuirmbegytm/vite-react-boilerplate/blob/main/images/2.png)

  ![3](https://github.com/johuirmbegytm/vite-react-boilerplate/blob/main/images/3.png)

* Запускаємо у режимі розробки:  
  Виконуємо команду з ```pnpm run dev```. У терміналі ви побачите локальну адресу (зазвичай ```http://localhost:5173/```).

  ![4](https://github.com/johuirmbegytm/vite-react-boilerplate/blob/main/images/4.png)

* Переконуємось, що все працює:  
  Відкриваємо цю адресу у браузері.  
  Ми повинні побачити стартову сторінку додатку без помилок у консолі.

  ![5](https://github.com/johuirmbegytm/vite-react-boilerplate/blob/main/images/5.png)

2. Детальне вивчення структури
    
Відкриваємо проєкт у нашому редакторі коду та проаналізуйте ключові файли та директорії, щоб зрозуміти їхню роль.

1. ```dependencies``` (основні бібліотеки, які йдуть в продакшн)
*	```react```, ```react-dom``` — React.
*	```react-router-dom``` — маршрутизації (сторінки).
*	```wouter``` — легкий альтернативний роутер (в цьому бойлерплейті використовують саме його, а не react-router-dom v6).
*	```axios``` — для HTTP-запитів.
*	```zustand``` — легкий state-менеджер (альтернатива Redux).
2. ```devDependencies``` (тільки для розробки)
*	```vite``` — збірник і dev-сервер (те, що ми тільки що запустили).
*	```typescript``` — типізація.
*	```@vitejs/plugin-react``` — плагін, щоби Vite розумів JSX и Fast Refresh.
*	```tailwindcss```, ```postcss```, ```autoprefixer``` — стилі через Tailwind.
*	```eslint``` + плагіни — лінтер.
*	```vitest```, ```@testing-library/*``` — тести.
*	```prettier``` — форматування кода.
3. ```scripts``` (саме важливе — які команди є)

```json
"dev": "vite",
"build": "tsc && vite build",
"preview": "vite preview",
"lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
"test": "vitest",
"setup": "husky install && node scripts/setup.js"
```
*  ```pnpm dev``` → запускає Vite в режимі розробки (HMR). 
*  ```pnpm build``` → збирає продакшн-версію в папку dist. 
*  ```pnpm test``` → запускає тести на Vitest. 
*  ```pnpm setup``` → ми вже виконали, завантажує husky (гіт-хуки) і робить початкове налаштування.

```vite.config.ts```: Ознайомлююсь із файлом, що є "серцем" проєкту. Звертаю увагу, як тут налаштовуються плагіни та шляхи (аліаси):
*  ```react()``` — використовує SWC, а не Babel → у 10–20 разів швидше. 
*  ```TanStackRouterVite()``` — найкрутіше тут. Під час pnpm dev автоматично генерує файл з типами роутів (ми їх побачимо як ```@tanstack/router```). 
*  ```tailwindcss()``` — більше не треба окремих PostCSS та autoprefixer. 
*  ```host: true``` — саме через це ми змогли відкрити по localhost.

```src/main.tsx```: Знаходимо вхідну точку, де React "монтується" в HTML-сторінку. 

```ts
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts"; // ← Автоматично згенерований файл!
```

```routeTree.gen.ts``` створюється плагіном TanStackRouterVite() під час запуску dev. Там лежать усі маршрути проекту з типами.

```ts
const router = createRouter({ routeTree });
```
Створюємо роутер на основі всіх маршрутів.
```ts
export type TanstackRouter = typeof router;
declare module "@tanstack/react-router" { interface Register { router: TanstackRouter; } }
```
Завдяки цьому у всьому проекті буде повна типізація навігації (goTo, navigate тощо). Це одна з головних фішок TanStack Router.
```ts
import App from "./App.tsx"; 
import "./styles/tailwind.css";
 import "./common/i18n";
```

 Підключаємо:
*	глобальні стилі Tailwind
*	ініціалізацію i18next (переклади)
```ts
const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <React.Suspense fallback="loading">
        <App router={router} />
      </React.Suspense>
    </React.StrictMode>
  );
}
```
Класичне монтування React 18:
*	```createRoot``` — новий API
*	```StrictMode``` — допомагає знаходити баги
*	```Suspense``` — для майбутнього lazy-loading сторінок
*	App отримує роутер як пропс

```src/routes/index.ts```: Проаналізовуємо, як налаштована маршрутизація і як шлях (```path```) пов'язується з компонентом (```element```).

Як це працює (файлова маршрутизація):
1.	Назва файлу = шлях у браузері
-	```src/routes/index.ts``` → шлях ```/```
-	```src/routes/about.ts``` → шлях ```/about```
-	```src/routes/users/$id.ts``` → шлях ```/users/123``` (динамічний)
2.	createFileRoute("/")
-	Ти явно вказуєш шлях для цього файлу (можна перевизначити назву файлу).
-	Усередині передаєш об’єкт з конфігурацією маршруту.
3.	component: Home
-	Це аналог ```element: <Home />``` у react-router.
-	TanStack Router сам обгорне це в ```<Outlet />``` і т.д.
4.	export const Route
-	Цей експорт збирається плагіном ```TanStackRouterVite()``` під час dev.
-	Усі Route з усіх файлів у папці src/routes/ автоматично потрапляють у ```routeTree.gen.ts```.

```src/pages/Home.tsx```: Вивчаємо головний компонент-сторінку. Звертаємо увагу, як він імпортує та використовує інші компоненти.
```ts
import { useTranslation } from "react-i18next";
```
Підключаємо хук для перекладів. У цьому бойлерплейті вже вбудовано i18next + react-i18next — найпотужніша система локалізації.

```ts
import type { FunctionComponent } from "../common/types";
```
Кастомний тип замість React.FC. У сучасних проєктах часто відмовляються від React.FC, бо він автоматично додає children, навіть коли їх немає. Тут свій чистий тип — це гарна практика.

```ts
export const Home = (): FunctionComponent => {
```
Експортуємо компонент як іменовану функцію (не default). Це потрібно для правильної роботи TanStack Router (він імпортує саме Home).

```ts
const { t, i18n } = useTranslation();
```
*  t — функція перекладу: t("home.greeting") 
*  i18n — об’єкт для зміни мови

```ts
const onTranslateButtonClick = async (): Promise<void> => {
  if (i18n.resolvedLanguage === "en") {
    await i18n.changeLanguage("es");
  } else {
    await i18n.changeLanguage("en");
  }
};
```
Кнопка перемикає мову між англійською та іспанською. await — бо зміна мови асинхронна (може підвантажувати json з перекладами).

```ts
return (
  <div className="bg-blue-300 font-bold w-screen h-screen flex flex-col justify-center items-center">
    <p className="text-white text-6xl">{t("home.greeting")}</p>
    <button
      className="hover:cursor-pointer"
      type="submit"
      onClick={onTranslateButtonClick}
    >
      translate
    </button>
  </div>
);
```
Що ти зараз бачиш у браузері:
*	Синій екран
*	Великий текст (наприклад, "Hello, World!" або "¡Hola, Mundo!")
*	Кнопка "translate"
Якщо натиснеш кнопку — текст зміниться на іншу мову. Це повноцінна локалізація працює з коробки!

Де лежать переклади?
```
textsrc/assets/locales/en/translation.json
src/assets/locales/es/translation.json
```

3. Практична модифікація
Щоб переконатись, що ми розуміємо робочий процес, внесімо невелику зміну в код.

Відкриваємо файл ```src/pages/Home.tsx```.

Змінимо текст у будь-якому заголовку або додамо новий HTML-елемент (наприклад, параграф ```<p>Ваш текст</p>```).

Збережімо файл. Переходимо у браузер і переконуємося, що наші зміни миттєво відобразились без перезавантаження сторінки. Це продемонструє роботу Hot Module Replacement (HMR) у Vite.

![6](https://github.com/johuirmbegytm/vite-react-boilerplate/blob/main/images/6.png)
