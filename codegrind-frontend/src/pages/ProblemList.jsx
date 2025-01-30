import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MotionBox = motion(Box);

function ProblemList() {
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['problems', difficulty],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/api/problems${difficulty ? `?difficulty=${difficulty}` : ''}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  if (isLoading) return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
      <Text fontSize="xl" color="cyan.400">Loading problems...</Text>
    </Box>
  );
  
  if (error) return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
      <Text fontSize="xl" color="red.400">Error loading problems: {error.message}</Text>
    </Box>
  );

  const problems = data?.questions || [];
  const totalPages = Math.ceil(problems.length / perPage);
  const currentProblems = problems.slice((page - 1) * perPage, page * perPage);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <Box 
      minH="100vh" 
      bg="#1a1a1a" 
      py={8}
      position="relative"
      overflow="hidden"
    >
      {/* Background Grid Animation */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgImage="radial-gradient(#00ff0033 1px, transparent 1px)"
        bgSize="50px 50px"
        opacity="0.2"
        animation="scroll 20s linear infinite"
        sx={{
          "@keyframes scroll": {
            "0%": { transform: "translateY(0)" },
            "100%": { transform: "translateY(50px)" }
          }
        }}
        zIndex="1"
      />

      <Container maxW="container.xl" position="relative" zIndex="2">
        <VStack spacing={8}>
          <Heading 
            size="2xl" 
            bgGradient="linear(to-r, #00ff00, #00ccff)"
            bgClip="text"
            fontFamily="'Orbitron', sans-serif"
          >
            LeetCode Problems
          </Heading>

          <HStack spacing={4} w="full" justifyContent="center">
            <Select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              w="200px"
              bg="#2d2d2d"
              borderColor="#404040"
              color="white"
              _hover={{ borderColor: "cyan.400" }}
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </Select>

            <Select 
              value={perPage} 
              onChange={(e) => setPerPage(Number(e.target.value))}
              w="150px"
              bg="#2d2d2d"
              borderColor="#404040"
              color="white"
              _hover={{ borderColor: "cyan.400" }}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </Select>
          </HStack>

          <MotionBox
            variants={container}
            initial="hidden"
            animate="show"
            w="full"
          >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {currentProblems.map((problem, index) => (
                <MotionBox
                  key={problem.titleSlug}
                  variants={item}
                  as={Link}
                  to={`/problem/${problem.titleSlug}`}
                  bg="#2d2d2d"
                  p={6}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="#404040"
                  _hover={{
                    transform: "translateY(-4px)",
                    borderColor: "cyan.400",
                    boxShadow: "0 4px 12px rgba(0,255,255,0.1)"
                  }}
                  transition="all 0.2s"
                >
                  <VStack align="start" spacing={3}>
                    <Heading size="md" color="white">
                      {problem.title}
                    </Heading>
                    <Text color="gray.400">Problem #{problem.questionFrontendId}</Text>
                    <Badge
                      bg={
                        problem.difficulty === 'Easy' ? '#38A169' :  // green
                        problem.difficulty === 'Medium' ? '#D69E2E' : // yellow
                        problem.difficulty === 'Hard' ? '#E53E3E' : // red
                        '#38A169' // fallback green
                      }
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {problem.difficulty}
                    </Badge>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>

          <HStack spacing={4}>
            <Button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              colorScheme="cyan"
              variant="outline"
              _hover={{ bg: "cyan.900" }}
            >
              Previous
            </Button>
            <Text color="white">
              Page {page} of {totalPages}
            </Text>
            <Button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              colorScheme="cyan"
              variant="outline"
              _hover={{ bg: "cyan.900" }}
            >
              Next
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

export default ProblemList;
