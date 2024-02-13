# heydoc-web

### Last updated: 26 Jan 2023

## How to run

- At the time of development given software versions were used:
  - Node version: 18.13.0
  - Npm version: 8.19.3
- Clone / download & extract repository
- Checkout to one of the branches if needed
- Acquire `.env` file filled with proper variables if not present in the main directory
- Use `npm install` to install all node_modules dependencies
- Use `npm run dev` to run application in development mode
- Use `npm start` to serve application
- Use `npm build` to build application for production

## Type Generation based on the swagger UI

[@openapitools/openapi-generator-cli](https://www.npmjs.com/package/@openapitools/openapi-generator-cli) is used for the quick type generation based on the Swagger UI.

Run the backend service on the local machine [reference](<https://dock-health.atlassian.net/wiki/spaces/DHP/pages/1158316033/Local+Environment+Setup#Compile-and-Run-heydoc-backend-Wildfly-Project-(Services)>) and run the following command to generate types into [src/app/types/swagger](./src/app/types/swagger/) directory.

```bash
npm run gen:types-swagger
```

This will only generate types based on the Swagger UI. The other types needed on the frontend side will be manually created in [./src/app/types](./src/app/types/) directory.

Then import and use the type in any ts files

```ts
import { TaskDto } from '@/app/types/swagger/models/TaskDto';

const task: TaskDto = {...}
```
