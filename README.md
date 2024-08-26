# 🚀 AstroBookings : 🧑‍💼 System API

> 🚀 AstroBookings is a sample project for teaching full-stack development with modern technology and proven best practices.

> 🧑‍💼 System API Handles, authorization, synchronization and system-wide logs operations

- [0. Project Summary Briefing](https://github.com/AstroBookings/.github/blob/main/profile/0-project.briefing.md)

Central API for authentication, authorization, and system-wide operations. It manages user sessions, handles access control, and provides interfaces for system monitoring and management.

Developed using **NestJS** with **TypeScript** for robust type checking, maintainability, and scalable architecture.

## Implemented domains

- [x] [Authentication Domain](https://github.com/AstroBookings/.github/blob/main/profile/3-implementation/6_0-authentication.api.md)
- [ ] [Data Synchronization Domain](https://github.com/AstroBookings/.github/blob/main/profile/3-implementation/6_5-synchronization.api.md)
- [ ] [System Monitoring Domain](https://github.com/AstroBookings/.github/blob/main/profile/3-implementation/6_6-system-logs.api.md)

#### ⬇️ Consumes:

- `📇 SystemDB`: For user authentication and system logs
- `📇 OperationsDB`: For system-wide operational data
- `📇 CacheDB`: For quick access to frequently used data

#### ⬆️ Provides for:

- All Web Applications: Authentication and authorization services
- Other APIs: Central authentication and system management services

## 📚 Instructions

To **run** the project, follow these steps:

```shell
# clone the project
git clone https://github.com/AstroBookings/system_api.git
cd system_api
# install the dependencies
npm install
# run the project
npm run start
# open at http://localhost:3000
```

To **test** the project, follow these steps:

```shell
# run the tests
npm run test
# run the tests in e2e mode
npm run test:e2e
```

To **develop** the project, follow these steps:

```shell
# run the project in watch mode
npm run start:dev
# run the tests in watch mode
npm run test:watch

```

## [🚀 AstroBookings](https://github.com/AstroBookings)

> [!NOTE]
>
> > _[Alberto Basalo](https://github.com/albertobasalo)_ >> _Elevating Code Quality._

```

```
