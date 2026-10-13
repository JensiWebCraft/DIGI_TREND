# DiGi Trend Creative Operations Platform

> **Full-Stack Creative Operations, Content Production & Agency Delivery Platform**  
> *Built for DiGi Trend's Rajkot Creative & Performance Marketing Operations*  
> **Evaluation Reference:** DiGi Trend Practical Assignment & Technical Evaluation

---

## Executive Summary

DiGi Trend manages fast-paced marketing, social media creative production, video editing, branding campaigns, and performance ads across diverse regional and national clients. Traditional generic project management tools lack domain-specific awareness of creative briefs, approval cycles, platform specifications, and AI content generation.

The **DiGi Trend Creative Operations Platform** is an end-to-end, full-stack creative operations system tailored specifically to agency workflows:
- **Centralized Workflows:** Bridges client account management, task execution, and multi-platform content scheduling.
- **Dynamic Real-Time Visualizations:** Live task distribution charts and client delivery progress bars dynamically calculated from operational data.
- **Embedded AI Creative Engine:** Direct integration with Google Gemini (`gemini-1.5-flash` / `gemini-3.5-flash-lite`) to generate 5-part creative briefs (Headline, Visual Concept, Caption, Hashtags, CTA, Alternate Angle) directly exportable to tasks and calendar schedules.
- **High-Converting Landing Page & Live Workspace:** A public-facing showcase with interactive feature walkthroughs, responsive design, and an integrated 1:1 Creative Design challenge showcase.

---

## System Architecture

The application is structured as a decoupled client-server architecture with dual-mode database persistence (MongoDB Atlas with automatic in-memory fallback for offline resilience).

```
+------------------------------------------------------------------------+
|                        CLIENT LAYER (Port 3000)                        |
|   React 18 + Vite 5 + Tailwind CSS + Lucide Icons + Outfit/Inter UI    |
+-------------------+-------------------+--------------------------------+
|   Landing Page    |  Operations Hub   |       AI Creative Lab          |
| - Agency Hero     | - Executive KPI   | - Gemini AI Assistant          |
| - Problem/Soln    | - Task Engine     | - 5-Part Brief Generator       |
| - Interactive Art | - Content Planner | - Instant Export to Task/Cal   |
| - 1:1 IG Creative | - Client Accounts | - In-memory Prompt History     |
+---------+---------+---------+---------+----------------+---------------+
          |                   |                          |
          | REST API Calls    | Axios HTTP Requests      | JSON Payloads
          v                   v                          v
+------------------------------------------------------------------------+
|                        SERVER LAYER (Port 5000)                        |
|               Node.js + Express 4 + Morgan Logger + CORS               |
+------------------------------------------------------------------------+
|  /api/clients   |   /api/tasks   |  /api/content   |      /api/ai      |
|  CRUD accounts  |  Task status,  |  Calendar posts │  Gemini API proxy |
|  & retainers    |  assignees, SLA|  & platforms    │  & JSON validator |
+-----------------------------+------------------------------------------+
                              |
                    Database Persistence
                              |
          +-------------------+-------------------+
          v                                       v
+-------------------------------+   +-------------------------------+
|     MongoDB Atlas (Cloud)     |   |     Memory Fallback Store     |
| Mongoose Schemas & Relations  |   |  Pre-seeded with Rajkot Agency|
| (Users, Clients, Tasks, Posts)|   |  Accounts, Tasks, & Posts     |
+-------------------------------+   +-------------------------------+
```

---

## Technology Stack & Rationale

