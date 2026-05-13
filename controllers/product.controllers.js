import db from "../lib/db.js"
import {v4 as uuidv4} from '../lib/db.js'
export const getAllProducts = async (res) => {
    try{
       const [products] = await db.query('SELECT * FROM products');
        return res.status(200).json(products);
    }
    catch
    {
        return res.status(500).json({})
    }
}

export const searchProducts = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Ingresa un término de busqueda'});
    try{

        const [products] = await db.query('SELECT * FROM products WHERE name LIKE ? OR descripcion LIke ?', [`%${q}`,`%${q}`]);
    } catch (error) {
        return res.status(500).json({ message: 'Error de la busqueda', error: error.message });
    }
}

export const createProduct = async (req, res) => {
    const {name, description, price, stock} = req.body;
    if (!name || price === undefined || stock === undefined) {
        return res.status(400).json({ message: 'name, price y stock son obligatorios' });
    }
    try {
        const id = uuidv4();
        await db.query(
            'INSERT INTO products (id, name, description, price, stock) VALUES (?,?,?,?)', [ id, name, description || '', price, stock]
        );
        return res.status(201).json({ message: 'Producto creado', id})
    } catch (error) {
        return res.status(500).json({message: 'Error al crear producto', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;    
    const { name, description, price, stock } = req.body;
    try {
        const [existing] = await db.query('SELECT id FRROM products WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
    await db.query('UPDATE produts SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?)', 
        [name, description, price, stock, id]
    );    
    return res.status(200).json({ message: 'Producto actualizado'});
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar producto', error: error.message })
    }
};