# Organogram Challenge

---

A monolithic application designed to manage company organizational charts, featuring a robust GraphQL API and a responsive React frontend. This project demonstrates a strong understanding of full-stack development, clean architecture, and modern web technologies.

## 🚀 Features

-   **Company Management**: Full CRUD operations for companies.
-   **Employee Management**: Add, list, and delete employees with name, email, and picture attributes.
-   **Dynamic Organizational Chart**:
    -   Associate managers with employees (single manager per employee, no loops, same-company restriction).
    -   Efficiently list direct reports, second-level reports, and peers.
-   **Scalable Architecture**: Designed with maintainability and future scope changes in mind.
-   **Comprehensive Testing**: Unit and integration tests ensuring reliability and code quality.

## 📸 Screenshots

<img width="1347" height="519" alt="Screenshot from 2025-07-29 22-47-56" src="https://github.com/user-attachments/assets/065a83a3-4b6d-4de7-b90e-be6ad825802f" />
<img width="1387" height="820" alt="Screenshot from 2025-07-29 22-48-09" src="https://github.com/user-attachments/assets/58255a33-2b27-4815-a421-c06cb0931c07" />
<img width="1387" height="820" alt="Screenshot from 2025-07-29 22-48-17" src="https://github.com/user-attachments/assets/21271bde-4cdb-4519-aaab-f909bf22146e" />
<img width="1387" height="820" alt="Screenshot from 2025-07-29 22-48-44" src="https://github.com/user-attachments/assets/1831b2a9-c5e3-4d4f-9ef7-9c005e9e63c2" />

## 🛠️ Tech Stack

### Frontend
-   **Framework**: Next.js (App Router)
-   **UI Library**: React, Ant Design
-   **State Management**: Apollo Client
-   **Styling**: Tailwind CSS

### Backend
-   **API**: Next.js API Routes, Apollo Server (GraphQL)
-   **ORM**: Prisma
-   **Database**: SQLite (for development)

### Development & Testing
-   **Language**: TypeScript
-   **Testing**: Jest, React Testing Library
-   **Linting**: ESLint

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:JRRGomes/organograma-challenge.git
    cd organogram-challenge
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Database:**
    Ensure your `.env` file contains your SQLite database connection:
    ```dotenv
    DATABASE_URL="file:./dev.db"
    ```

4.  **Run Prisma Migrations & Generate Client:**
    ```bash
    npm run db:migrate
    npm run db:generate
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```

6.  Open your browser and navigate to `http://localhost:3000`.

## 🏗️ Project Structure

  ```bash
  ├── app/                  # Next.js App Router (frontend pages & API routes)
  │   ├── api/              # GraphQL API endpoint
  │   ├── companies/        # Company-related features (pages, hooks)
  │   ├── components/       # Reusable UI components & their hooks
  │   └── employees/        # Employee-related features (pages, hooks)
  ├── lib/                  # Core utilities (GraphQL setup, Apollo client, Prisma)
  ├── prisma/               # Database schema & migrations
  ├── tests/            # Comprehensive test suite (unit, integration, GraphQL queries)
  └── public/               # Static assets
  ```

## ✅ Running Tests

To ensure the application's reliability and maintainability, run the test suite:

-   **All tests:** `npm test`
-   **Watch mode:** `npm run test:watch`
-   **Coverage report:** `npm run test:coverage`

## 📧 Contact

Feel free to reach out if you have any questions or feedback!

---

*Built with clean code and scalability in mind.*
