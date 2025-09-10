"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const types_1 = require("../types");
const schemas_1 = require("../validations/schemas");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/auth/register
router.post('/register', (0, validation_1.validateBody)(schemas_1.userCreateSchema), async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = await database_1.pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }
        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // Create user
        const result = await database_1.pool.query(`INSERT INTO users (username, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, role, created_at`, [username, email, hashedPassword, types_1.UserRole.USER]);
        const user = result.rows[0];
        // Generate JWT token
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const token = jsonwebtoken_1.default.sign(payload, secret);
        const response = {
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at,
                    updated_at: user.created_at
                },
                token
            },
            message: 'User registered successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
});
// POST /api/auth/login
router.post('/login', (0, validation_1.validateBody)(schemas_1.loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find user
        const result = await database_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const user = result.rows[0];
        // Verify password
        const isValidPassword = await bcrypt_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Generate JWT token
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const token = jsonwebtoken_1.default.sign(payload, secret);
        const response = {
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                },
                token
            },
            message: 'Login successful'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// POST /api/auth/logout
router.post('/logout', (req, res) => {
    // Since we're using JWT tokens, logout is handled client-side
    // The client should remove the token from storage
    const response = {
        success: true,
        data: null,
        message: 'Logout successful'
    };
    res.json(response);
});
// GET /api/auth/me
router.get('/me', auth_1.authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await database_1.pool.query('SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const user = result.rows[0];
        const response = {
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// GET /api/auth/me - Get current user info
router.get('/me', auth_1.authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await database_1.pool.query('SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        const user = result.rows[0];
        const response = {
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
