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

Then, create a new file inside `src/app/types`, import the swagger generated type and export it again, use it in the codebase.

Example,

```ts
// src/app/types/Comment.ts
import { CommentDto as IComment } from './swagger/models/CommentDto';

export { IComment };

// src/app/types/Task.ts
import { IComment } from './Comment';
import { TaskDto } from './swagger/models/TaskDto';

export interface Task extends TaskDto {
  comments?: IComment[];
}


// inside other ts files
import { Task } from '@/app/types/Task'

const task: Task = { ... }
```

## Practice of Writing Code

### `@ts-ignore` is only when required

We should be careful using `@ts-ignore`. It's only when you cannot resolve tricky TS errors.
As long as it's related to simple TS error, something like `Parameter 'index' implicitly has an 'any' type.`, please define the type in `src/app/types`, import and use it to resolve this TS error.

### Comment

Use comment only for documentation/description purpose.

When need to comment certain code block while development, make sure that if it's good to be merged to `dev` branch.

- If so, add a comment before the commented code block with some descriptoin. e.g. `TODO: uncomment the following code block after DHWP-3000 is resolved`
- If not, remove it during self code review of the PR.

Please install the VSCode extension [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) and review its usecases `*, !, ?, TODO, @param` from the extension documentation.

### CleanUp of code

While writing code, if you see the commented code block that exists there for more than 3 months without adequate explanation, please ping the author to clarify and remove the code block.
Also if you add a new component and the old component is no longer in use, make sure it's not used anywhere and remove it.

### Define Component with TypeScript

Example:

```tsx
import React, { useState, ChangeEvent } from 'react';
import { Box, Button, Checkbox, TextField } from '@mui/material';

interface Props {
  text?: string;
  onTextChange: (v: string) => void;
  onClick: VoidFunction; // () => void;
}

export default function Example({ text = '', onTextChange, onClick }: Props) {
  const [checked, setChecked] = useState<boolean>(false);

  const handleCheckedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onTextChange(e.target.value);
  };

  return (
    <Box>
      <Checkbox checked={checked} onChange={handleCheckedChange} />
      <TextField value={text} onChange={handleChange} />
      <Button onClick={onClick}>Click Me</Button>
    </Box>
  );
}
```
