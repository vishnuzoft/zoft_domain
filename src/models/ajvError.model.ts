export interface AjvError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: { limit: number };
  message: string;
}
