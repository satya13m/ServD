# 🍳 Servd – AI Powered Recipe & Pantry Management Platform

Servd is an AI-powered recipe discovery platform that helps users generate recipes from available ingredients.
Users can scan pantry ingredients using AI, select cuisines or categories, and receive recipe suggestions powered by AI and external APIs.

The platform integrates modern full-stack technologies including **Next.js, Strapi CMS, PostgreSQL, Clerk Authentication, and AI-powered ingredient detection**.

---

## 🚀 Features

### 🤖 AI Pantry Scanner

* Users can upload an image of ingredients.
* AI detects ingredients from the image with high accuracy.
* Detected ingredients are automatically added to the user's pantry.

### 🥗 Smart Recipe Recommendation

* Recipes are suggested based on available pantry ingredients.
* Uses **AI logic + MealDB API** to recommend recipes.
* Provides **alternative recipes** when ingredients are missing.

### 🍜 Cuisine & Category Filtering

Users can explore recipes by:

* Cuisine (Italian, Indian, Chinese, etc.)
* Category (Vegetarian, Dessert, Snacks, etc.)

### 👤 Authentication & User Management

* Secure authentication using **Clerk**
* Supports sign-in / sign-up / user session management.

### 💳 Subscription / Pricing

* Premium features available through payment integration.
* Pricing modal and locked premium features implemented.

### 📄 Recipe Export

* Users can generate recipe instructions as **PDF files**.

### 🗄 Pantry Management

* Add ingredients manually
* AI auto-detection from images
* Pantry-based recipe suggestions

---

## 🏗 Tech Stack

### Frontend

* **Next.js 14 (App Router)**
* React
* Tailwind CSS
* Axios
* Custom Hooks

### Backend

* **Strapi (Headless CMS)**
* Node.js
* PostgreSQL

### Authentication

* **Clerk**

### AI & APIs

* AI-based ingredient detection
* **TheMealDB API**

### Deployment

* **Frontend:** Vercel
* **Backend:** Strapi Server

---

## 📂 Project Structure

```
servd-app
│
├── frontend
│   ├── app
│   │   ├── dashboard
│   │   ├── pantry
│   │   ├── recipes
│   │   └── auth
│   │
│   ├── components
│   │   ├── RecipeCard
│   │   ├── RecipeGrid
│   │   ├── ImageUploader
│   │   ├── PricingModal
│   │   └── Header
│   │
│   ├── hooks
│   │   └── use-fetch.js
│   │
│   └── lib
│       ├── api.js
│       ├── utils.js
│       └── data.js
│
└── backend
    ├── Strapi CMS
    ├── PostgreSQL Database
    └── API configuration
```

---

## ⚙️ Installation & Setup

### Clone the repository

```
git clone https://github.com/yourusername/servd-app.git
cd servd-app
```

### Install frontend dependencies

```
cd frontend
npm install
```

### Run frontend

```
npm run dev
```

---

### Setup Backend (Strapi)

```
cd backend
npm install
npm run develop
```

Make sure PostgreSQL is configured in `.env`.

---

## 🔑 Environment Variables

Create `.env` file in frontend:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_API_URL=http://localhost:1337
```

Backend `.env` example:

```
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=servd
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
```

---

## 📸 Key Functional Components

* `ImageUploader.jsx` → Upload pantry images
* `RecipeGrid.jsx` → Display AI recommended recipes
* `PricingModal.jsx` → Subscription UI
* `AddToPantryModal.jsx` → Manage ingredients
* `PDFMaker.jsx` → Export recipes

---

## 🌍 Deployment

Frontend deployed using **Vercel**
Backend hosted using **Strapi server with PostgreSQL**

---

## 🧠 Future Improvements

* Voice-based ingredient input
* Personalized nutrition tracking
* AI meal planning
* Smart grocery list generation

---

## 👨‍💻 Author

Satyajit Mohanty
Full Stack Developer | AI-Driven Web Applications
