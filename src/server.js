import express from 'express'
const app = express();
app.use(express.json());


app.get('/', (req,res) => {
    res.send('Personal Expense Tracker System')
})

const port = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Listening on port ${port}...`);
})