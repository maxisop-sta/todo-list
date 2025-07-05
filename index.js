const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const Task = require('./models/Task');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.render('index', { tasks });
});

app.post('/add', async (req, res) => {
    const { title, priority } = req.body;
    if (!title.trim()) return res.send(`<script>alert('Task cannot be empty'); window.location.href='/'</script>`);
    await Task.create({ title, priority });
    res.send(`<script>alert('Task added successfully'); window.location.href='/'</script>`);
});

app.post('/edit/:id', async (req, res) => {
    const { title, priority } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { title, priority });
    res.send(`<script>alert('Task updated successfully'); window.location.href='/'</script>`);
});

app.post('/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.send(`<script>alert('Task deleted successfully'); window.location.href='/'</script>`);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));