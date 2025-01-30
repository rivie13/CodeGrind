import { useState } from 'react';
import { sendChatMessage } from '../api/chat';

export function useChat() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your AI assistant. Need help with this problem?"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (message) => {
        if (!message.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        setIsLoading(true);

        try {
            // Check if AI server is running
            const response = await sendChatMessage(message);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            // Add AI response
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: response.response 
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            if (error.message === 'Failed to fetch') {
                errorMessage = 'Unable to connect to AI server. Please make sure it\'s running.';
            }
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        sendMessage
    };
}
