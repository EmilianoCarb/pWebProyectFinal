import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/db.js';

const seedAdmin = async () => {
    const [existing] = await db.query("SELECT id FROM users WHERE email = 'admin@tienda.com'");
    if (existing.length > 0) return;

    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const id = uuidv4();
    await db.query(
        'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
        [id, 'admin@tienda.com', hashedPassword, 'admin']
    );
    console.log('Admin creado: admin@tienda.com / admin1234');
};
const seedProducts = async () => {
    const [existing] = await db.query("SELECT id FROM products");
    if (existing.length > 0) return;

    const products = [
        { name: 'Remera básica', description: 'Remera de algodón 100%', price: 2500, stock: 100 },
        { name: 'Pantalón jean', description: 'Jean slim fit azul', price: 8900, stock: 50 },
        { name: 'Zapatillas deportivas', description: 'Suela reforzada, talle 36-45', price: 15000, stock: 30 },
        { name: 'Campera de abrigo', description: 'Resistente al agua, varios colores', price: 22000, stock: 20 },
        { name: 'Gorra', description: 'Gorra con visera ajustable', price: 3500, stock: 75 },
        { name: 'Medias deportivas', description: 'Pack x3 pares', price: 1800, stock: 200 },
        { name: 'Bermuda', description: 'Bermuda de tela liviana', price: 5500, stock: 60 },
        { name: 'Buzo con capucha', description: 'Algodón y poliéster, frisa por dentro', price: 12000, stock: 40 },
    ];

    for (const p of products) {
        const id = uuidv4();
        await db.query(
            'INSERT INTO products (id, name, description, price, stock) VALUES (?, ?, ?, ?, ?)',
            [id, p.name, p.description, p.price, p.stock]
        );
    }
    console.log('Productos de ejemplo creados');
};

export default async () => {
    await seedAdmin();
    await seedProducts();
};