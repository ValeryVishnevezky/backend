<h1 align="center">Store Project </h1>

###

This is a full-stack application with Next.js / React / TypeScript frontend and Hono / Bun backend.
It provides an interactive dashboard with charts, analytics data, and user management.

![Store Home Page](./readme-imgs/ListLight.png)

### 📁 Repositories

+ Frontend:[https://github.com/ValeryVishnevezky/frontend](https://github.com/ValeryVishnevezky/frontend)

+ Backend: [https://github.com/ValeryVishnevezky/backend](https://github.com/ValeryVishnevezky/backend)

### ✅ Features

+ User authentication
+ Interactive analytics dashboard
+ Charts with filtering options
+ Responsive layout and dark/light mode
+ Clean code with modular structure

###

## 🚀 Setup & Run Instructions

Install dependencies:
```bash
npm install
```

Create .env file in frontend with environment variables:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/
```

Create .env file in backend with environment variables:
```bash
MONGODB_URI='mongodb+srv://valery:VJ2AZIom84c1vPXn@shopstreamcluster.alz0y4l.mongodb.net/?appName=ShopStreamCluster'
DB_NAME='shop_db'
JWT_SECRET='secret'
```

Run the development server:
```bash
npm run dev
```

#### Open [http://localhost:3030](http://localhost:3030) with your browser to see the result.


### 👥 User Management
To enter the order and dashboard pages, use button "Login with Demo User" that get demo user credentials

![Login with demo user](./readme-imgs/Login.png)


### 📈 Charts & Analytics

![Charts & Analytics](./readme-imgs/Dashboard.png)

To test charts and analytics, you can use select options to filter data by:
+ Last 7 days
+ Last 90 days
+ Last 365 days 

![Select options](./readme-imgs/Select.png)

### 📦 Orders List

Full responsive orders list with status badges and ability to display options:
+ Rows design
+ Cards design

![Orders List Rows](./readme-imgs/Rows.png)
![Orders List Cards](./readme-imgs/Cards.png)

### ☀️ Theme Support

App provides dark and light theme support with toggle button

![Theme Toggle](./readme-imgs/Theme.png)

### Products List

Full responsive products list with stock status

Light Theme:
![Theme Toggle](./readme-imgs/ListLight.png)

Dark Theme:
![Theme Toggle](./readme-imgs/ListDark.png)

## 🏗️ Architecture & Design
### Frontend:

+ Framework: Next.js 16.1 + React
+ UI & Components: UI components, custom hooks for theme and user, charts, and data fetching
+ Charts: Chart.js
+ State Management: React useState / useEffect
+ Features:
+ + Interactive charts
+ + Date range selection
+ + Dark/light theme toggle

### Backend
+ Framework: Hono (Node.js)
+ Database: MongoDB
+ Authentication: JWT, cookies
+ Routes:

+ + /auth — login/signup/logout
+ + /stats — analytics data
+ + /users — user CRUD
+ + /products — product CRUD
+ + /orders — order CRUD

+ Error Handling: centralized middleware auth checks

### Data Flow

1. Frontend requests data from backend via authenticated API calls.
2. Backend validates JWT token from cookies and returns data.
3. Frontend dynamically renders UI components based on the received data.

## 🛠️ Technologies Used
+ Frontend: Next.js, React, TypeScript, Chart.js, Tailwind CSS
+ Backend: Hono, Bun, MongoDB, JWT
