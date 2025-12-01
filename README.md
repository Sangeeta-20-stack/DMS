# Delivery Management System

A real-time delivery tracking and management system supporting **Buyer**, **Seller**, and **Admin** roles.  
Each order moves through **7 delivery stages**, with strict forward-only progression and real-time updates using Socket.io.

---

## 🚀 Project Overview

This system manages the lifecycle of an order from creation to delivery.  
Each order moves through the following fixed stages:

1. Order Placed  
2. Buyer Associated  
3. Processing  
4. Packed  
5. Shipped  
6. Out for Delivery  
7. Delivered  

Every stage stores a timestamp, and all dashboards update **in real time** whenever:

- A new order is created  
- Buyer is associated  
- Order stage moves forward  
- Order is deleted  

Soft delete / hard delete (configurable)

---

## 🧑‍💻 Tech Stack

### **Frontend**
- React  
- Vite  
- Tailwind CSS  
- Socket.io Client  
- JWT Auth  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Socket.io  
- JWT Authentication  

---




## ⚙️ Setup Instructions

### **1. Clone Repository**

https://github.com/Sangeeta-20-stack/DMS


---

## 🔧 Backend Setup

cd backend
npm install


Create a `.env` file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000


Run backend:
 npm run dev

 
Backend runs on: http://localhost:5000




---

## 🎨 Frontend Setup

cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173


---

## 🔌 Real-Time Communication (Socket.io)

Events sent to frontend:

| Event | Trigger |
|-------|---------|
| `order_created` | Buyer creates new order |
| `order_updated` | Seller moves stage |
| `order_deleted` | Seller deletes |
| `buyer_associated` | Admin associates buyer |

All dashboards update instantly **without refresh**.

---

## 🧑‍🤝‍🧑 Roles & Functionalities

---

### 🛒 Buyer
- Register / Login  
- Can have **only one active order**  
- Create order with multiple items  
- Real-time progress bar  
- Dashboard updates automatically  

---

### 🏪 Seller
- Register / Login  
- Sees **only assigned orders**  
- Table includes:
  - Order ID  
  - Buyer Info  
  - Items  
  - Stage  
  - Created At / Updated At  
- Actions:
  - **Move to Next Stage** (one step only)  
  - **Delete Order**  
- Real-time updates when:
  - New order assigned  
  - Stage updated  
  - Order deleted  

---

### 🛠 Admin
- Full system access  
- Dashboard stats:
  - Total Orders  
  - Orders by Stage  
  - Average Delivery Time  
- Full Orders Table:
  - Buyer Details  
  - Seller Details  
  - Items  
  - Stages  
  - Timestamps  
- Actions:
  - **Associate Buyer** (modal picker)  
  - **View Details** (stage timings + logs)  
  - **Delete Order**  

---

## 🔗 API Routes (Major)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register (Buyer/Seller/Admin) |
| POST | `/api/auth/login` | Login |
| POST | `/api/orders` | Buyer creates new order |
| GET | `/api/orders/my` | Fetch buyer/seller orders |
| POST | `/api/orders/:id/associate` | Admin assigns buyer |
| POST | `/api/orders/:id/next` | Seller moves stage |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/orders/:id/details` | Full logs + timestamps |
| GET | `/api/sellers` | Fetch all sellers (admin only) |
| GET | `/api/buyers` | Fetch all buyers (admin only) |

---

## 🌐 Live Demo (Replace Link)

Frontend Live:  

dms-theta-ten.vercel.app

Backend Live API:  

https://dms-poa5.onrender.com


---

## 🎥 Demo Video (Replace Link)

https://drive.google.com/drive/folders/14jZO9NTdYSK4tMrHdj1iTWhN3R4vrBFP?usp=drive_link
