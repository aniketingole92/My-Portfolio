const ws = new WebSocket('ws://localhost:8080');
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Function to append messages to chatbox
const appendMessage = (message, className) => {
    const div = document.createElement('div');
    div.textContent = message;
    div.className = `message ${className}`;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
};

// Send message to WebSocket
sendBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        appendMessage(`You: ${message}`, 'user');
        ws.send(message);
        userInput.value = '';
    }
});

// Receive message from WebSocket
ws.onmessage = (event) => {
    const message = event.data;
    appendMessage(`ChatGPT: ${message}`, 'bot');
};
