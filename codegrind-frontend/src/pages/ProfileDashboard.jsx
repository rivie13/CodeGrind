import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Progress,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function ProfileDashboard() {
  // Mock data - replace with real data from your backend
  const userStats = {
    problemsSolved: 42,
    totalAttempts: 67,
    successRate: 63,
    streak: 7,
    rank: 1337,
    points: 2500
  };

  const recentActivity = [
    { id: 1, problem: "Two Sum", status: "Solved", date: "2024-03-10" },
    { id: 2, problem: "Valid Parentheses", status: "Attempted", date: "2024-03-09" },
    { id: 3, problem: "Merge Two Lists", status: "Solved", date: "2024-03-08" }
  ];

  return (
    <Box minH="100vh" bg="#1a1a1a" py={8}>
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
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid templateColumns="auto 1fr" gap={8} bg="#2d2d2d" p={6} borderRadius="lg">
              <Box w="150px" h="150px" borderRadius="full" bg="cyan.500" />
              <VStack align="start" spacing={4}>
                <Heading color="white">John Doe</Heading>
                <Text color="gray.400">@johndoe • Joined March 2024</Text>
                <Text color="#00ff00">Rank: {userStats.rank} • Points: {userStats.points}</Text>
              </VStack>
            </Grid>
          </MotionBox>

          {/* Stats Section */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <StatGroup bg="#2d2d2d" p={6} borderRadius="lg" textAlign="center">
              <Stat>
                <StatLabel color="gray.400">Problems Solved</StatLabel>
                <StatNumber color="#00ff00">{userStats.problemsSolved}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.400">Success Rate</StatLabel>
                <StatNumber color="#00ff00">{userStats.successRate}%</StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.400">Current Streak</StatLabel>
                <StatNumber color="#00ff00">{userStats.streak} days</StatNumber>
              </Stat>
            </StatGroup>
          </MotionBox>

          {/* Main Content Tabs */}
          <Tabs variant="soft-rounded" colorScheme="cyan">
            <TabList mb={4}>
              <Tab color="white" _selected={{ color: 'white', bg: 'cyan.500' }}>Overview</Tab>
              <Tab color="white" _selected={{ color: 'white', bg: 'cyan.500' }}>Activity</Tab>
              <Tab color="white" _selected={{ color: 'white', bg: 'cyan.500' }}>Achievements</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  {/* Progress Card */}
                  <GridItem bg="#2d2d2d" p={6} borderRadius="lg">
                    <Heading size="md" color="white" mb={4}>Problem Solving Progress</Heading>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Text color="green.400" mb={2}>Easy ({userStats.problemsSolved} solved)</Text>
                        <Progress value={60} colorScheme="green" borderRadius="full" />
                      </Box>
                      <Box>
                        <Text color="yellow.400" mb={2}>Medium (12 solved)</Text>
                        <Progress value={30} colorScheme="yellow" borderRadius="full" />
                      </Box>
                      <Box>
                        <Text color="red.400" mb={2}>Hard (5 solved)</Text>
                        <Progress value={15} colorScheme="red" borderRadius="full" />
                      </Box>
                    </VStack>
                  </GridItem>

                  {/* Recent Activity Card */}
                  <GridItem bg="#2d2d2d" p={6} borderRadius="lg">
                    <Heading size="md" color="white" mb={4}>Recent Activity</Heading>
                    <VStack align="stretch" spacing={4}>
                      {recentActivity.map(activity => (
                        <Box 
                          key={activity.id}
                          p={4}
                          bg="#1a1a1a"
                          borderRadius="md"
                          color="white"
                        >
                          <Text color="#00ff00">{activity.problem}</Text>
                          <Text color="gray.400" fontSize="sm">
                            {activity.status} • {activity.date}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </GridItem>
                </Grid>
              </TabPanel>

              <TabPanel>
                <Box bg="#2d2d2d" p={6} borderRadius="lg">
                  <Heading size="md" color="white" mb={4}>Activity Timeline</Heading>
                  {/* Add activity timeline content */}
                </Box>
              </TabPanel>

              <TabPanel>
                <Box bg="#2d2d2d" p={6} borderRadius="lg">
                  <Heading size="md" color="white" mb={4}>Achievements</Heading>
                  {/* Add achievements content */}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}

export default ProfileDashboard; 