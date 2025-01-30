class AIChatHandler {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-message');
        
        // Bind event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Clear input
        this.chatInput.value = '';

        // Add user message to chat
        this.addMessageToChat('user', message);

        try {
            // Show loading state
            this.addMessageToChat('assistant', 'Thinking...');

            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            
            // Remove loading message
            this.chatMessages.removeChild(this.chatMessages.lastChild);
            
            // Add AI response
            this.addMessageToChat('assistant', data.response);

        } catch (error) {
            console.error('Chat error:', error);
            // Remove loading message
            this.chatMessages.removeChild(this.chatMessages.lastChild);
            this.addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
        }
    }

    addMessageToChat(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.formatMessage(content)}
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    formatMessage(content) {
        // Basic message formatting (you can enhance this)
        return content.replace(/\n/g, '<br>');
    }
}

// Initialize chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIChatHandler();
}); 