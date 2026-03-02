# Productivity Management (shadcn/ui)

A modern, high-performance project and productivity management application built with **Laravel 12**, **React 19**, and the beautiful **shadcn/ui** design system.

## 🚀 Key Features

-   **Productivity Focused**: Tools designed to enhance workflow and task management.
-   **Advanced UI/UX**: Fully decorated with `shadcn/ui` components for a premium feel.
-   **Modern Tech Stack**: Leveraging the latest versions of Laravel and React.
-   **Responsive Design**: Optimized for all devices using Tailwind CSS 4.

## 🛠 Tech Stack

-   **Backend**: [Laravel 12](https://laravel.com)
-   **Frontend**: [React 19](https://react.dev)
-   **Adapter**: [Inertia.js](https://inertiajs.com) (Server-Side Routing for SPA)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com) (Radix UI Primitives)
-   **Infrastructure**: Vite, TypeScript, Composer

## 📥 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/thnakon/productivity-management-shadcn.git
    cd productivity-management-shadcn
    ```

2.  **Install PHP dependencies**:
    ```bash
    composer install
    ```

3.  **Install JS dependencies**:
    ```bash
    npm install
    ```

4.  **Set up environment**:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5.  **Run migrations**:
    ```bash
    php artisan migrate
    ```

## 💻 Development

Start the development server (runs both Vite and Laravel Serve):

```bash
composer run dev
```

## 💅 Styling with shadcn/ui

This project uses `npx shadcn@latest` for all UI components. To add a new component:

```bash
npx shadcn@latest add [component-name]
```

---

Built with ❤️ for productivity.
