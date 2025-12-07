# API Monitoring & Observability Platform

A comprehensive platform to track, analyze, and visualize API metrics across microservices.

## Architecture
The system consists of three main components:
1.  **Tracking Client**: A Spring Boot library (`tracking-client`) included in microservices. It intercepts requests, enforces rate limits (token bucket), and sends logs to the collector.
2.  **Collector Service**: A centralized Spring Boot service (`collector-service`) that ingests logs and processes alerts. It uses a **Dual MongoDB** setup:
    -   **Primary DB**: Stores raw API logs (`api_logs`).
    -   **Secondary DB**: Stores metadata, issues, and users (`issues`, `users`).
3.  **Dashboard**: A Next.js frontend (`dashboard`) for visualizing metrics and managing issues.

## Tech Stack
-   **Backend**: Kotlin, Spring Boot 3.2, Gradle
-   **Frontend**: Next.js 14, TypeScript, Tailwind CSS
-   **Database**: MongoDB (x2)

## Setup Instructions

### Prerequisites
-   Java 17+
-   Node.js 18+
-   MongoDB running on `localhost:27017`

### 1. Collector Service
1.  Navigate to `collector-service`.
2.  Run the application:
    ```bash
    ./gradlew bootRun
    ```
    (Note: Ensure you have `api_logs_db` and `api_metadata_db` created or accessible in Mongo).

### 2. Tracking Client (Usage)
1.  Build the library:
    ```bash
    cd tracking-client
    ./gradlew jar
    ```
2.  Add dependency to your microservices.
3.  Configure in `application.yaml`:
    ```yaml
    monitoring:
      enabled: true
      service-name: "my-service"
      collector-url: "http://localhost:8080/ingest"
      rate-limit:
        limit: 100
    ```

### 3. Dashboard
1.  Navigate to `dashboard`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the dev server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000).

## Key Features
-   **Data Partitioning**: Heavy write logs are separated from critical metadata.
-   **Optimistic Locking**: Ensures safe concurrent resolution of issues in the Collector (using `@Version`).
-   **Rate Limiting**: Distributed/Local client-side limiting reporting back to collector.

## Design Decisions
-   **Interceptor Pattern**: Chosen for the client library to be non-intrusive and auto-configurable.
-   **Dual MongoTemplates**: Explicit `PrimaryMongoConfig` and `SecondaryMongoConfig` beans to separate concerns and scale differently if needed.