| Layer | Technologies | Justification & Architectural Rationale |
|---|---|---|
| **Frontend Framework** | **React 18 + Vite 5** | Instant Hot Module Replacement (HMR), sub-second build times, component modularity, and smooth concurrent state transitions. |
| **Styling & Design System** | **Tailwind CSS 3.4** | Utility-first CSS allowing custom agency design tokens, deep slate/purple aesthetic, dark mode accents, micro-interactions, and responsive layout primitives. |
| **Icons & Typography** | **Lucide React + Google Fonts (Outfit & Inter)** | Clean, modern iconography with crisp typographic hierarchy suitable for high-density agency dashboards. |
| **Backend Runtime** | **Node.js (ES Modules) + Express 4** | Lightweight, high-throughput asynchronous I/O with clear MVC route separation and expressive middleware architecture. |
| **Database & ODM** | **MongoDB Atlas + Mongoose 8** | Flexible JSON-document schema design accommodating evolving social media formats, custom platform tags, and client retainers. |
| **Fault-Tolerant Engine** | **Dual-Mode Data Store** | Automatic detection of MongoDB connection state with transparent zero-config fallback to an in-memory database seeded with real Rajkot client data. |
| **Generative AI** | **Google Gemini API** (`gemini-1.5-flash`) | Industry-leading latency and JSON formatting for real-time creative brainstorming, copy generation, and strategy development. |

---

## Feature Completeness Matrix

| Section | Assignment Requirement | Implementation Status | Key Features Delivered |
|---|---|:---:|---|
| **Sec 1** | **Understanding the Domain** | Complete | Tailored specifically to DiGi Trend's creative production cycles, client retainers, SLA deadlines, and multi-format posts. |
| **Sec 2** | **Landing Page** | Complete | High-converting design with agency positioning, interactive feature demos, workflow comparisons, testimonials, and live prototype toggle. |
| **Sec 3** | **Internal Workspace / Dashboard** | Complete | Live real-time KPIs (Total Clients, Active Projects, Pending Creatives, Completed Tasks, Upcoming Posts) and quick task creation modal. |
| **Sec 4** | **Data Visualizations** | Complete | Dynamic **Task Status Distribution** donut chart and **Project Progress by Client** progress visualizers computed from live database records. |
| **Sec 5** | **Content Planner / Calendar** | Complete | Triple-view switcher (Calendar Grid, Card Kanban, Table List), platform filters (Instagram, LinkedIn, YouTube, Facebook, X), status lifecycle, and post creation. |
| **Sec 6** | **AI Creative Assistant** | Complete | Live Gemini API integration generating 6 structured sections: Hook Headline, Visual Concept, Caption, Strategic Hashtags, High-Impact CTA, and Bonus Angle. |
| **Sec 7** | **Interactive Workflows** | Complete | 1-Click "Export to Task" and "Schedule to Calendar" buttons from AI briefs directly updating database collections. |
| **Sec 8** | **Search, Filter & Sorting** | Complete | Real-time text search, priority filtering (High/Medium/Low), status tabs (To Do/In Progress/Review/Completed), and client filtering. |
| **Sec 9** | **Database Design & Relationships** | Complete | 5 relational Mongoose schemas (`User`, `Client`, `Task`, `ContentPost`, `AIGeneration`) with foreign-key references and pre-seeded database. |
| **Sec 10** | **Creative Design Challenge** | Complete | 1:1 Instagram Creative for *"Why Businesses Need Strong Branding in 2026"* with full design rationale, concept breakdown, typography, and hierarchy. |
| **Sec 11** | **AI Usage Documentation** | Complete | Dedicated [`AI_USAGE.md`](./AI_USAGE.md) documenting tools used, prompts, generated code, human edits, weaknesses, and optimizations. |
| **Sec 12** | **Code Quality & Architecture** | Complete | Clean modular components, reusable hooks, parameterized controllers, async error handlers, and zero compile/runtime errors. |
| **Sec 13** | **Responsive Design** | Complete | Full responsiveness across Desktop (1440px), Laptop/Tablet (1024px), and Mobile (375px) with intentional navigation adaptations and drawer menus. |

---

## Database Schemas & Data Architecture

The project models agency operations across 5 primary collections:

### 1. User Schema (`server/models/User.js`)
* `name` (String, Required): Full employee name (e.g., *"Kavita Shah"*).
* `email` (String, Unique): Agency workspace login.
* `role` (Enum): `'Admin'`, `'Creative Lead'`, `'Designer'`, `'Copywriter'`, `'Video Editor'`, `'Account Manager'`.
* `avatar` (String): Profile picture avatar URL.
* `active` (Boolean): Workspace availability flag.

