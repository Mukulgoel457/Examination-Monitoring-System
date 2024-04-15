# Examination Monitoring System

## Introduction
The Examination Monitoring System is a web-based application designed to automate the process of managing and monitoring examinations. Built using React and Vite, this system leverages modern web technologies to provide a seamless experience for administrators and students alike. The project integrates several plugins and tools to enhance the development workflow and improve performance.

## Technical Setup
- **Framework**: React
- **Build Tool**: Vite
- **Hot Module Replacement (HMR)**: Ensures that updates are reflected instantly without needing a page refresh, which is crucial during development for efficiency.
- **ESLint**: Helps maintain code quality through strict syntax and style guidelines.

## Plugins Used
- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)**: Utilizes Babel for implementing Fast Refresh. This setup helps in maintaining state while making changes to the React components, providing a smoother development experience.
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)**: Uses the SWC compiler which acts as a faster alternative to Babel, improving build performance.

## Installation Guide
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rishita3003/Examination-Monitoring-System.git

2. **Navigate to the project directory**:
   ```bash
   cd Examination-Monitoring-System
3. **Install Dependencies**:
   ```bash
   npm install
4. **Run the developement server**:
   npm run dev

## Usage
* ***Admin Dashboard:*** Allows administrators to oversee all examinations, manage questions, and view performance metrics.
* ***Student Dashboard:*** Students can log in to view upcoming exams, take exams, and check their previous scores.
* ***Performance Analytics:*** Graphical representations of student performance help in quick assessment and remedial actions.

## Contributing

We welcome contributions to the Examination Monitoring System. If you are looking to contribute, please:

* Fork the repository.
* Create a new branch for your feature.
* Add your changes and commit them with a meaningful commit message.
* Push the changes to your fork and submit a pull request.






# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
