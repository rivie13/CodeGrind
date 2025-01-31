import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          ...(isLogin ? {} : { username })
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/problems';
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="gray.900">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {!isLogin && (
            <FormControl isRequired>
              <FormLabel color="green.400">Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="gray.800"
                borderColor="gray.600"
                _hover={{ borderColor: "green.400" }}
              />
            </FormControl>
          )}
          <FormControl isRequired>
            <FormLabel color="green.400">Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="gray.800"
              borderColor="gray.600"
              _hover={{ borderColor: "green.400" }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="green.400">Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="gray.800"
              borderColor="gray.600"
              _hover={{ borderColor: "green.400" }}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="green"
            width="full"
            mt={4}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Text
            cursor="pointer"
            color="cyan.400"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </Text>
        </VStack>
      </form>
    </Box>
  );
} 