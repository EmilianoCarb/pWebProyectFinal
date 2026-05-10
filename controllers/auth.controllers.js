import db from '../lib/db.js';
import bcrypt, { hashSync } from 'bcryptjs';
import {v4 as uuidv4} from 'uuid'

export const register = async (req, res) => 
{
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
            'INSERT INTO users (id, email, password, role) VALUES (?,?,?,?',
            [id,email, hashedPassword, 'client']
        );
        return res.status(201).json({ message: '¡Usuario registrado con éxito!' });
    }
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};