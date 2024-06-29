const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Middleware untuk menulis pesan ke dalam file JSON
async function writeMessageToFile(message) {
    try {
        const data = await fs.readFile('datapesan.json', 'utf8');
        const messages = JSON.parse(data).messages;
        messages.push({ id: messages.length + 1, message: message });
        await fs.writeFile('datapesan.json', JSON.stringify({ messages: messages }, null, 2));
    } catch (error) {
        console.error('Error writing message to file:', error);
        throw error;
    }
}

// Middleware untuk membaca pesan dari file JSON berdasarkan password
async function readMessageFromFile(password) {
    try {
        const data = await fs.readFile('datapesan.json', 'utf8');
        const messages = JSON.parse(data).messages;
        const message = messages.find(msg => msg.id === Number(password));
        return message ? message.message : null;
    } catch (error) {
        console.error('Error reading message from file:', error);
        throw error;
    }
}

// Middleware untuk mengedit pesan anonymous berdasarkan id
async function editMessageFromFile(id, newMessage) {
    try {
        const data = await fs.readFile('datapesan.json', 'utf8');
        let messages = JSON.parse(data).messages;
        const index = messages.findIndex(msg => msg.id === id);
        if (index !== -1) {
            messages[index].message = newMessage;
            await fs.writeFile('datapesan.json', JSON.stringify({ messages: messages }, null, 2));
        } else {
            throw new Error('Message not found');
        }
    } catch (error) {
        console.error('Error editing message:', error);
        throw error;
    }
}

// API endpoint untuk mengirim pesan baru
app.post('/pesan/send-message', async (req, res) => {
    const message = req.body.message;
    try {
        await writeMessageToFile(message);
        res.status(200).json({ message: 'Pesan berhasil disimpan.' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengirim pesan.' });
    }
});

// API endpoint untuk membuka pesan berdasarkan password
app.get('/pesan/open-message', async (req, res) => {
    const password = req.query.password;
    try {
        const message = await readMessageFromFile(password);
        if (message) {
            res.status(200).json({ message: message });
        } else {
            res.status(404).json({ error: 'Pesan tidak ditemukan.' });
        }
    } catch (error) {
        console.error('Error opening message:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat membuka pesan.' });
    }
});

// API endpoint untuk mengedit pesan anonymous berdasarkan id
app.post('/pesan/edit-message', async (req, res) => {
    const newMessage = req.body.newMessage;
    const id = 1; // Anda bisa mengatur id sesuai dengan logika aplikasi Anda
    try {
        await editMessageFromFile(id, newMessage);
        res.status(200).json({ message: 'Pesan berhasil diubah.' });
    } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengubah pesan.' });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
