# VitShelf

![Express](https://img.shields.io/badge/Express-000000.svg?style=flat-square&logo=Express&logoColor=white)  ![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat-square&logo=JSON&logoColor=white)  ![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat-square&logo=npm&logoColor=white)  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black)  ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat-square&logo=Nodemon&logoColor=white)  ![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=React&logoColor=black)  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white)  ![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=flat-square&logo=Vite&logoColor=white)  ![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=flat-square&logo=Axios&logoColor=white)  ![CSS](https://img.shields.io/badge/CSS-663399.svg?style=flat-square&logo=CSS&logoColor=white)

## Overview

Bookshelf is a full-stack personal library web application. A React SPA handles the frontend with Redux Toolkit for state management, while an Express.js backend serves a REST API backed by a SQLite database via better-sqlite3.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Features

|      | Component         | Details                                                                                                                                                                                                                                          |
| :--- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⚙️  | **Architecture**  | <ul><li>Full-stack **client-server** architecture</li><li>Frontend: React SPA (Single Page Application)</li><li>Backend: `Express.js` REST API server</li><li>SQLite database via `better-sqlite3`</li><li>Separate `server/` package with its own `package.json`</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>**TypeScript** used across both frontend and backend</li><li>`tsconfig.json` enforces strict type-checking</li><li>Consistent file structure with `.ts`, `.tsx`, `.js` extensions</li><li>No linting config detected (e.g., ESLint/Prettier absent)</li></ul> |
| 📄 | **Documentation** | <ul><li>`LICENSE` file present — project is openly licensed</li><li>No `README.md` detected in the codebase</li><li>No inline JSDoc or API documentation tooling found</li><li>No auto-generated docs (e.g., Swagger/OpenAPI) configured</li></ul> |
| 🔌 | **Integrations**  | <ul><li>`axios` for HTTP client requests from frontend to backend</li><li>`react-router-dom` for client-side routing</li><li>`jsonwebtoken` for JWT-based auth token generation/validation</li><li>`bcryptjs` for password hashing</li><li>`cors` middleware for cross-origin request handling</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Clear **frontend/backend separation** — independent `package.json` per layer</li><li>Frontend state managed via `@reduxjs/toolkit` slices</li><li>`react-redux` connects Redux store to React components</li><li>Vite plugin system used via `@vitejs/plugin-react`</li></ul> |

---

## Project Structure

```
└── bookshelf/
    ├── index.html
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── index.html
    ├── README.md
    ├── server
    │   ├── .DS_Store
    │   ├── db
    │   ├── index.js
    │   ├── middleware
    │   ├── package-lock.json
    │   ├── package.json
    │   └── routes
    ├── src
    │   ├── .DS_Store
    │   ├── api
    │   ├── App.tsx
    │   ├── components
    │   ├── index.tsx
    │   ├── pages
    │   ├── store
    │   ├── styles.css
    │   ├── types
    │   ├── ui
    │   └── utils
    ├── tsconfig.json
    └── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Python 3.10+ / Node.js 18+ *(depending on the stack above)*

### Installation

```sh
git clone https://github.com/IlluzyonistCode/VitShelf
cd VitShelf
npm install
```

### Usage

```sh
npm start
```

---

## Contributing

- [Report Issues](https://github.com/IlluzyonistCode/VitShelf/issues)
- [Submit Pull Requests](https://github.com/IlluzyonistCode/VitShelf/pulls)
- [Discussions](https://github.com/IlluzyonistCode/VitShelf/discussions)

---

## License

Distributed under the [AGPL-3.0](LICENSE) license.
