import Ajv from 'ajv';
import AjvFormats from 'ajv-formats';
import * as glob from 'glob';
import * as path from 'path';

export const ajv = new Ajv();
AjvFormats(ajv);

export function compileSchema() {
  const compileValidators: { [key: string]: any } = {};
  const schemaFolderPath = path.join(__dirname, "../schema");
  const schemaFiles = glob.sync(`${schemaFolderPath}/*.json`);

  schemaFiles.forEach((schemaFile) => {
    const schemaName = path.basename(schemaFile, ".json");
    const schema = require(`../schema/${schemaName}.json`);

    // Compile the schema and store it in the validators object
    compileValidators[schemaName] = ajv.compile(schema);
  });

  return compileValidators;
}
