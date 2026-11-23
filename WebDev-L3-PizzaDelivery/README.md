# 🍕 PizzaHub — Full Stack Pizza Delivery App

> **OASIS INFOBYTE | Web Development & Designing | Level 3 | Task 1**

A complete pizza ordering and inventory management web application built with React, Node.js, Express, MongoDB, Razorpay, and Socket.IO.

---

## 🚀 Live Features

### Customer Side
| Feature | Status |
|---|---|
| Email + Password Registration | ✅ |
| Email Verification (link via Nodemailer) | ✅ |
| JWT Login / Logout | ✅ |
| Forgot & Reset Password (email link) | ✅ |
| Pizza Menu with ingredients display | ✅ |
| 4-Step Custom Pizza Builder (Base → Sauce → Cheese → Vegetables) | ✅ |
| Dynamic price calculation | ✅ |
| Out-of-stock ingredient guard | ✅ |
| Order Summary before payment | ✅ |
| Razorpay Test Mode checkout | ✅ |
| Mock payment fallback (for no-key testing) | ✅ |
| My Orders / Order Tracking | ✅ |
| Real-time status polling (10s interval) | ✅ |
| Order status: `Order Received → In Kitchen → Sent to Delivery` | ✅ |

### Admin Side
| Feature | Status |
|---|---|
| Separate admin login (admin@pizzahub.com / admin123) | ✅ |
| Overview dashboard with stats | ✅ |
| Inventory dashboard (all 4 categories) | ✅ |
| Inline stock update with validation | ✅ |
| Auto stock deduction on confirmed payment | ✅ |
| Duplicate deduction prevention (stockDeducted flag) | ✅ |
| All orders management with status update | ✅ |
| Real-time customer status update via Socket.IO | ✅ |
| Scheduled low-stock email (node-cron, hourly) | ✅ |

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + React Router v7
- **Backend:** Node.js + Express 5
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcryptjs
- **Email:** Nodemailer (Gmail SMTP)
- **Payment:** Razorpay Test Mode
- **Real-time:** Socket.IO + polling fallback
- **Scheduler:** node-cron

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

**backend/.env**
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
cd frontend
npm run dev
```

App runs at **http://localhost:5173**

---

## 🔑 Default Admin

| Email | Password |
|---|---|
| admin@pizzahub.com | admin123 |

---

## 📁 Project Structure

```
WebDev-L3-PizzaDelivery/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/      (auth, order, ingredient)
│   │   ├── jobs/stockCheck.js
│   │   ├── middleware/auth.js
│   │   ├── models/           (User, Order, Ingredient, Pizza)
│   │   ├── routes/           (auth, admin, order, ingredient, pizza)
│   │   └── utils/            (sendEmail, seedData)
│   └── server.js
└── frontend/
    └── src/
        ├── components/Navbar.jsx
        ├── context/           (AuthContext, CartContext)
        ├── pages/
        │   ├── Home.jsx
        │   ├── Menu.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── VerifyEmail.jsx
        │   ├── ForgotPassword.jsx
        │   ├── ResetPassword.jsx
        │   ├── PizzaBuilder.jsx   ← 4-step builder
        │   ├── OrderSummary.jsx
        │   ├── OrderHistory.jsx
        │   └── admin/Dashboard.jsx
        └── utils/api.js
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| GET | `/api/auth/verify-email?token=` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password` | Public |
| GET | `/api/auth/me` | Protected |

### Customer
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/ingredients` | Public |
| POST | `/api/orders` | Customer |
| POST | `/api/orders/verify-payment` | Customer |
| POST | `/api/orders/mock-payment` | Customer |
| GET | `/api/orders/my` | Customer |

### Admin
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/inventory` | Admin |
| PATCH | `/api/admin/inventory/:id` | Admin |
| GET | `/api/admin/orders` | Admin |
| PATCH | `/api/admin/orders/:id/status` | Admin |

---

## 💳 Razorpay Test Mode

Use these test card details:
- **Card:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **OTP:** 1234

If no Razorpay keys are set, the app automatically uses **mock payment** mode.

---

*Prepared for OASIS INFOBYTE — Web Development & Designing, Level 3, Task 1*
