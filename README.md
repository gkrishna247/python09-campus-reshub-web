# Campus Resource Hub

A state-of-the-art, role-based resource management system for educational institutions. Built with React 19, Vite, and Material UI, this platform streamlines the process of booking, managing, and auditing campus resources like classrooms, labs, and equipment.

## 🚀 Vision & Purpose
The Campus Resource Hub is designed to eliminate the friction in campus logistics. Whether you are a student looking for a study space, a faculty member scheduling a lab, or an administrator auditing resource usage, this platform provides a seamless, intuitive, and high-performance experience.

## ✨ Key Features

### 👤 Role-Based Experience
- **Students**: Browse available resources, check schedules, and book spaces for study or projects.
- **Faculty**: Request specialized resources, manage bookings for classes, and approve student requests.
- **Staff**: Manage resource inventory, handle maintenance requests, and oversee facility bookings.
- **Administrators**: Full system control including user management, audit logs, global statistics, and calendar overrides.

### 🛠️ Core Functionalities
- **Dynamic Resource Discovery**: Search and filter resources by type, capacity, and availability.
- **Advanced Booking System**: Real-time availability checks with support for conflict resolution.
- **Administrative Suite**:
  - **User Management**: Comprehensive control over user roles and access.
  - **Audit Logs**: Transparent tracking of all system actions for security and accountability.
  - **Live Statistics**: Data-driven insights into resource utilization.
  - **Schedule Management**: Granular control over resource operating hours.
- **Responsive Design**: Fully optimized for desktop and mobile devices.
- **Dark Mode Support**: Elegant dark and light themes powered by Material UI.

## 💻 Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Framework**: [Material UI (MUI) 7](https://mui.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State Management**: React Context API
- **API Client**: [Axios](https://axios-http.com/)
- **Date Handling**: [Day.js](https://day.js.org/)

## 🛠️ Project Structure

```text
src/
├── assets/             # Static assets like images and icons
├── components/         # Reusable UI components
│   ├── common/         # Generic components (layout, snackbars, etc.)
│   └── ...            # Feature-specific components
├── hooks/              # Custom React hooks (auth, notifications, etc.)
├── layouts/            # Page layouts (Dashboard, Auth, Approval)
├── pages/              # Main page components organized by feature
├── routes/             # Routing configuration and Guards
├── services/           # API communication layer
├── store/              # Context Providers for global state
├── theme/              # MUI theme definitions (Light/Dark)
└── utils/              # Helper functions and constants
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd python09-campus-reshub-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and add your API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🚢 Deployment
The project includes a `Procfile` for easy deployment to platforms like Scalingo or Heroku.
- **Start Command**: `npm start` (serves the `dist` folder using `serve`)

## 🛡️ Security
- **Role-Based Access Control (RBAC)**: Strict route guarding and UI-level permission checks.
- **JWT Authentication**: Secure token-based authentication with automatic refresh logic.
- **Protected Routes**: Middleware to ensure users only access authorized content.

## 📄 License
This project is licensed under the MIT License.
