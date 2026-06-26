# Stage 1: Build Frontend with memory constraints
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
ENV NODE_OPTIONS="--max-old-space-size=256"
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend with memory constraints
FROM maven:3.9-eclipse-temurin-25-alpine AS backend-builder
WORKDIR /app
ENV MAVEN_OPTS="-XX:+UseSerialGC -Xss512k -XX:MaxRAM=256m"

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
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/spring-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
