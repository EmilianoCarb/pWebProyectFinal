import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import db from '../lib/db.js';
import userMiddleware from '../middleware/users.js';

export const register = async (req, res) => {
    const {email, password} = req.body;
    try 
    {
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) 
            {
            return res.status(409).json({message: 'Este email ya está en uso'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();
        await db.query(
            'INSERT INTO users (id, email, password, role) VALUES (?,?,?,?)',
            [id,email, hashedPassword, 'client']
        );
        return res.status(201).json({ message: '¡Usuario registrado con éxito!' });
    }
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }};

export const login = async (req, res) => {

    const {email, password} = req.body;
    try
    {   
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?', [email])
            if(users.length === 0)
            {
            return res.status(401).json({message:'Usuario o contraseña incorrectos' });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        const token = jwt.sign(
            { userId: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        return res.status(200).json({
            message: '¡Bienvenido!',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
        
    } 
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }};