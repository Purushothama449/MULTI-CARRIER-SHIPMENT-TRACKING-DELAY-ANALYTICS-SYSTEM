# Multi-Carrier Shipment Tracking and Delay Analytics System

## 1. Project Overview

The Multi-Carrier Shipment Tracking and Delay Analytics System is a web-based application designed to manage shipments across multiple carriers, monitor shipment progress, identify delivery delays, and analyze logistics performance.

The system uses PostgreSQL to store structured information and MongoDB to store shipment tracking events. It provides a centralized dashboard for shipment monitoring, carrier performance analysis, delay detection, and report generation.

## 2. Objectives

- Manage shipments handled by multiple carriers.
- Track shipment status and movement across route legs.
- Store shipment tracking events and timestamps.
- Identify delayed shipments by comparing expected and actual delivery times.
- Analyze carrier and warehouse performance.
- Maintain shipment status history for auditing.
- Generate reports to support logistics decision-making.

## 3. Key Features

### Shipment Management

- Create and manage shipment records.
- Associate shipments with customers, orders, and carriers.
- Maintain origin, destination, and expected delivery information.

### Multi-Carrier Management

- Store carrier details and manage carrier assignments.
- Track shipments handled by different logistics providers.
- Compare carrier performance using delivery and delay statistics.

### Shipment Tracking

- Record shipment status changes and tracking events.
- Monitor shipment progress through route legs.
- Display shipment locations on an interactive map when tracking coordinates are available.

### Delay Analytics

- Compare estimated delivery times with actual delivery times.
- Identify delayed shipments.
- Calculate average delivery delays.
- Analyze delay patterns by carrier, route, and shipment status.

### Reports and Dashboard

- Shipment status report.
- Carrier performance report.
- Delay analysis report.
- Warehouse performance report.
- Monthly shipment summary.

### Security and Data Integrity

- User authentication and role-based access control.
- Input validation and secure handling of credentials.
- Database constraints and relationships.
- Shipment status history for auditing and traceability.

## 4. Technology Stack

| Component                | Technology                    |
| ------------------------ | ----------------------------- |
| Frontend                 | Next.js, React.js, TypeScript |
| Styling                  | Tailwind CSS                  |
| Backend                  | Next.js API routes            |
| Relational database      | PostgreSQL                    |
| NoSQL database           | MongoDB                       |
| ORM                      | Prisma                        |
| Authentication utilities | JSON Web Token and bcryptjs   |
| Charts                   | Recharts                      |
| Maps                     | Leaflet and React Leaflet     |
| Form validation          | React Hook Form and Zod       |
| Version control          | Git and GitHub                |

## 5. Database Design

The system uses a hybrid database architecture.

### PostgreSQL

PostgreSQL stores structured and relational data.

The main entities include:

- Role
- User
- Customer
- Order
- Carrier
- Warehouse
- Shipment
- Route Leg
- Shipment Status History
- Inventory

These entities support relationships, constraints, transactions, and structured reporting.

### MongoDB

MongoDB stores shipment tracking events, including information such as:

- Shipment identifier
- Tracking event type
- Event timestamp
- Latitude and longitude, when available
- Location or checkpoint
- Tracking description

This separation allows structured business records and tracking-event data to be managed using databases suited to their respective data models.

## 6. System Workflow

1. A user logs in to the application.
2. An order and its shipment information are created or retrieved.
3. A carrier and relevant warehouse are associated with the shipment.
4. The shipment is divided into route legs when required.
5. Tracking events are recorded as the shipment moves.
6. Shipment status changes are maintained in the status history.
7. Delivery information is used to identify delays.
8. Reports summarize shipment activity and logistics performance.

## 7. Advanced DBMS Concepts

The project is designed to demonstrate the following database concepts:

- **Transactions:** Maintain consistency when related shipment operations must succeed together.
- **Triggers:** Automatically record shipment status changes in the status history.
- **Views:** Simplify access to frequently used shipment and analytics queries.
- **Functions:** Calculate shipment delay using expected and actual delivery timestamps.
- **Indexes:** Improve the performance of frequently executed queries.
- **Joins and aggregations:** Combine related records and calculate carrier, warehouse, and shipment statistics.
- **Hybrid database architecture:** Use PostgreSQL for relational records and MongoDB for tracking events.

