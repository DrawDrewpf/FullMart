"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const schemas_1 = require("../validations/schemas");
const router = (0, express_1.Router)();
// Get user profile
router.get('/profile', auth_1.authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Get user data
        const userResult = await database_1.pool.query('SELECT id, email, name, phone, created_at FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
        // Get user addresses
        const addressesResult = await database_1.pool.query('SELECT id, street, city, state, zip_code as "zipCode", country, is_default as "isDefault" FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC', [userId]);
        const userData = {
            ...userResult.rows[0],
            addresses: addressesResult.rows
        };
        res.json({
            success: true,
            data: userData
        });
    }
    catch (error) {
        next(error);
    }
});
// Update user profile
router.put('/profile', auth_1.authenticateToken, (0, validation_1.validateBody)(schemas_1.userProfileSchema), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, email, phone } = req.body;
        // Check if email is already taken by another user
        const emailCheckResult = await database_1.pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Este email ya está en uso por otro usuario'
            });
        }
        // Update user data
        const updateResult = await database_1.pool.query('UPDATE users SET name = $1, email = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, name, phone, created_at', [name, email, phone || null, userId]);
        if (updateResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
        // Get updated addresses
        const addressesResult = await database_1.pool.query('SELECT id, street, city, state, zip_code as "zipCode", country, is_default as "isDefault" FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC', [userId]);
        const userData = {
            ...updateResult.rows[0],
            addresses: addressesResult.rows
        };
        res.json({
            success: true,
            data: userData
        });
    }
    catch (error) {
        next(error);
    }
});
// Change password
router.put('/change-password', auth_1.authenticateToken, (0, validation_1.validateBody)(schemas_1.changePasswordSchema), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        // Get current password hash
        const userResult = await database_1.pool.query('SELECT password FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
        // Verify current password
        const isValidPassword = await bcrypt_1.default.compare(currentPassword, userResult.rows[0].password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                error: 'La contraseña actual es incorrecta'
            });
        }
        // Hash new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, saltRounds);
        // Update password
        await database_1.pool.query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedNewPassword, userId]);
        res.json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        });
    }
    catch (error) {
        next(error);
    }
});
// Add address
router.post('/addresses', auth_1.authenticateToken, (0, validation_1.validateBody)(schemas_1.addressCreateSchema), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { street, city, state, zipCode, country, isDefault } = req.body;
        // If this is set as default, unset other default addresses
        if (isDefault) {
            await database_1.pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
        }
        // Insert new address
        const result = await database_1.pool.query('INSERT INTO addresses (user_id, street, city, state, zip_code, country, is_default) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, street, city, state, zip_code as "zipCode", country, is_default as "isDefault"', [userId, street, city, state, zipCode, country, isDefault || false]);
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    }
    catch (error) {
        next(error);
    }
});
// Update address
router.put('/addresses/:id', auth_1.authenticateToken, (0, validation_1.validateBody)(schemas_1.addressCreateSchema), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const { street, city, state, zipCode, country, isDefault } = req.body;
        // Verify address belongs to user
        const checkResult = await database_1.pool.query('SELECT id FROM addresses WHERE id = $1 AND user_id = $2', [addressId, userId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Dirección no encontrada'
            });
        }
        // If this is set as default, unset other default addresses
        if (isDefault) {
            await database_1.pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2', [userId, addressId]);
        }
        // Update address
        const result = await database_1.pool.query('UPDATE addresses SET street = $1, city = $2, state = $3, zip_code = $4, country = $5, is_default = $6 WHERE id = $7 AND user_id = $8 RETURNING id, street, city, state, zip_code as "zipCode", country, is_default as "isDefault"', [street, city, state, zipCode, country, isDefault || false, addressId, userId]);
        res.json({
            success: true,
            data: result.rows[0]
        });
    }
    catch (error) {
        next(error);
    }
});
// Delete address
router.delete('/addresses/:id', auth_1.authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        // Verify address belongs to user
        const checkResult = await database_1.pool.query('SELECT id FROM addresses WHERE id = $1 AND user_id = $2', [addressId, userId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Dirección no encontrada'
            });
        }
        // Delete address
        await database_1.pool.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [addressId, userId]);
        res.json({
            success: true,
            message: 'Dirección eliminada correctamente'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
