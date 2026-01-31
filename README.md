# 📦 Content Registry

> **Organize. Manage. Share.**  
> The ultimate platform for creating, storing, and managing your digital assets effortlessly.

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🌐 Live Demo

🚀 **[View Live Application](https://content-registry-eight.vercel.app/)**  

---

## 💡 The Idea

**Content Registry** is a modern web application designed to help users aggregate their digital content in one place. Whether you are a content creator needing to store drafts and files, or a team managing shared resources, Content Registry allows you to:
- **Upload Files**: Store images, documents, and other media.
- **Create Posts**: Write and save text-based content.
- **Manage Profile**: View, edit, and delete your personal content feed.
- **Secure Access**: Ensure your content is private and secure with robust authentication.

---

## 🚀 Key Functionalities

### 🔐 Authentication
*   **Sign Up & Login**: Secure user registration and login using JWT integration.
*   **Protected Routes**: Middleware ensures sensitive pages (`/profile`, `/upload`) are accessible only to authenticated users.

### 📂 Content Management
*   **File Upload**: Drag-and-drop interface for uploading files (images, PDFs, documents).
*   **Text Posts**: Rich text creation for notes and articles.
*   **Edit & Delete**: Edit post details inline (via modal) and delete unwanted content.
*   **Smart Previews**: specialized previews for images, PDF documents, and generic file types.

### 👤 User Profile
*   **Dynamic Feed**: Personalized dashboard showing all user content.
*   **Filtering**: Filter content by type (All, Files, Text).
*   **Interactive UI**: Hover effects, improved modal overlays (View Image/Open File), and responsive grid layout.

---

## 🛠️ Technologies Used

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | React framework for production-grade web apps. |
| **Language** | **TypeScript** | Strongly typed JavaScript for scalable code. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| **Icons** | **Lucide React** | Beautiful & consistent icon set. |
| **HTTP Client** | **Axios** | Promise-based HTTP client for API requests. |
| **State** | **React Context** | `AuthContext` for global user authentication state. |

---

## 🔌 Backend Integration

This frontend communicates with a separate Backend API using a service-oriented architecture.

### Service Pattern
We organize API calls into dedicated service files in `@/src/lib/services/`:
*   `auth.service.ts`: Handles Login, Register, and `getMe` requests.
*   `content.service.ts`: Manages CRUD operations for Posts (Create, Read, Update, Delete).
*   `user.service.ts`: User-specific data operations.

### API Client
A configured Axios instance (`@/src/lib/api.ts`) handles:
*   **Base URL**: Configured via environment variables.
*   **Interceptors**: Automatically attaches the JWT `Bearer Token` from `localStorage` to every request header.
*   **Error Handling**: Centralized error logging and response management.

---

## 📦 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/content-registry-frontend.git
cd content-registry-frontend
```

### 2. Install Dependencies
```bash
npm install


### 3. Environment Setup
Create a `.env.local` file in the root directory and add your backend API URL:
```env
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000
```
*(Replace `http://localhost:5000` with your actual backend URL)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🚢 Deployment

### Frontend (Vercel)
### Backend (Render)

---

<p align="center">
  Made with ❤️ by Jomana Mohammed
</p>
