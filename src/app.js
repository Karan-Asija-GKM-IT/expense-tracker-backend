import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import categoryRoutes from './routes/category.route.js';
import transactionRoutes from './routes/transaction.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import exportRoutes from './routes/export.route.js';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();

app.use(cors({
    origin: [process.env.CLIENT_URL,'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);

app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})
 export default app;

