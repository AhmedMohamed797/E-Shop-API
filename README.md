# 🛒 E-Shop API

A full-featured **RESTful E-Commerce API** built with **Node.js & Express**, supporting authentication, products, categories, carts, orders, reviews, coupons, and more.

---

## 📌 Overview

The **E-Shop API** provides backend functionality for an online store, including:

- User authentication & authorization
- Product catalog management
- Shopping cart & wishlist
- Orders & checkout
- Reviews & ratings
- Admin management

---

## 🚀 Features

- JWT Authentication
- Role-based access control (Admin / User)
- File uploads (images)
- Pagination, filtering, sorting, searching
- Stripe checkout session
- Secure password reset
- Clean RESTful structure

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT Authentication**
- **Stripe**
- **Multer** (file uploads)
- **Postman** (API documentation)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/e-shop-api.git
cd e-shop-api
npm install
```

## 🔧 Environment Variables
Create a **.env** file in the project root:

```env
PORT=5000
DATABASE_URI=mongodb://localhost:27017/eshop

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

## ▶️ Running the Server

```bash
npm start
```

## 🔐 Authentication
Authentication uses JWT Bearer Tokens.

Add the token to request headers:
```makefile
Authorization: Bearer <your_token>
```

## 📡 API Endpoints

### 📂 Categories
| Method | Endpoint                  | Description                    |
| ------ | ---------------           | -----------------------        |
| POST   | /categories               | Create category (Admin)        |
| GET    | /categories               | Get all categories             |
| GET    | /categories/:id           | Get category                   |
| PATCH  | /categories/:id           | Update category (Admin)        |
| DELETE | /categories/:id           | Delete category (Admin)        |

---

### 📂 Sub Categories
| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| POST   | /sub-categories     | Create sub-category (Admin) |
| GET    | /sub-categories     | Get all sub-categories |
| GET    | /sub-categories/:id | Get sub-category       |
| PATCH  | /sub-categories/:id | Update sub-category (Admin) |
| DELETE | /sub-categories/:id | Delete sub-category (Admin)     |

### Nested:

```ruby
/categories/:categoryId/sub-categories
```
---

### 📂 Brand
| Method | Endpoint    | Description    |
| ------ | ----------- | -------------- |
| POST   | /brands     | Create brand (Admin)   |
| GET    | /brands     | Get all brands |
| GET    | /brands/:id | Get brand      |
| PATCH  | /brands/:id | Update brand (Admin)  |
| DELETE | /brands/:id | Delete brand (Admin)  |

---

### 📦 Products
| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| POST   | /products     | Create product (Admin)   |
| GET    | /products     | Get all products |
| GET    | /products/:id | Get product      |
| PATCH  | /products/:id | Update product (Admin)   |
| DELETE | /products/:id | Delete product (Admin)   |

#### Query features:

- page, limit
- sort
- keyword
- fields
- price[lte], price[gte]

---

### 👤 Authentication
| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | /auth/signup            | Register user     |
| POST   | /auth/login             | Login             |
| POST   | /auth/forget-password   | Forget password   |
| POST   | /auth/verify-reset-code | Verify reset code |
| PATCH  | /auth/reset-password    | Reset password    |

---

### 👥 Users (Admin)
| Method | Endpoint   | Description   |
| ------ | ---------- | ------------- |
| POST   | /users     | Create user (Admin)  |
| GET    | /users     | Get all users (Admin) |
| GET    | /users/:id | Get user (Admin)     |
| PATCH  | /users/:id | Update user (Admin)  |
| DELETE | /users/:id | Delete user (Admin)  |

---

### 👤 Logged User
| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | /users/getMe              | Get profile          |
| PATCH  | /users/updateMe           | Update profile       |
| PATCH  | /users/change-password    | Change password      |
| PATCH  | /users/update-profile-img | Update profile image |
| DELETE | /users/deleteMe           | Delete account       |

---

### ⭐ Reviews
| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| POST   | /reviews     | Create review (User)  |
| GET    | /reviews     | Get all reviews |
| GET    | /reviews/:id | Get review      |
| PATCH  | /reviews/:id | Update review (User)   |
| DELETE | /reviews/:id | Delete review  |

#### Nested:
```ruby
/products/:productId/reviews
```

---

### ❤️ Wishlist
| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| POST   | /wishlist            | Add product |
| GET    | /wishlist            | Get wishlist   |
| DELETE | /wishlist/:productId | Remove product |
| DELETE | /wishlist            | Clear wishlist |

---

### 📍 Addresses
| Method | Endpoint       | Description    |
| ------ | -------------- | -------------- |
| POST   | /addresses     | Create address |
| GET    | /addresses     | Get addresses  |
| DELETE | /addresses/:id | Delete address |

---

### 🎟 Coupons
| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| POST   | /coupons     | Create coupon (Admin)  |
| GET    | /coupons     | Get all coupons (Admin) |
| GET    | /coupons/:id | Get coupon (Admin)    |
| PATCH  | /coupons/:id | Update coupon (Admin)   |
| DELETE | /coupons/:id | Delete coupon (Admin)  |

---

### 🛒 Cart
| Method | Endpoint           | Description     |
| ------ | ------------------ | --------------- |
| POST   | /cart              | Add product     |
| GET    | /cart              | Get cart        |
| PATCH  | /cart/:itemId      | Update quantity |
| DELETE | /cart/:itemId      | Remove product  |
| DELETE | /cart              | Clear cart      |
| POST   | /cart/apply-coupon | Apply coupon    |

---

### 📦 Orders
| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| POST   | /orders/:cartId     | Create cash order |
| GET    | /orders             | Get all orders    |
| GET    | /orders/:id         | Get order         |
| PATCH  | /orders/:id/pay     | Mark as paid (Admin-Manager)      |
| PATCH  | /orders/:id/deliver | Mark as delivered (Admin-Manager) |

#### 💳 Stripe Checkout
| Method | Endpoint                         | Description      |
| ------ | -------------------------------- | ---------------- |
| GET    | /orders/checkout-session/:cartId | Checkout session |


## 📄 License
MIT License

# 👨‍💻 Author
## Ahmed Mohamed
### E-Shop RESTful API











