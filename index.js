require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Task model
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    status: { type: String, default: 'Pending' }
});
const Task = mongoose.model('Task', taskSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    const tasks = await Task.find({});
    res.render('index', { tasks: tasks });
});

app.post('/tasks', async (req, res) => {
    const newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    });
    await newTask.save();
    res.redirect('/');
});

app.post('/tasks/delete/:id', async (req, res) => {
    await Task.findByIdAndRemove(req.params.id);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