### 2. Client Schema (`server/models/Client.js`)
* `name` (String, Required): Business name (e.g., *"Jagdamba Agro Polymers"*).
* `industry` (String): Vertical market (Agri-tech, Luxury Real Estate, Healthcare, Fashion).
* `contactPerson` (String): Primary client point of contact.
* `email` / `phone` (String): Direct communication channels.
* `monthlyRetainer` (Number): Monthly contracted billing in INR (₹).
* `status` (Enum): `'Active'`, `'Onboarding'`, `'Paused'`.
* `brandColors` (Array of Strings): Client brand palette codes for creative consistency.

### 3. Task Schema (`server/models/Task.js`)
* `taskTitle` (String, Required): Creative deliverable title.
* `client` (ObjectId -> Ref: `Client`): Associated client account.
* `clientName` (String): Denormalized display name for fast dashboard rendering.
* `service` (Enum): `'Social Media'`, `'Branding'`, `'Performance Ads'`, `'Video Editing'`, `'Content Writing'`.
* `platform` (Enum): `'Instagram'`, `'LinkedIn'`, `'YouTube'`, `'Facebook'`, `'X (Twitter)'`, `'Omnichannel'`.
* `assignedEmployee` (ObjectId -> Ref: `User`): Assigned agency specialist.
* `assignedEmployeeName` (String): Display name with operational role.
* `priority` (Enum): `'Urgent'`, `'High'`, `'Medium'`, `'Low'`.
* `status` (Enum): `'To Do'`, `'In Progress'`, `'Review'`, `'Completed'`.
* `startDate` / `dueDate` (Date): Delivery timeline and SLA tracking.
* `description` (String): Scope of work, creative brief, and specs.
* `referenceLink` (String): Link to Figma design, Google Drive raw footage, or moodboard.

### 4. ContentPost Schema (`server/models/ContentPost.js`)
* `title` (String, Required): Social media campaign or post theme.
* `client` (ObjectId -> Ref: `Client`): Target client account.
* `platform` (Enum): Target social platform.
* `format` (Enum): `'Reel / Short'`, `'Carousel'`, `'Single Post'`, `'Story'`, `'Long-form Video'`.
* `scheduledDate` (Date): Planned publishing timestamp.
* `status` (Enum): `'Draft'`, `'Design Pending'`, `'Review Required'`, `'Approved'`, `'Scheduled'`, `'Published'`.
* `caption` / `hashtags` / `cta` (String): Ready-to-publish social copy.
* `mediaUrl` (String): Creative asset URL or Figma frame preview.

### 5. AIGeneration Schema (`server/models/AIGeneration.js`)
* `prompt` (String): User creative generation prompt.
* `client` (ObjectId -> Ref: `Client`, Optional): Tailored client brand context.
* `platform` / `contentType` (String): Target platform and format constraints.
* `generatedContent` (Object): Structured brief (Headline, Visual Concept, Caption, Hashtags, CTA, Alternate Angle).
* `createdAt` (Date): Timestamp of ideation.

---

## Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: Local MongoDB or MongoDB Atlas cluster (a pre-seeded in-memory store activates automatically if no MongoDB URI is supplied).
- **Google Gemini API Key** *(Optional)*: For live AI brief generation.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/JensiWebCraft/DIGI_TREND.git
cd DIGI_TREND
```

---

### Step 2: Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create or verify `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digitrend_ops
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > **Note:** If `MONGO_URI` is omitted or unavailable, the backend runs in **In-Memory Mode** using realistic pre-seeded agency data.

4. Seed the database (Optional for MongoDB Atlas):
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will be live at `http://localhost:5000`.

---

### Step 3: Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000`.

---

## REST API Documentation

### Dashboard & Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Retrieves real-time KPI metrics, dynamic task distribution percentages, and delivery trends. |

