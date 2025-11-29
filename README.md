# **Splitwise Clone – Backend (Node.js + Express + MongoDB)**

This repository contains the **backend API** for a Splitwise-like expense-sharing application.
It allows users to create groups, add expenses, split amounts between members, and compute settlements.

The backend is built using:

* **Node.js**
* **Express**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **Modular Controllers & Routes**

This API is designed to be consumed by any frontend (Angular, React, mobile app, etc.).

---

## 🚀 **Features**

### ✅ **User Authentication**

* Register new users
* Login using email + password
* JWT-based authentication

### ✅ **Group Management**

* Create groups
* Add members
* Fetch group details
* Supports using **group IDs for security purposes, can be changed to group names in future**

### ✅ **Expense Management**

* Add expenses to a group
* Split by percentage or fixed amount
* Store payer and recipients by **MongoDB ObjectIds for security purposes, can be changed to names in future**
* Fetch all expenses for a specific group

### ✅ **Settlement Calculation**

* Computes:

  * How much each member owes or is owed
  * Automatically generates **optimal money-transfer suggestions**
* Uses a greedy settlement algorithm for minimal transactions

---

## 📂 **Project Structure**

```
backend/
│
├── controllers/
│   ├── groupController.js
│   └── expenseController.js
│
├── models/
│   ├── user.js
│   ├── group.js
│   └── expense.js
│
├── routes/
│   ├── auth.js
│   ├── groups.js
│   └── expenses.js
│
├── middleware/
│   └── authMiddleware.js
│
├── config/
│   └── db.js
│
├── app.js
├── index.js
└── socket.js
├── .env
├── server.js
└── package.json
```

---

## 🔧 **Installation & Setup**

### 1️⃣ Clone the repository

```cmd
git clone https://github.com/bhavesh090802/splitwise-clone.git
cd splitwise-clone
```

### 2️⃣ Install dependencies

```cmd
npm install
```

### 3️⃣ Create `.env` in root:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=4000
```

### 4️⃣ Run the server

```sh
npm start
```

Server runs at:
👉 **[http://localhost:4000](http://localhost:4000)**

---

## 📌 **API Endpoints**

### 🔐 Auth

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login & get JWT   |

### To Access Groups and expenses API's , Authorize yourself with the token generated while creating the user.
### Authorizing icon is present at the top right corner of the API page
### 👥 Groups

| Method | Endpoint                 | Description       |
| ------ | ------------------------ | ----------------- |
| POST   | `/api/groups`            | Create group      |
| GET    | `/api/groups/:groupId`   | Get group by ID   |
| GET    | `/api/groups`            | Get all groups    |

### 💵 Expenses

| Method | Endpoint                              | Description                |
| ------ | ------------------------------------- | -------------------------- |
| POST   | `/api/expenses`                       | Add new expense            |
| GET    | `/api/expenses/group/:groupId`        | Get expenses by group id   |
| GET    | `/api/expenses/settlement/:groupId`   | Compute settlement         |




---

# 📌 **Sample Data for Testing API (Swagger / Postman)**

Use the following sample JSON payloads to test your backend APIs quickly.
While testing double check the groupId generated in you response.

---

# ✅ **1. Register User**

### **POST** `/api/auth/register`

```json
{
  "name": "Rohit Sharma",
  "email": "rohit@example.com",
  "password": "123456"
}
```

```json
{
  "name": "Virat Kohli",
  "email": "virat@example.com",
  "password": "123456"
}
```

---

# ✅ **2. Login User**

### **POST** `/api/auth/login`

```json
{
  "email": "rohit@example.com",
  "password": "123456"
}
```

### **Response**

You will get:

```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

Use this token for all authenticated APIs:

```
Authorization: Bearer <token>
```

---

# ✅ **3. Create a Group**

### **POST** `/api/groups`

```json
{
  "name": "Goa Trip",
  "members": [
    "USER_ID_OF_Rohit",
    "USER_ID_OF_Virat"
  ]
}
```

### Sample Response

```json
{
  "_id": "6742a1c12f9a8f00c1c4e1ab",
  "name": "Goa Trip",
  "members": [
    "67429f892f9a8f00c1c4e1a9",
    "67429fa12f9a8f00c1c4e1aa"
  ]
}
```

Use the returned group `_id` for all expense APIs.

---

# 🔹 **Save the groupId for next API calls**

```
groupId = 6742a1c12f9a8f00c1c4e1ab
```

---

# ✅ **4. Add Expense**

### **POST** `/api/expenses`

```json
{
  "description": "Lunch at beach shack",
  "amount": 2000,
  "paidBy": "67429f892f9a8f00c1c4e1a9",
  "group": "6742a1c12f9a8f00c1c4e1ab",
  "split": [
    { "user": "67429f892f9a8f00c1c4e1a9", "share": 1000 },
    { "user": "67429fa12f9a8f00c1c4e1aa", "share": 1000 }
  ]
}
```

---

# ✅ **5. Get All Expenses for a Group**

### **GET** `/api/expenses/group/{groupId}`

Example:

```
/api/expenses/group/6742a1c12f9a8f00c1c4e1ab
```

---

# ✅ **6. Get Settlement Summary**

### **GET** `/api/expenses/settlement/{groupId}`

Example:

```
/api/expenses/settlement/6742a1c12f9a8f00c1c4e1ab
```

### Example Response

```json
{
  "balances": [
    { "userId": "67429f892f9a8f00c1c4e1a9", "name": "Rohit", "balance": 1000 },
    { "userId": "67429fa12f9a8f00c1c4e1aa", "name": "Virat", "balance": -1000 }
  ],
  "transfers": [
    {
      "from": "67429fa12f9a8f00c1c4e1aa",
      "to": "67429f892f9a8f00c1c4e1a9",
      "amount": 1000
    }
  ]
}
```

---

# 📌 **7. Sample Full Testing Flow (Plug & Play)**

1. Register **Rohit**
2. Register **Virat**
3. Login Rohit → copy JWT
4. Create group → save **groupId**
5. Add expense using `groupId` + userIds
6. Get expenses
7. Get settlement

All sample data above follows this workflow.

---



I’ll generate everything.
**
