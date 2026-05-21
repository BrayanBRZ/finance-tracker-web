export class AppError extends Error {
    constructor (message, statusCode, field = null)  {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.field = field; 
    }
}