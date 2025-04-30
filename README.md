# 💬 MY_CHAT_APP

Ứng dụng Chat thời gian thực sử dụng Java Spring Boot (Backend), Redis cho caching và xác thực JWT. Hệ thống hỗ trợ quản lý người dùng, trò chuyện cá nhân, và nhiều tính năng mở rộng khác.

---

## 🚀 Tính năng chính

-   ✅ Đăng ký / Đăng nhập bằng JWT
-   💬 Gửi / nhận tin nhắn theo thời gian thực
-   🔒 Xác thực bảo mật bằng access token + refresh token
-   📦 Redis cache để lưu session / token
-   🧠 Kết nối MySQL lưu trữ dữ liệu người dùng và tin nhắn
-   🐳 Hỗ trợ triển khai bằng Docker Compose

---

## 🛠️ Yêu cầu hệ thống

-   Docker + Docker Compose
-   Java 17+
-   Node.js 16+ (nếu có frontend)
-   Git

---

## ⚙️ Cài đặt & chạy ứng dụng

### 1. Clone project

```bash
git clone https://github.com/canhtv05/chat-app.git
cd chat-app
```

### 2. Cấu trúc dự án

```bash
my_chat_app/
├── docker-compose.yml
├── chat app.postman_collection.json
├── chatapp.sql
├── server/
│   └── chatapp/
└── client/
    └── chatapp/
```

---

Chạy lệnh sau trong thư mục chứa docker-compose.yml

```bash
docker-compose up --build
```

### 3. Frontend

```bash
cd client/chatapp
npm install
npm start
```

### 4. Database

Chạy script `chatapp.sql`

### 5. Preview

## ![preview](<./preview/Screenshot 2025-04-07 165059.png>)

## ![preview](<./preview/Screenshot 2025-04-07 165120.png>)

## ![preview](<./preview/Screenshot 2025-04-30 205413.png>)

### Bugs

```
scroll sai vị trí khi vào chat box
```

### 📄 License

MIT License © 2025 CanhTV
