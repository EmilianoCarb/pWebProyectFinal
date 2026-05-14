import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import orderRoutes from './routes/orders.routes.js';
import adminRoutes from './routes/admin.routes.js';
import seed from './database/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(join(__dirname, 'public')));

seed();

app.use('/auth', authRoutes);       
app.use('/admin', adminRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);    

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT}`));