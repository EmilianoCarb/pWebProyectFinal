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
    { name: 'Playera básica', description: 'Playera de algodón 100%, varios colores', price: 199, stock: 100 },
    { name: 'Pantalón de mezclilla', description: 'Mezclilla slim fit, azul clásico', price: 699, stock: 50 },
    { name: 'Tenis deportivos', description: 'Suela reforzada, tallas 24-30', price: 1299, stock: 30 },
    { name: 'Chamarra ligera', description: 'Resistente al viento, varios colores', price: 1599, stock: 25 },
    { name: 'Gorra bordada', description: 'Gorra con visera curva ajustable', price: 249, stock: 80 },
    { name: 'Calcetines deportivos', description: 'Pack de 3 pares, algodón con elastán', price: 149, stock: 200 },
    { name: 'Bermuda cargo', description: 'Tela ligera con bolsillos laterales', price: 449, stock: 60 },
    { name: 'Sudadera con capucha', description: 'Algodón y poliéster, interior afelpado', price: 899, stock: 40 },
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