# Taskify – Frontend Project Documentation

> **Stack**: React 19 + Vite 7 + TailwindCSS 4 + Redux Toolkit + React Router v7  
> **Backend base URL**: `http://localhost:8080`  
> **Object Storage (MinIO)**: `http://localhost:9000`  
> **Dev server**: `npm run dev` (port 5173)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Directory Structure](#3-directory-structure)
4. [Routing](#4-routing)
5. [Authentication & Auth Flow](#5-authentication--auth-flow)
6. [Global State (Redux)](#6-global-state-redux)
7. [Global Contexts](#7-global-contexts)
8. [HTTP Client & Interceptors](#8-http-client--interceptors)
9. [Layout System](#9-layout-system)
10. [Features](#10-features)
11. [API Reference Map](#11-api-reference-map)
12. [Key Design Patterns & Conventions](#12-key-design-patterns--conventions)
13. [Known Limitations / TODOs](#13-known-limitations--todos)

---

## 1. Project Overview

**Taskify** is a project management web application inspired by Jira/Linear. It allows users to:

- Register/login (email OTP + Google SSO)
- Create and manage **projects** (called "Spaces")
- Manage **tasks** within a project via Kanban Board, List View, and Summary Dashboard
- Attach files to tasks (via MinIO pre-signed URLs)
- View activity logs per project
- Invite members to projects
- Configure project settings

The app is **SPA-first** with client-side routing and JWT-based authentication with automatic token refresh.

---

## 2. Tech Stack & Dependencies

| Category | Library | Version |
|---|---|---|
| UI Framework | React | 19 |
| Build Tool | Vite | 7 |
| Styling | TailwindCSS | 4 |
| Routing | React Router DOM | 7 |
| State Management | Redux Toolkit | 2 |
| HTTP Client | Axios | 1 |
| DnD (Kanban) | @hello-pangea/dnd | 18 |
| Icons | @radix-ui/react-icons | 1 |
| Utilities | clsx | 2 |

---

## 3. Directory Structure

```
d:\taskify\
├── src/
│   ├── App.jsx                    # Root – wraps BrowserRouter + AppRoutes
│   ├── main.jsx                   # Entry – wraps App with Redux Provider + ToastProvider + ThemeProvider
│   ├── routes/
│   │   └── index.jsx              # All route definitions (public + protected)
│   ├── layouts/
│   │   ├── DashboardLayout.jsx    # Shell for all authenticated pages
│   │   └── components/
│   │       ├── TopNavbar.jsx
│   │       ├── LeftSidebar.jsx
│   │       └── UserDropdown.jsx
│   ├── store/
│   │   ├── index.js               # Redux store
│   │   └── authSlice.js           # Auth state slice
│   ├── contexts/
│   │   ├── ToastContext.jsx        # Global toast notifications
│   │   └── ThemeContext.jsx        # Dark/Light mode
│   ├── utils/
│   │   ├── axiosClient.js         # Axios + interceptors
│   │   └── formatters.js          # getInitials(), formatFullDateTime()
│   ├── components/
│   │   └── common/
│   │       └── ProtectedRoute.jsx
│   └── features/
│       ├── auth/
│       ├── projects/
│       ├── tasks/
│       └── project_invitations/
```

---

## 4. Routing

| Path | Component | Auth | Description |
|---|---|---|---|
| `/` | `LandingPage` | No | Marketing page |
| `/login` | `LoginPage` | No | Email + Google login |
| `/register` | `RegisterPage` | No | Registration |
| `/verify-email` | `VerifyEmailPage` | No | OTP verification |
| `/setup-account` | `SetupAccountPage` | No | Post-register profile setup |
| `/forgot-password` | `ForgotPasswordPage` | No | Forgot password |
| `/verify-forgot-password-otp` | `VerifyForgotPasswordOtpPage` | No | Reset OTP |
| `/reset-password` | `ResetPasswordPage` | No | New password |
| `/create-site` | `CreateSitePage` | Soft | Workspace name setup |
| `/create-project` | `CreateProjectPage` | Soft | New project wizard |
| `/projects` | `TaskListPage` | **Yes** | Auto-redirects to first project |
| `/projects/:projectId` | `TaskListPage` | **Yes** | Core project view |
| `/projects/:projectId/settings` | `SpaceSettingsPage` | **Yes** | Project settings |
| `/projects/:projectId/invitations/confirm` | `InvitationConfirmPage` | No | Accept invitation |

---

## 5. Authentication & Auth Flow

### Storage
- `access_token` → `localStorage`
- `refresh_token` → `localStorage`
- `user_info` → `localStorage` (JSON)

### Login Flow
1. `POST /api/v1/auth/log-in` → `{ accessToken, refreshToken, userInfo }`
2. Store all three in localStorage
3. Dispatch Redux `setAuth(userInfo)`

### Token Refresh (automatic)
- On `401`: axiosClient interceptor queues requests, calls `POST /api/v1/auth/refresh`
- Success → retry queued requests with new token
- Failure → clear localStorage, redirect `/login`

### Registration OTP Flow
1. `POST /api/v1/auth/request-register-otp`
2. `POST /api/v1/auth/verify-register-otp`
3. `POST /api/v1/users`

### Google SSO
- `POST /api/v1/auth/google?code=<authCode>`

---

## 6. Global State (Redux)

### `authSlice`

```js
state = {
  isAuthenticated: boolean,
  user: { id, fullName, email, ... } | null
}
```

**Actions:** `setAuth(userPayload)`, `logout()`  
**Selectors:** `selectIsAuthenticated(state)`, `selectUser(state)`

---

## 7. Global Contexts

### `ToastContext`

```js
const toast = useToast();
toast.success("message") | toast.error("msg") | toast.warning("msg") | toast.info("msg")
```

Auto-dismiss after 4s. Fixed top-right, z-index 9999.

### `ThemeContext`

Toggles `dark` class on `<html>`. All components use `dark:` TailwindCSS variants.

---

## 8. HTTP Client & Interceptors

**File**: `src/utils/axiosClient.js`  
**Base URL**: `http://localhost:8080`

- **Request interceptor**: Injects `Authorization: Bearer <token>` on all requests except `/auth/login`, `/auth/register`, `/auth/refresh`
- **Response interceptor**: Auto-refreshes token on 401

### ⚠️ MinIO Upload Exception

MinIO pre-signed URL uploads must use **plain `fetch()`**, NOT `axiosClient`:

```js
await fetch(minioUploadUrl, {
  method: "PUT",
  headers: { "Content-Type": file.type },
  body: file,
  // NO Authorization header
});
```

---

## 9. Layout System

`DashboardLayout` wraps all authenticated pages. On mount:
1. Fetches `GET /api/v1/projects` (project list)
2. Fetches `GET /api/v1/users/information` (user info)
3. Auto-redirects `/projects` → `/projects/:firstProjectId`

**Visual structure:**
```
┌────────────────────────────────┐
│  TopNavbar                     │
├──────────┬─────────────────────┤
│ Left     │ <children> (main)   │
│ Sidebar  │                     │
└──────────┴─────────────────────┘
            ✨ Quickstart (fixed bottom-right)
```

---

## 10. Features

### 10.1 Auth Feature (`src/features/auth/`)

| File | Purpose |
|---|---|
| `api/authApi.js` | All auth API calls |
| `pages/LoginPage.jsx` | Email + Google login |
| `pages/RegisterPage.jsx` | Registration form |
| `pages/VerifyEmailPage.jsx` | OTP input |
| `pages/SetupAccountPage.jsx` | Profile setup |
| `pages/CreateSitePage.jsx` | Workspace creation |
| `pages/ForgotPasswordPage.jsx` | Forgot password |
| `pages/VerifyForgotPasswordOtpPage.jsx` | Reset OTP |
| `pages/ResetPasswordPage.jsx` | New password |
| `index.js` | Named exports |

---

### 10.2 Projects Feature (`src/features/projects/`)

#### APIs

| File | Methods |
|---|---|
| `apis/projectApi.js` | `getAll()`, `createProject()`, `getMembers(id)`, `deleteProject()`, `isProjectManager()`, `updateProject()`, `getProjectSummary(id)` |
| `apis/activityLogApi.js` | `getActivityLogs(projectId, page, size)` |

#### Pages

| Page | Route |
|---|---|
| `CreateProjectPage.jsx` | `/create-project` |
| `SpaceSettingsPage.jsx` | `/projects/:id/settings` |

#### Components

| Component | Description |
|---|---|
| `NavigationTabs.jsx` | Tab bar: Summary / List / Board / Timeline / Pages |
| `ProjectHeader.jsx` | Project name + actions menu |
| `KanbanBoard.jsx` | Drag-drop board (columns: TO_DO / IN_PROGRESS / IN_REVIEW / DONE) |
| `ProjectListView.jsx` | Jira-style table with inline status change |
| `ProjectSummary.jsx` | Dashboard: stat cards, donut chart, bar chart, activity feed |
| `BoardToolbar.jsx` | Filter bar above board |
| `ProjectActionsMenu.jsx` | Edit/Delete/Members dropdown |
| `project_setting/add_people/` | Add member modal |
| `project_setting/delete_project/` | Delete confirm dialog |
| `space_settings/SettingsSidebar.jsx` | Settings left nav |
| `space_settings/SettingsDetailsPanel.jsx` | Settings content |

#### Navigation Tabs Status

| Tab ID | Status |
|---|---|
| `SUMMARY` | ✅ Implemented – API-driven dashboard |
| `LIST` | ✅ Implemented – Jira-style table |
| `BOARD` | ✅ Implemented – Drag-drop Kanban |
| `TIMELINE` | 🚧 Placeholder |
| `PAGES` | 🚧 Placeholder |

---

### 10.3 Tasks Feature (`src/features/tasks/`)

#### APIs

| File | Methods |
|---|---|
| `api/taskApi.js` | `getAllTaskByProjectId()`, `createTask()`, `updateTask()`, `deleteTask()`, `getTaskDetail()` |
| `api/attachmentApi.js` | `initUpload()`, `uploadToMinIO()`, `confirmUpload()`, `listAttachments()`, `getDownloadUrl()` |

#### Pages

`TaskListPage.jsx` – Main orchestrator at `/projects/:projectId`:
- Manages `tasks`, `projectInfo`, `currentTab` state
- Opens task detail modal via `?selectedIssue=<taskId>` URL param
- Renders the correct view component per tab

#### Task Components

| Component | Description |
|---|---|
| `task-card/TaskCard.jsx` | Kanban card. Click → sets URL param. Inline status, date, delete. |
| `task-detail/TaskDetailModal.jsx` | Modal shell via `ReactDOM.createPortal`. Reads `?selectedIssue`. |
| `task-detail/TaskDetailHeader.jsx` | Breadcrumb + close button |
| `task-detail/TaskDetailContent.jsx` | Editable title, description, Attach button, `TaskAttachments` |
| `task-detail/TaskDetailSidebar.jsx` | Status, assignee dropdown, priority, reporter, due date |
| `task-detail/TaskAttachments.jsx` | Upload (3-step), file list, download. Drag & drop support. |
| `CreateTaskForm.jsx` | Inline form in Kanban TO_DO column |

#### Task Data Model

```js
{
  id: string,           // UUID
  taskName: string,
  description: string | null,
  status: "TO_DO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
  priority: "HIGHEST" | "HIGH" | "MEDIUM" | "LOW" | "LOWEST" | null,
  dueDate: string | null,  // "2026-05-19T00:00:00"
  assignee: { id, fullName, email } | null,
  assignor: { id, fullName, email } | null,  // reporter/creator
  project: { id, name },
  createdAt: string,
  updatedAt: string,
}
```

#### Update Assignee Contract

| Intent | Payload |
|---|---|
| Change assignee | `{ assigneeId: "userId" }` |
| Unassign | `{ assigneeId: "" }` (empty string) |
| Keep unchanged | Omit `assigneeId` entirely |
| Update other field | `{ status: "DONE" }` (no assigneeId) |

#### File Attachment Upload Flow (3 steps)

```
Step 1 → POST /api/v1/tasks/:taskId/attachments/init-upload
         Body: { fileName, fileType, fileSize }
         Response: { uploadUrl, objectKey }

Step 2 → PUT {uploadUrl}  ← MinIO direct, NO auth, plain fetch()
         Headers: { "Content-Type": fileType }
         Body: raw file binary

Step 3 → POST /api/v1/tasks/:taskId/attachments/confirm-upload
         Body: { objectKey }
         Response: attachment record saved to DB
```

---

### 10.4 Project Invitations (`src/features/project_invitations/`)

- `pages/InvitationConfirmPage.jsx` → `/projects/:projectId/invitations/confirm`
- Handles invitation token validation and accept/decline flow

---

## 11. API Reference Map

> Base: `http://localhost:8080` | Header: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint |
|---|---|
| POST | `/api/v1/auth/log-in` |
| POST | `/api/v1/auth/log-out` |
| POST | `/api/v1/auth/refresh` |
| POST | `/api/v1/auth/introspect` |
| POST | `/api/v1/auth/request-register-otp` |
| POST | `/api/v1/auth/verify-register-otp` |
| POST | `/api/v1/auth/forgot-password` |
| POST | `/api/v1/auth/verify-forgot-password-otp` |
| POST | `/api/v1/auth/reset-password` |
| POST | `/api/v1/auth/google?code=` |
| POST | `/api/v1/accounts/existence` |
| POST | `/api/v1/users` |
| GET  | `/api/v1/users/information` |

### Projects
| Method | Endpoint |
|---|---|
| GET    | `/api/v1/projects` |
| POST   | `/api/v1/projects` |
| GET    | `/api/v1/projects/:id` |
| PUT    | `/api/v1/projects/:id` |
| DELETE | `/api/v1/projects/:id` |
| GET    | `/api/v1/projects/:id/is-manager` |
| GET    | `/api/v1/projects/:id/summary` |

### Tasks
| Method | Endpoint |
|---|---|
| GET    | `/api/v1/tasks/projects/:projectId` |
| POST   | `/api/v1/tasks` |
| GET    | `/api/v1/tasks/:taskId` |
| PUT    | `/api/v1/tasks/:taskId` |
| DELETE | `/api/v1/tasks/:taskId` |

### Attachments
| Method | Endpoint |
|---|---|
| POST | `/api/v1/tasks/:taskId/attachments/init-upload` |
| POST | `/api/v1/tasks/:taskId/attachments/confirm-upload` |
| GET  | `/api/v1/tasks/:taskId/attachments` |
| GET  | `/api/v1/tasks/:taskId/attachments/:attachmentId/download-url` |

### Activity Logs
| Method | Endpoint |
|---|---|
| GET | `/api/v1/activity-logs?projectId=&page=0&size=20` |

Optional query params: `entityType`, `entityId`, `actionType`

### Standard Response Shape
```json
{
  "code": 200,
  "message": "Successfully",
  "body": { ... }
}
```
Always access data via `response.data.body`.

---

## 12. Key Design Patterns & Conventions

### Feature-Based Structure
Each feature owns its `api/`, `components/`, `pages/`. No cross-feature imports except shared `utils/` and `contexts/`.

### URL-Based Modal Routing
Task detail modal is opened by setting `?selectedIssue=<taskId>` in the URL. Modals are shareable and browser-back closeable.

### Optimistic Updates (Kanban)
UI updates immediately on drag; reverts to previous state if the API call fails.

### Toast Notifications
Never use `alert()`. Always use `useToast()` hook.

### Dark Mode
TailwindCSS `dark:` variants throughout. Theme class toggled on `<html>` by `ThemeContext`.

---

## 13. Known Limitations / TODOs

| Feature | Status |
|---|---|
| Timeline view | 🚧 Placeholder |
| Pages view | 🚧 Placeholder |
| Subtask | 🚧 Button exists, not implemented |
| Activity in TaskDetailContent | 🚧 Placeholder comment |
| Pagination in List View | ⚠️ All tasks loaded at once |
| Real-time (WebSocket) | ❌ Not implemented |
| Global search | ❌ Not implemented |
| Notifications | ❌ Not implemented |
| Mobile responsive | ⚠️ Partial |
