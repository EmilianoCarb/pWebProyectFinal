import db from '../lib/db.js';

export const getAllClients = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, email, role FROM users WHERE role = 'client'"
        );
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener clientes', error: error.message });
    }
};