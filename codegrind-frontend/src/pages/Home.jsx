import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// First, install framer-motion if you haven't:
// npm install framer-motion
// npm install @emotion/react

const Home = () => {
  const glitchAnimation = keyframes`
    0% {
      text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                   0.025em 0.04em 0 #fffc00;
    }
    15% {
      text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                   0.025em 0.04em 0 #fffc00;
    }
    16% {
      text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                   -0.05em -0.05em 0 #fffc00;
    }
    49% {
      text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                   -0.05em -0.05em 0 #fffc00;
    }
    50% {
      text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                   0 -0.04em 0 #fffc00;
    }
    99% {
      text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                   0 -0.04em 0 #fffc00;
    }
    100% {
      text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
                   -0.04em -0.025em 0 #fffc00;
    }
  `;

  const MotionBox = motion(Box);

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#1a1a1a"
      overflow="hidden"
      position="relative"
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
        opacity="0.5"
        animation="scroll 20s linear infinite"
        sx={{
          "@keyframes scroll": {
            "0%": { transform: "translateY(0)" },
            "100%": { transform: "translateY(50px)" }
          }
        }}
      />

      <VStack spacing={8} zIndex="1">
        {/* Animated Title */}
        <MotionBox
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <Text
            fontSize="7xl"
            fontWeight="bold"
            bgGradient="linear(to-r, #00ff00, #00ccff)"
            bgClip="text"
            animation={`${glitchAnimation} 2s infinite`}
            textAlign="center"
            fontFamily="'Orbitron', sans-serif"
          >
            CodeGrind
          </Text>
        </MotionBox>

        {/* Animated Subtitle */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Text
            fontSize="xl"
            color="gray.300"
            textAlign="center"
            maxW="600px"
            mb={8}
          >
            Master Data Structures and Algorithms through interactive practice
          </Text>
        </MotionBox>

        {/* Animated Button */}
        <MotionBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <Link to="/problems">
            <Button
              size="lg"
              bgGradient="linear(to-r, green.400, cyan.400)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, green.500, cyan.500)",
                transform: "scale(1.05)"
              }}
              transition="all 0.2s"
            >
              Start Practicing
            </Button>
          </Link>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default Home;
