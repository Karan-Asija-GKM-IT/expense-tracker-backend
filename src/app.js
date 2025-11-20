import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser);

app.use('/api/auth',authRoutes);

app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})
 export default app;

