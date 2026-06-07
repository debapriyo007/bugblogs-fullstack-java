# BugBlogs: Full-Stack Developer Blog Platform

BugBlogs is a high-performance, full-stack blogging application tailored for developers. It features a modern React Single Page Application (SPA) frontend and a secure, robust Spring Boot backend. Authors can write posts in Markdown with live syntax highlighting, organize content via categories and tags, upload images to Cloudinary, sign in with Google OAuth2 or OTP-verified email verification, and administrators can manage users and posts using a sleek analytics-enabled dashboard.

---

<p align="center">
  <img src="https://img.shields.io/badge/Java-25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 25" />
  <img src="https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot 4.0.6" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.0.16-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📋 Table of Contents
1. [🚀 Key Features](#key-features)
2. [📐 Architecture Overview](#architecture-overview)
3. [🛠️ Technology Stack](#technology-stack)
4. [📂 Project Directory Map](#project-directory-map)
5. [🛠️ Local Development Setup](#local-development-setup)
6. [⚙️ Environment Configurations](#environment-configurations)
7. [🐳 Dockerization Guide](#dockerization-guide)
8. [📦 Unified Production Build (Topology A)](#unified-production-build-topology-a)
9. [🚀 Postman Integration Testing](#postman-integration-testing)

---

## 🚀 Key Features

*   **Secure Sessions & Auth**: JWT authentication utilizing secure, stateless HTTP-Only cookies for robust cross-site scripting (XSS) and cross-site request forgery (CSRF) protection.
*   **OTP & OAuth2 Sign-In**: Supports single-click Google Sign-In as well as password-less logins via secure OTP (One-Time Password) codes sent straight to the user's inbox.
*   **Markdown Editor**: Real-time parsed Markdown view enabling developers to write technical posts with instant preview and syntax highlighting for major programming languages.
*   **Cloud Storage**: Seamless media upload handling directly integrated with Cloudinary for fast CDN-driven image delivery.
*   **Admin Console**: Access statistical oversight graphs (users growth, category counts, top stories) and role control centers to manage post moderation and users accounts.
*   **Interactions**: Built-in views, likes, and comment threads for maximum community engagement.

---

## 📐 Architecture Overview

The following diagram illustrates the network flow and service communication:

```mermaid
graph TD
    Client[React SPA Client - Vite] <-->|HTTP / CORS / JWT| API[Spring Boot REST API]
    API <-->|Spring Security / Filter Chain| Auth[JWT & OAuth2 Client]
    API <-->|Spring Data JPA| DB[(MySQL Database)]
    API --->|SMTP Protocol| Email[Brevo / SMTP Service]
    API --->|Cloudinary API| Cloud[Cloudinary Image Storage]
```

---

## 🛠️ Technology Stack

### Backend Technologies
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Language** | ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | Core application runtime environment (Java 25) |
| **Framework** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white) | Core REST API backend architecture (v4.0.6) |
| **Security** | ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=spring-security&logoColor=white) | Stateless authentication using JWT cookies & Google OAuth2 |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | Main relational database management system |
| **ORM** | ![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white) | Data access layer, entity mappings and query parsing |
| **Build System** | ![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=apache-maven&logoColor=white) | Project dependencies compilation and builder |
| **Cloud CDN** | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | Distributed media upload hosting API |
| **Mail Dispatcher** | ![Brevo](https://img.shields.io/badge/Brevo-3C4DF3?style=flat-square&logo=brevo&logoColor=white) | SMTP mailing engine for verification OTP dispatch |

### Frontend Technologies
| Component | Technology | Description |
| :--- | :--- | :--- |
| **SPA Library** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | Component-driven user interface rendering (v19) |
| **Build Engine** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Bundler & high-speed development server (v8) |
| **Style Sheet** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Utility-first responsive spacing layout guidelines (v3.4) |
| **Components** | ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radix-ui&logoColor=white) | Unstyled accessible dropdowns, dialogs, and panels |

---

## 📂 Project Directory Map

```text
├── frontend/                  # React Frontend Application
│   ├── public/                # Static assets & favicons
│   ├── src/
│   │   ├── components/        # UI components (Header, Footer, LogoBug)
│   │   ├── context/           # React contexts (Auth, Theme)
│   │   ├── pages/             # Page views (Auth, BlogDetail, Admin Console)
│   │   ├── services/          # HTTP client APIs
│   │   └── App.jsx            # Routing and modal coordination
│   ├── tailwind.config.js     # Styles design token configuration
│   └── package.json           # Frontend dependency manifest
│
└── spring-backend/            # Spring Boot Backend REST Service
    ├── src/main/java/com/blogapp/
    │   ├── controller/        # REST Controllers (Auth, Blogs, Comments)
    │   ├── dto/               # Request & Response Data Objects (DTOs)
    │   ├── model/             # JPA Entity Definitions
    │   ├── repository/        # Spring Data JPA Repository interfaces
    │   ├── security/          # Spring Security, JWT validation filters
    │   └── service/           # Logic implementations
    ├── src/main/resources/
    │   ├── application.yaml   # Main environment configurations
    │   └── application-dev.yaml # Dev configurations (with environment overrides)
    ├── Dockerfile             # Multi-stage containerization build file
    ├── postman_collection.json # Integrated API testing collection
    └── pom.xml                # Maven build dependencies config
```

---

## 🛠️ Local Development Setup

### Prerequisite Checklist
*   **Java:** JDK 25 installed
*   **NodeJS:** Version 18 or higher (along with npm)
*   **Database:** MySQL Server instance running locally

### Running the Backend
1. Create a MySQL database instance named `blog_db`:
   ```sql
   CREATE DATABASE blog_db;
   ```
2. Navigate to `spring-backend/src/main/resources` and configure your credentials inside `application-dev.yaml`.
3. Start the Spring Boot application using the wrapper:
   ```bash
   cd spring-backend
   ./mvnw spring-boot:run
   ```

### Running the Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`. Vite is pre-configured to proxy API requests to your local backend on port `8080`.

---

## ⚙️ Environment Configurations

For deployments or container overrides, configure the variables listed below:

| Variable Name | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `8080` |
| `DB_URL` | MySQL Connection URL | `jdbc:mysql://localhost:3306/blog_db` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | `your_mysql_password` |
| `JWT_SECRET` | 256-bit Base64 JWT Secret Key | *Generate a secure random string* |
| `JWT_EXPIRATION` | JWT token expiration time (in ms) | `86400000` (1 day) |
| `GOOGLE_CLIENT_ID` | Google Console OAuth Client ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google Console OAuth Client Secret | `your-google-client-secret` |
| `MAIL_HOST` | SMTP Server Host Address | `smtp.gmail.com` or Brevo SMTP |
| `MAIL_PORT` | SMTP Server Connection Port | `587` |
| `MAIL_USERNAME` | Mailer account username | `example@gmail.com` |
| `MAIL_PASSWORD` | Mailer account SMTP password / app password | `your-app-password` |
| `MAIL_FROM` | Origin mail address for notifications | `no-reply@bugblogs.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Cloud Name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret Key | `your-api-secret` |
| `FRONTEND_URL` | Frontend client origin (CORS/Redirects) | `http://localhost:5173` |

---

## 🐳 Dockerization Guide

### 1. Build the Docker Image
Navigate to your `spring-backend` directory and compile the multi-stage image:
```bash
cd spring-backend
docker build -t blog-backend:latest .
```

### 2. Run in Docker Desktop GUI
1. Open **Docker Desktop** and navigate to the **Images** tab.
2. Find `blog-backend:latest` and click the blue **Run** button.
3. Click on **Optional settings** to configure variables:
   * **Container Name:** `blog-backend-container`
   * **Ports:** Map Host Port `8080` to Container Port `8080`.
   * **Environment Variables:** Click the **+** (Add) button to supply:
     * `DB_URL` ➡️ `jdbc:mysql://host.docker.internal:3306/blog_db`
     * `DB_USERNAME` ➡️ `root`
     * `DB_PASSWORD` ➡️ `your_mysql_password`
4. Click **Run**. The app will launch and securely connect to the host MySQL database using the `host.docker.internal` gateway loop.

---

## 📦 Unified Production Build (Topology A)

For ease of hosting, compile the frontend assets directly inside the JAR to serve the app on a single unified port:

1. Navigate to the frontend folder and build the assets:
   ```bash
   cd frontend && npm run build
   ```
2. Move static files to the Spring static resource directory:
   ```bash
   cp -r dist/* ../spring-backend/src/main/resources/static/
   ```
3. Compile the package JAR:
   ```bash
   cd ../spring-backend
   ./mvnw clean package -DskipTests
   ```
4. Execute the JAR:
   ```bash
   java -jar target/spring-backend-0.0.1-SNAPSHOT.jar
   ```
   *Your site will be fully accessible at `http://localhost:8080`.*

---

## 🚀 Postman Integration Testing
To test the API endpoints independently:
1. Locate [postman_collection.json](file:///Users/debapriyodas/Desktop/blog-appV0.1/spring-backend/postman_collection.json) in the `spring-backend` directory.
2. Import it into Postman.
3. Set the `baseUrl` variable to `http://localhost:8080`.
4. Run requests under the **Auth** folder (e.g. Register, Login, OTP confirmation) to verify JWT generation and stateless cookie authorization.
