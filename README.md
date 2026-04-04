# DevOps Shop — Java Microservice Application

A full-stack microservice application built with **Spring Boot**, **React**, and **MySQL** — ready for containerization and DevOps practice.

## Architecture

```
┌──────────┐     ┌─────────────┐     ┌──────────────────┐     ┌────────────┐
│ Frontend │────▶│ API Gateway │────▶│ Product Service  │────▶│ Product DB │
│ (React)  │     │  (port 8083)│     │   (port 8084)    │     │  (MySQL)   │
│ port 3000│     │             │     └──────────────────┘     └────────────┘
└──────────┘     │             │
                 │             │     ┌──────────────────┐     ┌────────────┐
                 │             │────▶│  Order Service   │────▶│  Order DB  │
                 └─────────────┘     │   (port 8085)    │     │  (MySQL)   │
                                     └──────────────────┘     └────────────┘
                                              │
                 ┌─────────────────┐          │ (calls Product Service
                 │ Service Registry│◀─────────┘  to check stock)
                 │ Eureka (8761)   │
                 └─────────────────┘
```

## Services

| Service            | Port | Tech Stack                     | Description                     |
|--------------------|------|--------------------------------|---------------------------------|
| **Frontend**       | 3000 | React 18 + Nginx               | Web UI for products & orders    |
| **API Gateway**    | 8083 | Spring Cloud Gateway           | Routes requests to microservices|
| **Product Service**| 8084 | Spring Boot + JPA + MySQL      | CRUD for products + stock mgmt  |
| **Order Service**  | 8085 | Spring Boot + JPA + MySQL      | Order placement + status updates|
| **Service Registry**| 8761| Netflix Eureka                 | Service discovery               |
| **Product DB**     | 3307 | MySQL 8.0                      | Products database               |
| **Order DB**       | 3308 | MySQL 8.0                      | Orders database                 |

## Prerequisites

- **Docker** & **Docker Compose** installed
- (Optional) **Java 17** and **Maven** for local development
- (Optional) **Node.js 18** for frontend local development

## Quick Start — Run Everything with Docker

```bash
# Clone and navigate to the project
cd LearnDevops

# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove all data volumes
docker-compose down -v
```

Wait ~2 minutes for all services to start. Then open:
- **Frontend**: http://localhost:3000
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8083

## API Endpoints

### Product Service (via Gateway at :8083)

| Method | Endpoint                          | Description          |
|--------|-----------------------------------|----------------------|
| GET    | `/api/products`                   | List all products    |
| GET    | `/api/products/{id}`              | Get product by ID    |
| POST   | `/api/products`                   | Create a product     |
| PUT    | `/api/products/{id}`              | Update a product     |
| DELETE | `/api/products/{id}`              | Delete a product     |
| PUT    | `/api/products/{id}/reduce-stock` | Reduce stock (qty)   |

### Order Service (via Gateway at :8083)

| Method | Endpoint                      | Description            |
|--------|-------------------------------|------------------------|
| GET    | `/api/orders`                 | List all orders        |
| GET    | `/api/orders/{id}`            | Get order by ID        |
| POST   | `/api/orders`                 | Create a new order     |
| PUT    | `/api/orders/{id}/status`     | Update order status    |

### Sample API Calls

```bash
# Create a product
curl -X POST http://localhost:8083/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"Gaming laptop","price":999.99,"quantity":50}'

# Create an order
curl -X POST http://localhost:8083/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"John","customerEmail":"john@example.com","items":[{"productId":1,"quantity":2}]}'

# Get all products
curl http://localhost:8083/api/products

# Get all orders
curl http://localhost:8083/api/orders
```

## Local Development (without Docker)

### Backend Services

Each service can be run individually with Maven:

```bash
# Start Service Registry first
cd service-registry
mvn spring-boot:run

# Then start Product Service (update application.yml to point to localhost DBs)
cd product-service
mvn spring-boot:run

# Start Order Service
cd order-service
mvn spring-boot:run

# Start API Gateway
cd api-gateway
mvn spring-boot:run
```

> **Note:** For local development, update `application.yml` in each service to use `localhost` instead of Docker service names for database and Eureka URLs.

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will start on http://localhost:3000

## Project Structure

```
LearnDevops/
├── docker-compose.yml          # Orchestrates all services
├── .gitignore
├── README.md
│
├── service-registry/           # Eureka Service Discovery
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│
├── api-gateway/                # Spring Cloud Gateway
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│
├── product-service/            # Product CRUD Microservice
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       └── main/java/com/devops/product/
│           ├── controller/
│           ├── dto/
│           ├── entity/
│           ├── exception/
│           ├── repository/
│           └── service/
│
├── order-service/              # Order Microservice
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       └── main/java/com/devops/order/
│           ├── client/         # WebClient to call Product Service
│           ├── controller/
│           ├── dto/
│           ├── entity/
│           ├── exception/
│           ├── repository/
│           └── service/
│
└── frontend/                   # React Frontend
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── public/
    └── src/
        ├── components/
        └── services/
```

## Key Concepts for DevOps Practice

This application demonstrates:
- **Microservice architecture** — Independent services with separate databases
- **Service discovery** — Eureka for dynamic service registration
- **API Gateway** — Single entry point routing to backend services
- **Inter-service communication** — Order Service calls Product Service via WebClient
- **Containerization** — Multi-stage Dockerfiles for optimized images
- **Docker Compose** — Multi-container orchestration with health checks
- **Database per service** — Each microservice owns its database

When you're ready for AWS deployment, you can:
- Push Docker images to **ECR**
- Deploy on **ECS/EKS**
- Use **RDS** for MySQL databases
- Set up **Jenkins** pipelines for CI/CD
- Add **ALB** for load balancing
