# Освітня платформа — API-шар

Навчальний React + TypeScript застосунок: каталог і деталі курсів, запит на запис, профіль поточного користувача через захищений endpoint.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

У `.env.local` задайте адресу API. Типово це `http://localhost:3000/api`. Сервер має надавати `GET /courses`, `GET /courses/:id`, `POST /enrollments` та захищений `GET /users/me`. Очікується JSON без обгортки `data`. Якщо формат backend інший, адаптуйте DTO та API-функції.

Щоб продемонструвати Access Token, викличте `setAccessToken(token)` із `src/api/authToken.ts` після входу. Endpoint авторизації в прикладі відсутній.

## Access Token і Refresh Token

Access Token — короткоживучий credential, який клієнт надсилає із запитом до захищеного API. Refresh Token живе довше й використовується для отримання нового Access Token після завершення його строку дії. Його зазвичай не додають до кожного API-запиту. Автоматичне оновлення потребує серверного endpoint і тут не реалізоване.

## Зберігання токенів

`localStorage` простий у використанні, але доступний JavaScript на сторінці. XSS може дати зловмисному скрипту змогу прочитати токен і використати його поза сайтом. Не зберігайте там довгоживучий Refresh Token. Захищайте застосунок від XSS і надавайте Access Token короткий строк дії. Зберігання Access Token у пам’яті обмежує його доступність після перезавантаження вкладки, але потребує відновлення сесії.

HttpOnly cookie недоступна для читання JavaScript, що ускладнює крадіжку токена через його пряме зчитування. Браузер може автоматично додавати cookie до запитів, тому потрібні належні `SameSite`, `Secure`, CORS і захист від CSRF. HttpOnly не усуває XSS: шкідливий скрипт усе ще може виконувати дії від імені користувача на сайті.

Щоб увімкнути cookie-режим, задайте `VITE_USE_COOKIE_AUTH=true`; сервер має підтримувати credentials та коректний CORS.

## Структура

- `src/api/axiosInstance.ts` — base URL, timeout, JSON-заголовки та request/response interceptors.
- `src/api/courseApi.ts` — курси, деталі курсу й запис.
- `src/api/userApi.ts` — захищений профіль.
- `src/types/` — DTO курсів, запиту на запис і користувача.
- `src/components/` — UI зі станами завантаження, помилки й успіху.
