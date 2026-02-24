# 🏫 Campus Resource Hub (Frontend)

> A state-of-the-art, role-based resource management system frontend built with React 19, Vite, and Material UI. Streamlines the booking, management, and auditing of campus resources.

## 🚀 Tech Stack & Architecture

- **Core Framework:** [React 19](https://react.dev/) & [Vite](https://vitejs.dev/)
- **UI Toolkit:** [Material UI (MUI) v7](https://mui.com/)
- **Routing Layer:** React Router v7 with RBAC-protected wrapper components (`ProtectedRoute`, `RoleRoute`)
- **State Management:** React Context API (`AuthContext`, `NotificationContext`)
- **API Client:** Axios utilizing centralized interceptors mapped cleanly to DRF
- **Date Utilities:** [Day.js](https://day.js.org/)

---

## ✨ Features & Capabilities

### 👤 Role-Based Experience
- **Students:** Browse resources, view live schedules, and submit bookings/special requests.
- **Faculty:** Request entirely new resources and manage approvals for student booking requests.
- **Staff:** Oversee resource inventories and facility limits globally across the application.
- **Administrators:** Handle comprehensive user/role modifications, review audit logs, and manipulate calendar overrides.

### 🛠️ Core UI Flow
- **Dynamic Exploration:** Interactive search and filters to sort resources by type or capacity.
- **Advanced Bookings:** Immediate availability validation interfacing deeply with backend transactional locks.
- **Real-Time Contexts:** Hooks abstracting `NotificationContext` provide instant toast alerts across the UI state.
- **Adaptive Aesthetics:** Built-in mobile responsiveness coupled with elegant Dark/Light toggle modes powered by MUI design tokens.

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **Package Manager**: npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd python09-campus-reshub-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment variables**
   Create a `.env` file in the root directory (or rename `.env.example`):
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Launch the Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
src/
├── components/         # Reusable UI components segmented by feature (bookings, layout, admin)
├── hooks/              # Custom React hooks abstraction layer (useAuth, useNotifications)
├── pages/              # Main view components organized centrally by RBAC roles
├── routes/             # Routing configuration and mapping tree
├── services/           # Service layer segregating independent API entities
├── store/              # Context Providers for global state retention
├── theme/              # MUI theme parameter definitions
└── utils/              # Helper functions and precise time formatting algorithms
```

---

## 🛡️ Security & Integration
- **Role-Based Access Control (RBAC):** Strict routing limits synchronize perfectly with decoded JWT claims.
- **Automated Refreshes:** Granular Axios interceptors silently handle 401 token rotations.
- **Audit Footprints:** Frontend UI components pass exact signatures down to the immutable backend audit models.

## 📄 License
This project is licensed under the **MIT License**.
