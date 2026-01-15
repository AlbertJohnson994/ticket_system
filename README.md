# Ticket System

A modern, microservices-based application for managing events and ticket sales. This system handles everything from user registration and event creation to ticket processing and notifications, built with a robust Spring Cloud backend and a reactive frontend.

## 🏗 System Architecture

The project follows a microservices architecture to ensure scalability, resilience, and separation of concerns.

### Backend Ecosystem (Spring Boot & Cloud)

*   **Discovery Server (`discovery-server`)**
    *   **Tech**: Java 17, Spring Cloud Netflix Eureka.
    *   **Role**: Acts as the Service Registry. All microservices register here upon startup, allowing for dynamic service discovery and decoupling IP addresses from service names.

*   **API Gateway (`gateway`)**
    *   **Tech**: Spring Cloud Gateway, Resilience4j.
    *   **Role**: The single entry point for all client requests. It intelligently routes traffic to the appropriate microservices (Events, Sales, etc.) and provides a layer for resilient patterns like Circuit Breaking.

*   **Events Service (`events`)**
    *   **Tech**: Spring Data JPA, Hibernate, SQLite.
    *   **Role**: Manages the core domain of "Events". Responsible for creating, updating, and listing events, as well as managing ticket inventory and venue details.

*   **Sales Service (`sales`)**
    *   **Tech**: Spring Data JPA, OpenFeign, SQLite.
    *   **Role**: Handles the business logic for ticket transactions. It integrates with the Events service to validate availability and records sales data.

*   **Users Service (`users`)**
    *   **Tech**: Spring Data JPA, SQLite.
    *   **Role**: Manages user identities and lifecycles. Provides CRUD capabilities for user accounts, ensuring the system knows who is purchasing or managing events.

*   **Notifications Service (`notifications-service`)**
    *   **Tech**: Spring Boot Starter Mail.
    *   **Role**: An asynchronous service dedicated to sending external communications, such as email confirmations for ticket purchases.

### Frontend (`frontend`)

*   **Tech**: React 19, Vite, Framer Motion, Axios.
*   **Role**: A modern Single Page Application (SPA) that delivers a premium user experience.
*   **Features**:
    *   **Styling**: Custom CSS for a unique, vibrant look (Glassmorphism, Dark Mode).
    *   **Performance**: Built with Vite for lightning-fast reloading and bundling.
    *   **Interaction**: Rich animations using Framer Motion.

## 🛠 Technology Stack

*   **Backend**: Java 17, Spring Boot 3.1.5, Spring Cloud 2022.0.4.
*   **Database**: SQLite (isolated per service for true microservice decoupling).
*   **Frontend**: React 19, Vite, Javascript.
*   **Containerization**: Docker & Docker Compose.

## 🚀 Getting Started

### Prerequisites

*   Java 17+
*   Node.js & npm
*   Docker & Docker Compose (optional but recommended)

### Running with Docker

 The easiest way to run the entire system is using Docker Compose:

```bash
docker-compose up --build
```

This will start all backend services and the frontend application.

### Running Locally

1.  **Start the Discovery Server**:
    ```bash
    cd discovery-server
    ./mvnw spring-boot:run
    ```

2.  **Start the Microservices**:
    (Repeat for `events`, `sales`, `users`, `notifications-service`, and `gateway` in separate terminals)
    ```bash
    cd [service-name]
    ./mvnw spring-boot:run
    ```

3.  **Start the Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 📚 API Documentation

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for detailed information on available endpoints.
