# Hirenix AI — Intelligent Placement Preparation Platform

Hirenix AI is a full-stack AI-powered placement preparation platform built with the MERN stack. It helps students prepare for campus placements through personalized AI roadmaps, resume analysis, DSA tracking, mock interviews, skill gap analysis, company-wise preparation, and global analytics.

## Tagline

Intelligent Placement Preparation Platform

## Project Goal

The goal of Hirenix AI is to provide a complete placement preparation ecosystem where students can track, analyze, and improve their readiness for product-based and service-based companies.

Instead of using separate tools for resume, DSA, mock interviews, and roadmaps, Hirenix AI brings everything into one connected dashboard.

## Key Features

- User Authentication with JWT
- Profile Management
- AI Roadmap Generator
- Resume Analyzer
- DSA Tracker
- Placement Readiness Score
- AI Mock Interview
- AI Skill Gap Analyzer
- Company-wise Preparation Tracker
- Global Analytics Dashboard
- Dashboard with personalized next best action

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer for file upload
- AI API integration

### Database

- MongoDB Atlas

### AI Integration

- Gemini API for AI-generated roadmap, resume feedback, mock interview questions, answer evaluation, and skill gap analysis.

## Major Modules

### 1. Authentication

Users can register, login, logout, and access protected routes securely.

### 2. Profile

Users can add:

- College
- Branch
- Graduation year
- Target role
- Target companies
- Skills
- Preparation level

This data is used by AI modules to personalize output.

### 3. AI Roadmap Generator

Generates a personalized placement preparation roadmap based on:

- Target role
- Target company
- Current skills
- Preparation level

Users can track roadmap day-wise progress.

### 4. Resume Analyzer

Users can upload a resume and get:

- ATS score
- Missing keywords
- Strengths
- Weaknesses
- Improvement suggestions
- Resume summary

### 5. DSA Tracker

Users can track DSA questions with:

- Topic
- Difficulty
- Status
- Notes
- Revision status

### 6. Placement Readiness Score

Hirenix AI calculates a weighted readiness score using:

- Profile strength
- Roadmap progress
- Resume score
- DSA progress
- Mock interview score
- Consistency

### 7. AI Mock Interview

Users can start mock interviews for:

- HR
- DSA
- MERN
- Project
- Behavioral
- Mixed interview

AI evaluates answers and gives scores, feedback, strengths, improvements, and final report.

### 8. AI Skill Gap Analyzer

Analyzes user profile, resume, DSA, roadmap, and interview performance to identify:

- Missing skills
- Weak skills
- Strong skills
- Priority skills
- Weekly focus areas
- 4-week learning plan

### 9. Company-wise Preparation Tracker

Users can track company-specific preparation:

- Company name
- Target role
- Priority
- Application status
- Preparation focus
- Tasks
- Progress

### 10. Global Analytics Dashboard

Shows complete preparation analytics across:

- Profile
- Resume
- Roadmap
- DSA
- Mock interviews
- Skill gap
- Company preparation
