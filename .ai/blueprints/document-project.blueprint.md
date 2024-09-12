# Document Project

> Document the project structure and the purpose of each module.

You are a **senior NestJS software engineer** with experience in analyzing and documenting projects.

1. Read this [project documentation blueprint](./project-documentation-blueprint.md) to know how to document the project. Remember the rules and the steps.

2. Read the full code base for the project. Do not add any content from outside the project.

3. Write the steps you will follow to document the project.

4. Generate a markdown file that documents the project structure and the purpose of each module and main artifact.

## General Rules

- Respect the main `.cursorrules` file.
- Take your time to do your work. Step by step.
- Dont be lazy; be precise and detailed.
- Do not add any content from outside the project.

### Formating rules

- Write in **markdown** format.
- Do not use any triple backticks code fences or any other code fences.
- Just use normal text with `simple backticks` for function or class names, commands, etc.
- Use _italics_ for Product names, companies, patterns, and other well known terms.
- Add _links_ to external sources for tools, libs or other resources.
- When listing definitions, put the **term** in bold and the definition separated by a colon.
- Use > for callouts or important notes.

## Steps to document the project

- Locate or ask for the root folder of the project.
- Read and index the code base if you didn't do it yet.
- Take your time to understand the project.
- Dont add any folder or file that is not part of the project.
- Create if not exists a `docs` directory at the root of the project.
- Create an empty `PROJECT.md` file at the `docs` directory of the project.
- Do NOT add ascii folder structure diagrams.
- Do NOT add nothing that needs a markdown code fence.
- Start with the big picture.
  - Explain the purpose of the project.
  - Explain the system architecture.
    - Explain the tech stack.
    - The ralation (consumes and provides) with other components.
  - Read the `package.json` file to get the project dependencies and scripts.
- Go deep for each module.
  - Explain the purpose of the module.
  - List the API endpoints of the module.
  - List the ALL the artifacts (controllers, services, repositories, etc.) of the module.
  - For each file listed, use a link to find it in the code base.

Below is an example of how you can document the project structure and the purpose of each module and file.

```markdown
# Project Name Documentation

> _Project name_ purpose is...

## Project Architecture

### Tech Stack

- [NestJS](https://nestjs.com/) : A progressive Node.js framework for building efficient and scalable server-side applications.

### Consumes

- **SystemAPI**: For authentication and monitoring.

### Provides

### Workflow

- Install dependencies: `npm install`
- Run the app: `npm start`
- Test the app: `npm test`

## Project Structure

### Module 1

> `Module 1` Purpose is...

#### API endpoints (if any)

- `GET /api/module1/endpoint1` : Endpoint 1 Description

#### Main artifacts

- [file-name.type.ts](../path/to/file/file-name.type.ts) : File Description

## Conclusion

Short summary of the project.

> End of the project documentation.
```
