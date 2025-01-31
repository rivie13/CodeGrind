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
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
  };

  return (
    <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {!isLogin && (
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="cyan" width="full">
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Text
            cursor="pointer"
            color="cyan.500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </Text>
        </VStack>
      </form>
    </Box>
  );
} 