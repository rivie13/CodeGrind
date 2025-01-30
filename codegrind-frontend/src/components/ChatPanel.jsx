import { useState } from 'react';

function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      content: "Hello! I'm your AI assistant. Need help with this problem?",
      isAi: true
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { content: input, isAi: false }]);
    setInput('');
    // TODO: Implement AI response logic
  };

  return (
    <div className="panel chat-panel">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.isAi ? 'ai' : 'user'}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button className="primary-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
