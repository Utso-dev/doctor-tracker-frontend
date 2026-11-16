# Doctor Tracker – Frontend Web Application

Modern, high-performance administrative web application for the **Doctor Tracker** platform, built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, and **Chart.js**.

---

## 🚀 Quick Setup Guide (.env.example)

### Prerequisites 
* **Node.js**: v18.17.0 or higher (Recommended: v20+ or v22+)
* **npm**: v9.0.0 or higher
* **Backend**: Express.js REST API running at `http://localhost:4000`

---

### Step-by-Step Installation 

#### 1. Navigate to the Frontend directory
```bash
cd frontend
```

#### 2. Create `.env.local` from `.env.example`
* **macOS / Linux / Git Bash:**
  ```bash
  cp .env.example .env.local
  ```
* **Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env.local
  ```

#### 3. Configure Environment Variables
Inside `.env.local`, ensure the backend API endpoint is properly set:
```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000
```

#### 4. Install Dependencies
```bash
npm install
```

#### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 🔑 Default Admin Credentials 
Make sure the backend database is seeded (`npm run seed` inside the `backend` folder):
* **Login URL**: [http://localhost:3000/login](http://localhost:3000/login)
* **Email**: `admin@gmail.com`
* **Password**: `123456`


---

## 🏗️ System Architecture: Data Flow & Service Interaction Overview

Doctor Tracker follows a clean separation between server and client domains using modern Next.js 16 conventions:

```mermaid
flowchart TD
    subgraph Browser ["Client Browser"]
        URL["Browser URL & Query Parameters"]
        Actions["Client Actions (Create, Edit, Delete Modals)"]
        Charts["Chart.js Interactive Visualizations"]
    end

    subgraph NextServer ["Next.js 16 Server / Edge"]
        Proxy["Next.js 16 Edge Proxy (proxy.ts)"]
        RSC["React Server Components (RSC Pages)"]
        ServerFetch["serverFetch (Auto Bearer Cookie Injection)"]
    end

    subgraph BackendAPI ["Express.js Backend (Port 4000)"]
        JWT["authenticateToken Middleware"]
        Controllers["Doctor, Patient & Dashboard Controllers"]
        MongoDB[("MongoDB Database")]
    end

    URL -->|HTTP Request| Proxy
    Proxy -->|Authorized| RSC
    Proxy -->|Unauthorized| URL
    RSC -->|Parallel Server Fetch| ServerFetch
    ServerFetch -->|REST API with Bearer Token| JWT
    JWT --> Controllers --> MongoDB
    RSC -->|Streamed HTML + Hydrated Props| Actions
    RSC -->|Data Props| Charts
    Actions -->|router.refresh()| RSC
