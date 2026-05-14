import { v4 as uuidv4 } from 'uuid';
import db from '../lib/db.js';

// GET /orders
export const getMyOrders = async (req, res) => {
    const userId = req.userData.userId;
    try {
        const [orders] = await db.query(
            `SELECT o.id, o.total, o.created_at,
                    JSON_ARRAYAGG(JSON_OBJECT(
                        'product_id', oi.product_id,
                        'name', p.name,
                        'quantity', oi.quantity,
                        'price_at_purchase', oi.price_at_purchase
                    )) AS items
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             JOIN products p ON oi.product_id = p.id
             WHERE o.user_id = ?
             GROUP BY o.id`,
            [userId]
        );
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
    }
};

// POST /orders
export const createOrder = async (req, res) => {
    const userId = req.userData.userId;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Debes enviar al menos un producto' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        let total = 0;
        const resolvedItems = [];

        for (const item of items) {
            const { product_id, quantity } = item;
            if (!product_id || !quantity || quantity < 1) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ message: 'Cada item debe tener product_id y quantity >= 1' });
            }

            const [rows] = await connection.query(
                'SELECT id, price, stock FROM products WHERE id = ?', [product_id]
            );
            if (rows.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(404).json({ message: `Producto ${product_id} no encontrado` });
            }

            const product = rows[0];
            if (product.stock < quantity) {
                await connection.rollback();
                connection.release();
                return res.status(409).json({ message: `Stock insuficiente para producto ${product_id}` });
            }

            total += product.price * quantity;
            resolvedItems.push({ product_id, quantity, price: product.price });
        }

        const orderId = uuidv4();
        await connection.query(
            'INSERT INTO orders (id, user_id, total) VALUES (?, ?, ?)',
            [orderId, userId, total]
        );

        for (const item of resolvedItems) {
            const itemId = uuidv4();
            await connection.query(
                'INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
                [itemId, orderId, item.product_id, item.quantity, item.price]
            );
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();
        connection.release();
        return res.status(201).json({ message: 'Pedido creado', orderId, total });

    } catch (error) {
        await connection.rollback();
        connection.release();
        return res.status(500).json({ message: 'Error al crear pedido', error: error.message });
    }
};