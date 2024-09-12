# System API Documentation

> The _System API_ purpose is to provide a robust and scalable API for managing system resources and handling authentication and authorization.

## Project Architecture

### Tech Stack

- [NestJS](https://nestjs.com/) : A progressive Node.js framework for building efficient and scalable server-side applications.
- [TypeORM](https://typeorm.io/) : A TypeScript ORM for Node.js that supports various databases.
- [PostgreSQL](https://www.postgresql.org/) : A powerful, open-source object-relational database system.
- [JWT](https://jwt.io/) : A token-based authentication mechanism for secure authentication.
- [Passport](http://www.passportjs.org/) : An authentication middleware for Node.js.

### Consumes

- **System Resources**: For managing system resources such as users, roles, and permissions.

### Provides

- **Authentication**: Provides authentication services using JWT and Passport.
- **Authorization**: Provides authorization services based on user roles and permissions.

### Workflow

- Install dependencies: `npm install`
- Run the app: `npm start`
- Test the app: `npm test`

## Project Structure

### Core Module

> The `Core Module` purpose is to handle global configurations, error handling, and authentication.

#### API endpoints (if any)

- `POST /api/auth/login` : Authenticates a user and returns a JWT token.
- `POST /api/auth/register` : Registers a new user.

#### Main artifacts

- [app.module.ts](../src/core/app.module.ts) : The main application module.
- [auth.controller.ts](../src/core/auth/auth.controller.ts) : Handles authentication and registration.
- [auth.service.ts](../src/core/auth/auth.service.ts) : Provides authentication and registration services.
- [jwt.strategy.ts](../src/core/auth/jwt.strategy.ts) : Implements JWT authentication strategy.
- [user.entity.ts](../src/core/auth/user.entity.ts) : Defines the user entity.

### API Modules

#### User Module

> The `User Module` purpose is to manage user resources.

#### API endpoints (if any)

- `GET /api/users` : Retrieves a list of users.
- `GET /api/users/:id` : Retrieves a user by ID.
- `POST /api/users` : Creates a new user.
- `PUT /api/users/:id` : Updates a user.
- `DELETE /api/users/:id` : Deletes a user.

#### Main artifacts

- [user.module.ts](../src/api/user/user.module.ts) : The user module.
- [user.controller.ts](../src/api/user/user.controller.ts) : Handles user operations.
- [user.service.ts](../src/api/user/user.service.ts) : Provides user services.
- [user.entity.ts](../src/api/user/user.entity.ts) : Defines the user entity.

### Shared Module

> The `Shared Module` purpose is to provide shared services and utilities across the application.

#### Main artifacts

- [id.service.ts](../src/shared/id.service.ts) : Generates unique IDs.
- [utils.util.ts](../src/shared/utils/utils.util.ts) : Provides utility functions.

## Conclusion

The _System API_ is designed to provide a robust and scalable API for managing system resources and handling authentication and authorization. It leverages NestJS, TypeORM, PostgreSQL, JWT, and Passport to ensure a secure and efficient system.