```

### Data Flow Breakdown:
1. **Edge Route Protection (`proxy.ts`):** Evaluates authentication tokens in request cookies at the edge. Unauthorized attempts to access `/dashboard/*` are redirected to `/login` with zero layout flash.
2. **Server-Side Data Hydration (`serverFetch`):** Management views (`DoctorsManagement`, `PatientsManagement`, `DoctorDetailsPage`, `DashboardPage`) execute data retrieval directly on the server concurrently (`Promise.all`), streaming pre-rendered HTML to the client.
3. **URL State Synchronization:** Filtering and searching update the browser URL (`searchParams`). Next.js server components automatically re-render with fresh data without client-side `useEffect` fetch loops.
4. **Autonomous Client Components:** Interactive elements (modals, row actions, delete confirmations) operate locally and trigger `router.refresh()` upon success to revalidate server-rendered data.

---

## 💡 Technical Decisions 

### Decision 1: React Server Components (RSC) & URL Query Sync vs. Heavy Client-Side State (Redux/Zustand)
* **Context:** Doctor and patient tables require multi-criteria filtering, debounced searching, and pagination without prop drilling or stale cache bugs.
* **Choice:** We architected management views as pure React Server Components. State is synchronized through URL query parameters (`searchParams`) rather than introducing complex client-side state stores like Redux or Zustand.
* **Rationale:** Eliminates prop drilling, avoids complex `useCallback`/`useEffect` dependency arrays that frequently cause infinite re-render loops, ensures search results are directly bookmarkable and shareable, and significantly reduces the client-side JavaScript bundle size.

### Decision 2: Next.js 16 Edge Proxy (`proxy.ts`) vs. Client-Side Layout AuthGuard
* **Context:** Administrative routes under `/dashboard/*` must be strictly restricted to authenticated staff.
* **Choice:** Replaced client-side `AuthGuard.tsx` layout wrappers with Next.js 16 official Edge Proxy (`proxy.ts`).
* **Rationale:** A client-side `AuthGuard` must download the layout bundle, mount in the browser, check cookies, and then redirect—causing a noticeable Flash of Unauthenticated Content (FOUC). `proxy.ts` operates at the network edge before any page chunk is downloaded, providing instant redirection and tighter security.

### Decision 3: Decoupled Reusable `DynamicTable` and `PaginationPage`
* **Context:** Tables across doctors, patients, and individual doctor profile views required consistent styling, accessible sorting, and pagination.
* **Choice:** We decoupled pagination logic from `DynamicTable.tsx`, making `DynamicTable` a pure presentational component that accepts column formatters, and centralized pagination in a reusable `PaginationPage.tsx`.
* **Rationale:** Keeps table rendering pure and performant, prevents unwanted re-renders, and enables seamless reuse across doctors, patients, and nested profile patient tables.

---

## 🛠️ Scripts Overview

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server on port 3000 |
| `npm run build` | Builds the production-ready optimized application |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |

---

## 📂 Key Architecture & Folder Structure

```
frontend/
├── app/                              # Next.js App Router (Pages, Layouts & Route Handlers)
│   ├── (admin)/                      # Authenticated Admin Route Group
│   │   └── dashboard/                # Analytics Dashboard, Doctors & Patients management
│   │       ├── doctors/page.tsx      # Doctors management page
│   │       ├── doctors/[id]/page.tsx # Single doctor profile & patients page
│   │       ├── patients/page.tsx     # Patients management page
│   │       └── page.tsx              # Analytics dashboard with Chart.js
│   ├── login/                        # Admin Login Portal
│   ├── registration/                 # Admin Registration
│   ├── proxy.ts                      # Edge route protection & authentication guard
│   └── page.tsx                      # Modern public landing page
├── components/                       # Modular UI Components
│   ├── Chart/                        # Chart.js components (Bar, Doughnut, Line)
│   ├── Dashboard/                    # Dashboard state cards & client analytics views
│   ├── Doctors/                      # DoctorsManagement, DoctorProfileHeader, DoctorStatsCards, DoctorPatientsTable
│   ├── Patients/                     # PatientsManagement, PatientsTable, PatientFilters, PatientModal
│   ├── reusable/                     # Shared UI: DynamicTable, PaginationPage, Loader, Header, Sidebar
│   └── ui/                           # Radix / Shadcn primitives (Select, Dialog, Dropdown, Label)
├── lib/                              # Core utilities & fetch clients
│   ├── Fetch.ts                      # Client-side API request handler with cookie auth
│   └── serverFetch.ts                # Server Components fetch client with automatic headers
├── service/                          # Typed API Service Layer
│   ├── auth/                         # User authentication & token management
│   ├── dashboard/                    # Dashboard statistics endpoints (server & client)
│   ├── doctor/                       # Doctor endpoints (server & client)
│   └── patient/                      # Patient endpoints (server & client)
└── .env.example                      # Complete environment template and setup guide
```

---

## ❓ Troubleshooting 

1. **API Connection Error / Network Failed:**
   - (`cd backend && npm run dev`) and `http://localhost:4000` ।
   - `.env.local` file `NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000` ।

