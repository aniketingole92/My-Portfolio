const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const WebSocket = require('ws');

// OpenAI API Configuration
const configuration = new Configuration({
    apiKey: 'YOUR_OPENAI_API_KEY', // Replace with your OpenAI API Key
});
const openai = new OpenAIApi(configuration);

// Datastore
const conversations = [];

// Express App Setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// REST Endpoint for Testing
app.post('/chat', async (req, res) => {
    const { userMessage } = req.body;
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
    });

    const botMessage = response.data.choices[0].message.content;
    conversations.push({ userMessage, botMessage });
    res.json({ botMessage });
});

// WebSocket Server for Real-Time Communication
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        const userMessage = message.toString();
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        });

        const botMessage = response.data.choices[0].message.content;
        conversations.push({ userMessage, botMessage });
        ws.send(botMessage);
    });

    ws.on('close', () => console.log('Client disconnected'));
});

// Start Express Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
