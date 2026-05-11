import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
//import productRoutes from './routes/products.routes.js';
//import orderRoutes from './routes/orders.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);       
//app.use('/products', productRoutes);
//app.use('/orders', orderRoutes);    

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));