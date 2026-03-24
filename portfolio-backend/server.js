const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ success: true, message: 'Saved in MongoDB' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Error saving contact.' });
    }
});

app.get('/', (req, res) => res.send('Backend is running!'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Backend server running on', PORT));
