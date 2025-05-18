export class BadRequestError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode = 400, details?: any) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
