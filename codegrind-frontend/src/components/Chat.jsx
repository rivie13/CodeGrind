import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message to chat
        const userMessage = {
            role: 'user',
            content: inputMessage
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            // Send message to AI server
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            
            // Add AI response to chat
            const aiMessage = {
                role: 'assistant',
                content: data.response
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            // Add error message to chat
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box h="100%" p={4}>
            <VStack 
                flex="1" 
                overflowY="auto" 
                spacing={4} 
                p={4} 
                alignItems="stretch"
            >
                {messages.map((msg, index) => (
                    <Box 
                        key={index}
                        alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                        bg={msg.role === 'user' ? 'blue.500' : 'gray.100'}
                        color={msg.role === 'user' ? 'white' : 'black'}
                        px={4}
                        py={2}
                        borderRadius="lg"
                        maxW="80%"
                    >
                        <Text>{msg.content}</Text>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </VStack>
            
            <Flex p={4} borderTop="1px" borderColor="gray.200">
                <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    mr={2}
                />
                <Button 
                    colorScheme="blue" 
                    onClick={handleSendMessage}
                >
                    Send
                </Button>
            </Flex>
        </Box>
    );
};

export default Chat; 