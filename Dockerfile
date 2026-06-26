# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3-eclipse-temurin-25 AS backend-builder
WORKDIR /app

# Copy dependency info first to cache maven dependencies
COPY spring-backend/pom.xml ./spring-backend/
RUN mvn -f spring-backend/pom.xml dependency:go-offline -B

# Copy backend source code
COPY spring-backend/src ./spring-backend/src

# Copy built frontend assets into spring boot's static resources path
COPY --from=frontend-builder /app/frontend/dist ./spring-backend/src/main/resources/static

# Build backend JAR (skipping tests for speed in deployment)
RUN mvn -f spring-backend/pom.xml clean package -DskipTests -B

# Stage 3: Create Runtime Container
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=backend-builder /app/spring-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
