# ShipTrack - Multi-Carrier Shipment Tracking & Delay Analytics System

**DBMS Level-3 Project**

ShipTrack is a production-ready, full-stack enterprise logistics web application designed to track multi-carrier shipments, analyze delivery delays in real time, and optimize supply chain operations.

---

## 🌟 Executive Summary & Features

- **Exact Visual Replica of Reference SaaS Dashboard**: Dark navy sidebar, top search header, date picker, 5 interactive KPI cards, Recharts trend area chart, status donut distribution, carrier performance SLA progress bars, recent shipments table, delayed shipments summary, Leaflet India map, MongoDB tracking events stream, and system alerts.
- **Dual-Database DBMS Architecture**:
  - **PostgreSQL**: Relational schema handling Users, Customers, Orders, Carriers, Warehouses, Inventory, Shipments, Route Legs, and Status History.
  - **MongoDB**: NoSQL collection (`tracking_events`) managing high-frequency scanner and GPS location events.
- **Advanced DBMS Features**:
  - **Atomic Transactions**: Inventory deduction and shipment creation within atomic boundaries.
  - **Triggers**: Automatic audit logging into `shipment_status_history` on status updates.
  - **Database Views**: `active_shipments_view` and `delayed_shipments_per_carrier_view`.
  - **Stored Procedures / Functions**: `calculate_delay(shipment_id)` dynamic delay calculator.
  - **Indexes**: Indexed foreign keys and search columns for fast query execution.
- **Role-Based Access Control (RBAC)**: `ADMIN`, `WAREHOUSE_STAFF`, `CARRIER_DRIVER`, and `CUSTOMER`.
- **Interactive Multi-Leg Routing & Timeline**: Step-by-step shipment journey tracking.
- **Report Generation & Export**: Automated CSV datasheet export and PDF printing.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Maps**: Leaflet & React-Leaflet
- **Validation**: Zod, React Hook Form
- **Authentication**: JWT & Bcryptjs
- **Database ORM & Driver**: Prisma ORM (PostgreSQL/SQLite) & Official MongoDB Driver

---

## 📁 Dedicated Database Scripts (`database/queries/`)

- `01_schema_ddl.sql`: Complete DDL schema creation with PK, FK, NOT NULL, CHECK, UNIQUE.
- `02_triggers_and_functions.sql`: Stored function `calculate_delay()` and Trigger `log_shipment_status_change()`.
- `03_views.sql`: Database views (`active_shipments_view`, `delayed_shipments_per_carrier_view`).
- `04_indexes.sql`: Performance indexes on tracking numbers, status, and foreign keys.
- `05_sample_dml_queries.sql`: Complex SQL queries demonstrating JOINs, Subqueries, GROUP BY, HAVING, and Transactions.

---

## 🚀 Installation & Setup Instructions

### 1. Environment Configuration
Create `.env` file based on `.env.example`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shiptrack_db?schema=public"
MONGODB_URI="mongodb://localhost:27017/shiptrack_mongodb"
JWT_SECRET="shiptrack_super_secret_jwt_key_2025"
```

### 2. Install Dependencies & Initialize Database
```bash
npm install
npx prisma db push
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Production Build Verification
To test production build:
```bash
npm run build
npm run start
```
