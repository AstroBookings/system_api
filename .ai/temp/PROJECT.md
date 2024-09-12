# NotifyAPI Project Documentation

> NotifyAPI is part of the AstroBookings project, responsible for managing the notification system for the entire platform.

## System Architecture

NotifyAPI is built with NestJS and TypeScript, leveraging NestJS's powerful module system for organized code structure. It handles email notifications for various events such as booking confirmations, launch updates, and system alerts.

### Tech Stack

- [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient and scalable server-side applications.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
- [MikroORM](https://mikro-orm.io/): TypeScript ORM for Node.js based on Data Mapper, Unit of Work and Identity Map patterns.
- [PostgreSQL](https://www.postgresql.org/): Open source object-relational database system.

### Consumes

- **SystemAPI**: For authentication and monitoring.
- **OperationsDB**: To store notification queues and user communication preferences.
- **EmailSvc**: To send out email notifications.

### Provides

- Notification sending capabilities for other APIs in the AstroBookings ecosystem.

## Project Structure

The project follows a modular structure as recommended by NestJS:

### Main Modules

#### API Module

The `api` folder contains the main business logic of the application:

- `notification`: Handles the creation, queuing, and sending of notifications.

#### Core Module

The `core` folder contains middleware and filters:

- `all-exceptions.filter.ts`: Global exception handler.
- `logger.middleware.ts`: Logging middleware.

#### Shared Module

The `shared` folder contains services shared across the application:

- `id.service.ts`: Generates unique IDs for entities.

## Development

- **Install dependencies**: `npm install`
- **Run the app**: `npm run start`
- **Run in development mode**: `npm run start:dev`
- **Run tests**: `npm run test`
- **Run e2e tests**: `npm run test:e2e`

## API Endpoints

The main API endpoints for the Notification domain are:

- `POST /api/notification/event`: Save a notification event

## Data Model

### Notification Entity

Represents messages sent to system users about various events:

- `id`: string (Primary Key)
- `template`: TemplateEntity (Many-to-One relationship)
- `agency`: AgencyEntity (Many-to-One relationship)
- `launch`: LaunchEntity (Many-to-One relationship)
- `traveler`: TravelerEntity (Many-to-One relationship)
- `booking`: BookingEntity (Many-to-One relationship)
- `invoice`: InvoiceEntity (Many-to-One relationship)
- `recipientEmail`: string
- `subject`: string
- `message`: string
- `timestamp`: Date
- `status`: NotificationStatus

### Template Entity

Represents notification templates:

- `id`: string (Primary Key)
- `name`: string
- `subject`: string
- `message`: string
- `notifications`: NotificationEntity[] (One-to-Many relationship)

The project uses MikroORM with PostgreSQL for data persistence, ensuring efficient and reliable storage of notification-related data.
