import * as Ajv from "ajv";

import { AjvError } from "../models";
import { ajv } from "./compileSchema";
import { customError } from "./error";

type ErrorType = AjvError | Ajv.ErrorObject;

function getCustomErrorMessage(error: ErrorType | undefined): string {
  if (!error) {
    return "Validation failed: Unknown error";
  }
  let field = error.instancePath.split("/")[1];
  switch (error.keyword) {
    case "pattern":
      return `Invalid ${field} pattern. Please provide a valid ${field}`;
    case "format":
      return `Invalid ${field} format. Please provide a valid ${field}`;
    case "minLength":
      return ` Please provide at least ${error.params.limit} characters for ${field}`;
    // Add more cases as needed for other Ajv keywords
    default:
      return `Validation failed: ${error.message}`;
  }
}

export function validation(schemaId: string, data: any) {
  try {
    const validate = ajv.getSchema(schemaId);
    if (!validate) {
      throw new Error(`Schema with ID ${schemaId} not found.`);
    }
    const isValidate = validate(data);
    if (!isValidate) {
      const errorMessages = getCustomErrorMessage(validate.errors?.[0]);
      throw new customError("Invalid field", 400, errorMessages);
    }
    return true;
  } catch (error) {
    throw error;
  }
}
