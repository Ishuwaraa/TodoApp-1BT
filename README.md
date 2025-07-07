# 📝 Task Manager App

A full-stack task management application built with **React (Vite)** (frontend) and **Spring Boot** (backend).  
Users can sign up, log in, and manage their personal tasks securely with JWT-based authentication. The app is **Dockerized** for easy setup and deployment.

## 🚀 Tech Stack

### Frontend
- React (Vite)
- JavaScript
- Axios
- React Router DOM
- Tailwind CSS

### Backend
- Spring Boot 3
- Java 17
- Spring Security with JWT
- Maven
- MySQL


## 📦 Features
- User Registration & Login
- JWT Authentication with Spring Security
- Reset/change password securely
- View, Create, Update, Delete tasks
- Fully Dockerized (React + Spring Boot + MySQL)


## How to Run the App (Using Docker)

1. **Build the Spring Boot App**:

```
cd backend  
./mvnw clean package -DskipTests 
```

2. **Start both backend and frontend containers**:

```
cd ..
docker-compose up --build
```

- Frontend will be running on: http://localhost:3000
- Backend will be running on: http://localhost:8080


## Running Without Docker

1. **Run the Backend**:

```
cd backend  
./mvnw spring-boot:run
```

2. **Run the Frontend**:

```
cd frontend  
npm install  
npm run dev
```
