# Feedback Collection Platform

A production-style MERN Stack application that enables organizations to collect, manage, analyze, and respond to customer feedback through a secure role-based dashboard.

Built with modern full-stack development practices including JWT authentication, role-based authorization, email verification workflows, RESTful API architecture, secure cookie handling, and deployment to cloud platforms.

---

# Project Overview

This application allows users to submit feedback to companies while providing administrators with a centralized dashboard to monitor customer sentiment, manage feedback status, review analytics, and export reports.

The project was designed to simulate real-world enterprise requirements such as:

- Authentication & Authorization
- Secure API Development
- Email Verification
- Role-Based Access Control (RBAC)
- Dashboard Analytics
- CSV Reporting
- Production Deployment
- Security Best Practices

---

## Live Demo

### Frontend
https://feedback-collection-xi.vercel.app

### Backend API
https://feedbackcollection-g245.onrender.com

---


# Key Features

## User Features

- User Registration & Login
- Email Verification Workflow
- Secure Authentication using JWT
- Submit Feedback with Ratings
- Categorized Feedback System
- Track Personal Feedback History
- Responsive User Dashboard

## Admin Features

- Company-specific Admin Dashboard
- View and Manage Customer Feedback
- Change Feedback Status
- Send Custom Responses
- View Company Users
- Export Feedback Reports as CSV
- Review Feedback Metrics

## Security Features

- JWT Access Tokens
- Refresh Token Rotation
- HttpOnly Secure Cookies
- Role-Based Route Protection
- Protected API Endpoints
- CORS Whitelisting
- Rate Limiting
- Input Validation
- Secure Password Hashing using bcrypt

---

# Skills Demonstrated

## Backend Development

- REST API Design
- Express.js Architecture
- Middleware Development
- Authentication & Authorization
- JWT Token Management
- Refresh Token Flow
- Error Handling
- Route Protection
- Secure Cookie Management

## Database Design

- MongoDB
- Mongoose ODM
- Data Modeling
- Relationships Between Users, Companies, and Feedback

## Frontend Development

- React
- React Router
- Context API
- Custom Hooks
- Protected Routes
- Responsive UI Design
- API Integration using Axios

## Security Engineering

- Role-Based Access Control (RBAC)
- Password Hashing
- Access & Refresh Tokens
- CORS Configuration
- Rate Limiting
- Environment Variable Management

## DevOps & Deployment

- Vercel Deployment
- Render Deployment
- Environment Configuration
- Production Build Management

---

# Technology Stack

| Layer | Technologies |
|---------|-------------|
| Frontend | React, React Router, Bootstrap 5, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, Refresh Tokens |
| Email Services | Nodemailer |
| Security | bcrypt, CORS, Rate Limiting |
| Deployment | Vercel, Render |

---

# System Architecture

```text
React Frontend
       │
       ▼
Axios Client
       │
       ▼
Express REST API
       │
 ┌─────┴─────┐
 ▼           ▼
MongoDB    Email Service
(Mongoose) (Nodemailer)
```

---

# Authentication Flow

```text
User Login
    │
    ▼
Credentials Validation
    │
    ▼
Generate Access Token
Generate Refresh Token
    │
    ▼
Store Refresh Token
(HttpOnly Cookie)
    │
    ▼
Access Protected Routes
```

---

# Project Structure

```text
feedbackCollectionMERN
│
├── backend
│   ├── Controllers
│   ├── Middleware
│   ├── Models
│   ├── Routes
│   ├── Utils
│   └── Config
│
├── frontend
│   ├── Components
│   ├── Features
│   ├── Hooks
│   ├── Context
│   ├── API
│   └── Pages
│
└── README.md
```

---

# Core Backend Features

### Authentication

- Register User
- Login User
- Logout User
- Refresh Access Token
- Email Verification

### Authorization

- User Role Access
- Admin Role Access
- Protected Routes
- Permission Validation

### Feedback Management

- Create Feedback
- Update Feedback Status
- View Feedback History
- Search & Filter Feedback
- Export CSV Reports

---

# API Highlights

| Method | Endpoint | Description |
|----------|------------|------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| POST | /api/auth/refresh | Refresh Token |
| POST | /api/feedback | Submit Feedback |
| GET | /api/feedback | Fetch Feedback |
| PATCH | /api/feedback/:id/review | Review Feedback |
| GET | /api/feedback/csv | Export CSV |

---

# Deployment

## Frontend Deployment

Platform: Vercel

```bash
npm run build
```

## Backend Deployment

Platform: Render

```bash
npm start
```

---

# Local Installation

## Clone Repository

```bash
git clone https://github.com/mohammed1819/feedbackCollection.git
cd feedbackCollection
```

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

## Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

FRONTEND_URL=http://localhost:5173

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

NODE_ENV=production
```

## Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
```

---

# Security Measures

- JWT Authentication
- Refresh Token Rotation
- HttpOnly Cookies
- SameSite Cookie Protection
- Password Hashing with bcrypt
- Protected Routes
- RBAC Authorization
- Rate Limiting
- CORS Whitelisting
- Input Validation
- Environment Variable Protection

---

# Admin Dashboard

### Dashboard Statistics

- Total Feedback Count
- Total Registered Users
- Average Rating Score

### Feedback Management

- Review Feedback
- Approve Feedback
- Reject Feedback
- Mark as Resolved
- Add Admin Notes
- Email User Responses

### Reporting

- CSV Export Functionality
- Feedback Tracking
- User Monitoring

---

# Future Enhancements

- Feedback Analytics Dashboard
- Charts & Data Visualization
- Notification System
- Advanced Search & Filtering
- Audit Logs
- Admin Activity Tracking
- Automated Report Generation
- Real-Time Notifications
- Dashboard Insights with Graphs

---

# What I Learned

This project strengthened my understanding of:

- MERN Stack Development
- JWT Authentication
- Refresh Token Architecture
- Role-Based Authorization
- Middleware Design Patterns
- MongoDB Data Modeling
- Secure REST API Development
- Production Deployment Workflow
- Frontend & Backend Integration
- API Security Best Practices
- Authentication Flows
- Cloud Deployment

---

# GitHub Repository

**Repository:**  
https://github.com/mohammed1819/feedbackCollection.git

---

# Author

## Mohammed

Full Stack Developer (MERN)

Focused on building secure, scalable, and production-ready web applications.

### Areas of Interest

- Backend Development
- REST APIs
- Authentication & Authorization
- Database Design
- Full Stack MERN Applications
- Cloud Deployment
- Software Architecture

---

# License

This project is licensed under the MIT License.

Feel free to fork, modify, and build upon this project for learning or commercial purposes.
