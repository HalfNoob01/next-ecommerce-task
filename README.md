# 🧩 SaaSakiTech Next.js Assignment

This project is a Next.js web application built as part of a frontend assignment for **SaaSakiTech.com**. It implements user authentication using **Clerk.js**, persistent data handling with **localStorage**, and UI components styled using **DaisyUI** and **Tailwind CSS**.

---

## 🔧 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Authentication**: [Clerk.js](https://clerk.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **State Persistence**: `localStorage`
- **Language**: JavaScript / TypeScript (depending on your setup)

---

## ✨ Features

- 🔐 **Clerk.js Authentication**  
  Seamless sign-in and sign-up flow using Clerk.

- 🧠 **Persistent Data with localStorage**  
  User data/state is stored locally so that it remains intact across page reloads.

- 🎨 **DaisyUI + Tailwind Styling**  
  Responsive and clean UI using utility-first styling.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HalfNoob01/next-ecommerce-task.git
cd next-ecommerce-task


npm install
# or
yarn install


NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key


npm run dev
# or
yarn dev


Open http://localhost:3000 in your browser.