The final implementation should be checked to ensure each listed concept is actually implemented and demonstrated.

## 8. Reports

The system is intended to provide reports such as:

### Carrier Performance Report

Compares carriers using shipment counts, successful deliveries, and average delivery delays.

### Shipment Status Report

Summarizes shipments by status, such as pending, in transit, delayed, and delivered.

### Delay Analysis Report

Identifies delayed shipments and summarizes delay duration across carriers and routes.

### Warehouse Performance Report

Summarizes shipment activity associated with warehouses.

### Monthly Shipment Report

Shows shipment volume, delivery status, and delay statistics by month.

## 9. Installation and Setup

### Prerequisites

Install the following software:

- Node.js and npm
- PostgreSQL
- MongoDB
- Git

### Step 1: Clone the Repository

Replace the repository URL if your GitHub repository URL changes.

```bash
git clone https://github.com/Purushothama449/MULTI-CARRIER-SHIPMENT-TRACKING-DELAY-ANALYTICS-SYSTEM.git
cd MULTI-CARRIER-SHIPMENT-TRACKING-DELAY-ANALYTICS-SYSTEM
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a local `.env` file using `.env.example` as a reference, if that example file exists.

Configure the required values according to your local database setup.

Example:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/shiptrack"
MONGODB_URI="mongodb://localhost:27017/shiptrack"
NEXTAUTH_SECRET="replace_with_a_secure_random_secret"
```

Use the environment variable names required by your actual application. Do not commit `.env` files, passwords, or secret keys to GitHub.

### Step 4: Generate the Prisma Client

```bash
npm run prisma:generate
```

### Step 5: Configure the Database Schema

```bash
npm run prisma:push
```

Ensure that PostgreSQL is running and `DATABASE_URL` is configured correctly before executing this command.

### Step 6: Insert Sample Data

If the project includes the seed script and its database connections are configured, run:

```bash
npm run seed
```

### Step 7: Start the Application

```bash
npm run dev
```

Open the following address in your browser:

```text
http://localhost:3000
```

## 10. Project Structure

The main project directories are expected to follow this general organization. The actual repository structure may differ.

```text
MULTI-CARRIER-SHIPMENT-TRACKING-DELAY-ANALYTICS-SYSTEM/
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── seed.js
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── database/
├── public/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 11. Security Considerations

- Store database credentials and secrets in environment variables.
- Never upload `.env` files containing real credentials.
- Validate user input before processing database operations.
- Apply appropriate authentication and authorization checks.
- Use parameterized database queries or ORM-supported safe query methods.
- Restrict access to sensitive operations based on user roles.

## 12. Testing and Validation

Testing should cover:

- User authentication and authorization.
- Shipment creation and updates.
- Carrier and warehouse associations.
- Tracking event storage and retrieval.
- Shipment status history.
- Delay calculation.
- Report accuracy.
- Database constraints and transaction behavior.
- Invalid input and error handling.

## 13. Project Novelty

The key contribution of this project is the integration of relational shipment management with NoSQL tracking events in a single logistics platform. By combining shipment tracking, delay analysis, carrier performance comparison, and reporting, the system aims to provide a more complete view of shipment operations.

The implemented features and demonstrated results should be used to establish the project's actual novelty.

## 14. Future Enhancements

- Integration with real carrier tracking APIs.
- Automated notifications for delayed shipments.
- More advanced route and delivery-time prediction.
- Historical trend analysis for carrier performance.
- Additional dashboard filters and exportable reports.

## 15. Team Information

**Project Title:** Multi-Carrier Shipment Tracking and Delay Analytics System

**Team Members:**

- Purushothama K C     -     PES1UG25AM810
- Rottela Haritej            -     PES1UG24AM231



**Domain:** Database Management Systems and Logistics Analytics

## 16. License

This project was developed for academic purposes. Add an appropriate open-source license if you intend to distribute or reuse the project publicly.
