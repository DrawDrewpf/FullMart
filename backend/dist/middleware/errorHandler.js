"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Error interno del servidor';
    // Operational errors
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Database errors
    if (error.message.includes('duplicate key')) {
        statusCode = 409;
        message = 'El recurso ya existe';
    }
    if (error.message.includes('foreign key')) {
        statusCode = 400;
        message = 'Referencia inválida';
    }
    // Log error for debugging
    console.error(`Error ${statusCode}: ${message}`, {
        stack: error.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        user: req.user?.id,
    });
    const response = {
        message,
        statusCode,
    };
    // Don't leak error details in production
    if (process.env.NODE_ENV === 'development') {
        response.errors = [error.stack];
    }
    res.status(statusCode).json({
        success: false,
        error: response,
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.path}`,
    });
};
exports.notFoundHandler = notFoundHandler;
// Async error handler wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
