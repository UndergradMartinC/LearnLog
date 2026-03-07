export class HttpError extends Error {
  statusCode: number
  constructor(statusCode: number, message?: string) {
    super(message ?? 'Error')
    this.name = 'HttpError'
    this.statusCode = statusCode
    Error.captureStackTrace?.(this, HttpError)
  }
}

export const Unauthorized = (msg = 'Unauthorized') => new HttpError(401, msg)
export const Forbidden = (msg = 'Forbidden') => new HttpError(403, msg)