export class customError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, result?: any) {
    super(message);
    this.status = status;
    this.details = result;
  }
}
