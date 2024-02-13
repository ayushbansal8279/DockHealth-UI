const fs = require('fs');
const path = require('path');

const generatedDirectory = './src/app/types/swagger'; // Adjust the path based on your generated code location

const removeImportStatement = (filePath, statement) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const modifiedContent = fileContent.replace(statement, '');
  fs.writeFileSync(filePath, modifiedContent, 'utf8');
};

const processFiles = (dir) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processFiles(filePath);
    } else if (filePath.endsWith('.ts')) {
      // Adjust the import statement based on your actual import
      removeImportStatement(
        filePath,
        "import { HttpFile } from '../http/http';",
      );
    }
  });
};

processFiles(generatedDirectory);
