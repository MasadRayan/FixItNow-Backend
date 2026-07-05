// utils/AppError.ts
export class AppError extends Error {
  statusCode: number;
  errorDetails?: unknown;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}