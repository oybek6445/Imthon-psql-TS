# Blog Loyihasi API

Bu Node.js, Express, PostgreSQL va TypeScript yordamida yaratilgan to‘liq blog loyihasi.  
Foydalanuvchilarni ro‘yxatdan o‘tkazish va login qilish JWT autentifikatsiyasi bilan amalga oshiriladi, shuningdek bloglar, postlar va kommentariyalarni boshqarish uchun API lar mavjud.

---

## Texnologiyalar

- Node.js
- Express
- PostgreSQL
- TypeScript
- JWT autentifikatsiya uchun
- bcrypt parolni xavfsiz saqlash uchun

---

## O‘rnatish bo‘yicha ko‘rsatmalar

1. Loyihani klonlash.

2. Kerakli paketlarni o‘rnatish:

```bash
npm install
```

3. PostgreSQL ma’lumotlar bazasini sozlash va `db.sql` faylini ishga tushirib, kerakli jadvallarni yaratish.

4. Loyihaning ildiz papkasida `.env` faylini yaratib, quyidagilarni yozish:

```
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

5. Serverni ishga tushirish:

```bash
npm start
```

Server `.env` faylida ko‘rsatilgan portda ishga tushadi.

---

## Autentifikatsiya

- Yangi foydalanuvchini ro‘yxatdan o‘tkazish uchun `POST /register` endpointiga quyidagi JSON yuboriladi:  
  `{ "username": "foydalanuvchi_nomi", "password": "parol" }`.
- Login qilish uchun `POST /login` endpointiga yuqoridagi JSON yuboriladi. Muvaffaqiyatli login qilinganda, JWT token httpOnly cookie sifatida o‘rnatiladi.
- Boshqa barcha endpointlar token orqali autentifikatsiyani talab qiladi.

---

## API Endpointlar

### Foydalanuvchilar

- `POST /register` - yangi foydalanuvchi ro‘yxatdan o‘tadi.
- `POST /login` - login qiladi va token cookie sifatida olinadi.

### Bloglar

- `POST /create` - yangi blog yaratadi. Autentifikatsiya talab qilinadi.
- `GET /get-my-blogs` - foydalanuvchi o‘ziga tegishli bloglarni oladi.
- `GET /get-my-joined-blogs` - foydalanuvchi a’zo bo‘lgan bloglarni oladi.
- `GET /get-blog-info/:id` - blog haqida batafsil ma’lumot oladi.
- `PUT /update/:id` - blogni yangilaydi. Faqat egasi yangilay oladi.
- `DELETE /delete/:id` - blogni o‘chiradi. Faqat egasi o‘chirishi mumkin.
- `GET /search?query=searchTerm` - bloglarni nomi bo‘yicha qidiradi.
- `POST /join-blog` - blogga a’zo bo‘ladi. JSON: `{ "blogId": son }`.
- `POST /leave-blog` - blogdan chiqib ketadi. JSON: `{ "blogId": son }`.
- `GET /get-users/:blogId` - blog a’zolarini oladi.

### Postlar

- `POST /create` - blog egasi post yaratadi.
- `GET /get-all/:blogId` - blogdagi barcha postlarni oladi.
- `GET /get-by-id/:postId` - postni id bo‘yicha oladi va ko‘rishlar sonini oshiradi.
- `PUT /update/:postId` - postni yangilaydi. Faqat blog egasi yangilay oladi.
- `DELETE /delete/:postId` - postni o‘chiradi. Faqat blog egasi o‘chiradi.
- `GET /sort-by-date/:blogId` - postlarni yaratilgan sanasi bo‘yicha tartiblaydi.

### Kommentariyalar

- `POST /create` - postga izoh yozadi.
- `GET /:postId/get-comments` - postga yozilgan izohlarni oladi.
- `PUT /update/:commentId` - izohni yangilaydi. Faqat izoh egasi yangilay oladi.
- `DELETE /delete/:commentId` - izohni o‘chiradi. Faqat izoh egasi o‘chiradi.

---

## Eslatmalar

- `/register` va `/login` tashqari barcha endpointlar token orqali autentifikatsiyani talab qiladi.
- Foydalanuvchi ID token orqali olinadi va ruxsat berish uchun ishlatiladi.
- Parollar bcrypt yordamida xavfsiz saqlanadi.
- JWT token 1 kun davomida amal qiladi.

---

## Litsenziya

MIT Litsenziyasi
