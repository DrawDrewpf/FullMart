"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
            }
            next(error);
        }
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.query);
            req.query = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetros de consulta inválidos',
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
            }
            next(error);
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.params);
            req.params = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetros de ruta inválidos',
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
            }
            next(error);
        }
    };
};
exports.validateParams = validateParams;
