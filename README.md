# 🚀 AstroBookings : 🧑‍💼 System API

## [🚀 AstroBookings](https://github.com/AstroBookings)

> A sample project for teaching full-stack development with modern technology and proven best practices.

> 📋 [0. Project Summary Briefing](https://github.com/AstroBookings/.github/blob/main/profile/0-project.briefing.md)

> 📋 [2. System Architecture](https://github.com/AstroBookings/.github/blob/main/profile/2-design/2-system.architecture.md)

> 📋 [3. Model ERD](https://github.com/AstroBookings/.github/blob/main/profile/2-design/3-model.erd.md)

## 🧑‍💼 System API

Central API for authentication, authorization, and system-wide operations. It manages user sessions, handles access control, and provides interfaces for system monitoring and management.

Developed using NestJS with TypeScript for robust type checking, maintainability, and scalable architecture.

### Implemented domains

- [x] [Authentication Domain API](./docs/6_0-authentication.api.md)
- [ ] Data Synchronization Domain API
- [ ] System Monitoring Domain API

#### ⬇️ Consumes:

- [`📇 SystemDB`](https://github.com/AstroBookings/.github/blob/main/profile/3-implementation/5_0-system.schema.md): For user authentication and system logs
- [`📇 OperationsDB`](https://github.com/AstroBookings/.github/blob/main/profile/3-implementation/5_1-operations.schema.md): For system-wide operational data
- [`📇 CacheDB`](https://github.com/AstroBookings/.github/blob/main/profile/3-implementation/5_2-cache.schema.md): For quick access to frequently used data

#### ⬆️ Provides for:

- All Web Applications: Authentication and authorization services
- Other APIs: Central authentication and system management services

## 📚 Repository Instructions

To **run** the project, follow these steps:

```shell
# clone the project
git clone https://github.com/AstroBookings/system_api.git
cd system_api
# install the dependencies
npm install
# run the project
npm run start
# open at http://localhost:3000/authentication/test
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

---

## [🚀 AstroBookings](https://github.com/AstroBookings)

> [!NOTE]
>
> > _[Alberto Basalo](https://github.com/albertobasalo)_ >> _Elevating Code Quality._
