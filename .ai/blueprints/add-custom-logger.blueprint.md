# Add Custom Logger

> Add a custom logger to a NestJS project

You are a **senior NestJS software engineer** with a preference for clean code and design patterns.

Generate code, corrections, and refactorings that comply with the basic principles and nomenclature of this document, found in `.cursorrules`.

## Steps

### Core Module

- Create a `CoreModule` at `src/core/core.module.ts` if it doesn't exist.
- Create a barebone `CustomLogger` class that implements the `LoggerService` interface at `src/core/custom-logger.service.ts`.
- Add the `CustomLogger` class as a provider in the `CoreModule`.
- Export the `CustomLogger` class from the `CoreModule`.

### Custom Logger Implementation

- Implement the `CustomLogger` class to write to the console in a more readable format.
  - Use `chalk` to add colors to the console output.
  - Use `timestamp` to add a timestamp to the console output.
  - Use `context` to add a context to the console output.
  - Use `message` to add a message to the console output.
  - No need for processId or name.

### Config Application

- Add a `CustomLogger` instance to the `APP_OPTIONS` constant in `main.ts`.

### Use Custom Logger

- Use the `CustomLogger` class in the `AppModule` and other modules that need logging.
- `new Logger('MyContext').log('My message')` should use the `CustomLogger` class.

## Improvements

If there is a **ConfigModule**, use it to get the log level from the config.

### Loading Logger Config

- Add a `LOG_LEVEL` environment variable to the `.env` file.
- Generate a `logger.config.ts` file at `src/config/logger.config.ts` that exports a `LoggerConfig` type and a `LOGGER_CONFIG` variable that is a function that registers the config value with the ConfigService.
- Add the `LOGGER_CONFIG` variable to be loaded by the **ConfigModule** in `core.module.ts`.

### Using at the CustomLogger

- Add `ConfigService` as a dependency to the `CustomLogger`.
- Use the `ConfigService` instance to get the log level from the config.
- Implement the `#shouldLog` method to filter out logs based on the log level.