### Clients API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/clients` | List all client accounts with retainer details and active project counts. |
| `POST` | `/api/clients` | Create a new client account with branding guidelines. |
| `GET` | `/api/clients/:id` | Retrieve client profile by ID. |
| `PUT` | `/api/clients/:id` | Update client details and retainers. |
| `DELETE` | `/api/clients/:id` | Remove client record. |

### Tasks & Production API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch tasks with query filters (`status`, `priority`, `client`, `search`). |
| `POST` | `/api/tasks` | Create new deliverable task with live DB persistence. |
| `GET` | `/api/tasks/:id` | Get individual task brief, assignees, and reference links. |
| `PUT` | `/api/tasks/:id` | Update status (`To Do` -> `In Progress` -> `Review` -> `Completed`), priority, or assignees. |
| `DELETE` | `/api/tasks/:id` | Delete task. |

### Content Planner API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/content` | Fetch scheduled social media content posts. |
| `POST` | `/api/content` | Schedule a new content post with media URL and copy. |
| `PUT` | `/api/content/:id` | Update post publishing status, caption, or scheduled date. |
| `DELETE` | `/api/content/:id` | Remove content post. |

### AI Creative Engine API
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/generate` | Generates a structured 5-part creative brief using Gemini API with automatic fallback. |
| `GET` | `/api/ai/history` | Retrieves recent prompt ideation history. |

---

## Creative Design Challenge (Section 10)

### Topic: "Why Businesses Need Strong Branding in 2026"
- **Format:** 1:1 Instagram Post (1080 x 1080 px)  
- **Deliverable Location:** Built directly into the platform Landing Page under the **Creative Challenge Showcase** section.

### Creative Concept & Strategy
In 2026, generative AI has democratized generic design production, flooding feeds with identical synthetic visuals. Commoditized design is free; **distinctive brand identity is the only moat**. The creative visually and conceptually confronts this shift:

1. **The Hook / Contrast:**
   - Visual dichotomy between *"Commodity AI Content"* (gray, uniform, drowned in algorithm noise) versus *"High-Value Brand Moat"* (bold, vibrant, intentional typography).
   - Core Headline: *"In 2026, AI can clone your copy and graphics in 3 seconds. It cannot clone a brand people trust."*
2. **Typography & Visual Hierarchy:**
   - **Primary Display:** High-contrast modern grotesque sans-serif (`Outfit`) with variable weights for authoritative readability.
   - **Accent Element:** Electric violet and cyan gradient pill tags highlighting key metrics (*"78% of consumers buy from brands with recognizable points of view"*).
3. **Brand Integration:**
   - Seamless watermark integration of DiGi Trend's signature geometric monogram and gradient badge.
   - Actionable CTA: *"Stop blending in. Build your 2026 brand moat with DiGi Trend."*

---

## AI Usage Documentation

This project strictly adheres to Section 11 of the evaluation guidelines. Full transparency on tools, prompts, human modifications, and weaknesses is documented in:  
**[Read AI_USAGE.md](./AI_USAGE.md)**

---

## Responsive Design Verification

Tested and optimized for:
- **Desktop (1440px):** Multi-column executive dashboards, side-by-side calendar views, and split Kanban boards.
- **Laptop / Tablet (1024px):** Collapsible sidebar navigation, adaptive 2-column cards, and horizontal-scroll data tables.
- **Mobile (375px):** Touch-friendly bottom navigation bar, off-canvas drawers, stacked KPI metrics, and full-screen modal sheets.

---

## Known Issues & Future Roadmap (Section 15)

1. **Real-time WebSockets:** Replace current optimistic state sync with Socket.io for instantaneous multi-user collaborative editing on Kanban boards.
2. **Asset Uploading Pipeline:** Integrate direct AWS S3 / Cloudinary signed URL uploads for high-resolution video and raw PSD/AI files.
3. **Automated Publishing Webhooks:** Connect Meta Graph API and LinkedIn API for direct 1-click publishing from the Content Planner.

---

## Author & Candidate Details

- **Assignment:** DiGi Trend Creative Operations Platform
- **Role:** Full-Stack Web Development & Creative Operations Engineer
- **Location:** Rajkot, Gujarat, India
#   D I G I _ T R E N D  
 