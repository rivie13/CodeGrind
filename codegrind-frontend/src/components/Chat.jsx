import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useChat } from '../hooks/useChat';

const Chat = () => {
    const { messages, isLoading, sendMessage } = useChat();
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        
        await sendMessage(inputMessage);
        setInputMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box h="100%" display="flex" flexDirection="column">
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
                        bg={msg.role === 'user' ? 'blue.500' : 'gray.700'}
                        color="white"
                        px={4}
                        py={2}
                        borderRadius="lg"
                        maxW="80%"
                    >
                        <Text>{msg.content}</Text>
                    </Box>
                ))}
                {isLoading && (
                    <Box 
                        alignSelf="flex-start"
                        bg="gray.700"
                        color="white"
                        px={4}
                        py={2}
                        borderRadius="lg"
                    >
                        <Text>Thinking...</Text>
                    </Box>
                )}
            </VStack>
            
            <Flex p={4} borderTop="1px" borderColor="gray.600">
                <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    mr={2}
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                />
                <Button 
                    colorScheme="green"
                    onClick={handleSendMessage}
                    isLoading={isLoading}
                >
                    Send
                </Button>
            </Flex>
        </Box>
    );
};

export default Chat; 