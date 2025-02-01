import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

function ProfileDashboard() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  // Form state for profile updates
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
      setFormData({
        username: data.username,
        email: data.email,
        bio: data.bio || ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      onClose();

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  if (isLoading) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xl" color="cyan.400">Loading profile...</Text>
      </Box>
    );
  }

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
              <Avatar 
                size="2xl" 
                name={userData?.username} 
                src={userData?.avatarUrl}
                bg="cyan.500"
              />
              <VStack align="start" spacing={4}>
                <Heading color="white">{userData?.username}</Heading>
                <Text color="gray.400">@{userData?.username} • Joined {new Date(userData?.createdAt).toLocaleDateString()}</Text>
                <Button colorScheme="cyan" size="sm" onClick={onOpen}>
                  Edit Profile
                </Button>
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
                <StatNumber color="#00ff00">{userData?.stats?.problemsSolved || 0}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.400">Success Rate</StatLabel>
                <StatNumber color="#00ff00">{userData?.stats?.successRate || 0}%</StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.400">Current Streak</StatLabel>
                <StatNumber color="#00ff00">{userData?.stats?.streak || 0} days</StatNumber>
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
              {/* Overview Panel */}
              <TabPanel>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem bg="#2d2d2d" p={6} borderRadius="lg">
                    <Heading size="md" color="white" mb={4}>Problem Solving Progress</Heading>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Text color="green.400" mb={2}>
                          Easy ({userData?.stats?.easySolved || 0} solved)
                        </Text>
                        <Progress 
                          value={userData?.stats?.easyProgress || 0} 
                          colorScheme="green" 
                          borderRadius="full" 
                        />
                      </Box>
                      <Box>
                        <Text color="yellow.400" mb={2}>
                          Medium ({userData?.stats?.mediumSolved || 0} solved)
                        </Text>
                        <Progress 
                          value={userData?.stats?.mediumProgress || 0} 
                          colorScheme="yellow" 
                          borderRadius="full" 
                        />
                      </Box>
                      <Box>
                        <Text color="red.400" mb={2}>
                          Hard ({userData?.stats?.hardSolved || 0} solved)
                        </Text>
                        <Progress 
                          value={userData?.stats?.hardProgress || 0} 
                          colorScheme="red" 
                          borderRadius="full" 
                        />
                      </Box>
                    </VStack>
                  </GridItem>

                  <GridItem bg="#2d2d2d" p={6} borderRadius="lg">
                    <Heading size="md" color="white" mb={4}>Recent Activity</Heading>
                    <VStack align="stretch" spacing={4}>
                      {userData?.recentActivity?.map(activity => (
                        <Box 
                          key={activity.id}
                          p={4}
                          bg="#1a1a1a"
                          borderRadius="md"
                          color="white"
                        >
                          <Text color="#00ff00">{activity.problem}</Text>
                          <Text color="gray.400" fontSize="sm">
                            {activity.status} • {new Date(activity.date).toLocaleDateString()}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </GridItem>
                </Grid>
              </TabPanel>

              {/* Activity Timeline Panel */}
              <TabPanel>
                <Box bg="#2d2d2d" p={6} borderRadius="lg">
                  <Heading size="md" color="white" mb={4}>Activity Timeline</Heading>
                  <VStack align="stretch" spacing={4}>
                    {userData?.activityTimeline?.map(activity => (
                      <Box 
                        key={activity.id}
                        p={4}
                        bg="#1a1a1a"
                        borderRadius="md"
                        borderLeft="4px"
                        borderLeftColor="cyan.500"
                      >
                        <Text color="white">{activity.description}</Text>
                        <Text color="gray.400" fontSize="sm">
                          {new Date(activity.timestamp).toLocaleString()}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </TabPanel>

              {/* Achievements Panel */}
              <TabPanel>
                <Box bg="#2d2d2d" p={6} borderRadius="lg">
                  <Heading size="md" color="white" mb={4}>Achievements</Heading>
                  <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
                    {userData?.achievements?.map(achievement => (
                      <Box 
                        key={achievement.id}
                        p={4}
                        bg="#1a1a1a"
                        borderRadius="md"
                        textAlign="center"
                      >
                        <Text 
                          fontSize="3xl" 
                          mb={2}
                        >
                          {achievement.icon}
                        </Text>
                        <Text 
                          color="white" 
                          fontWeight="bold"
                          mb={1}
                        >
                          {achievement.title}
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                          {achievement.description}
                        </Text>
                      </Box>
                    ))}
                  </Grid>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d">
          <ModalHeader color="white">Edit Profile</ModalHeader>
          <ModalCloseButton color="white" />
          <form onSubmit={handleUpdateProfile}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel color="gray.300">Username</FormLabel>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      username: e.target.value
                    }))}
                    bg="#1a1a1a"
                    color="white"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.300">Email</FormLabel>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    bg="#1a1a1a"
                    color="white"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.300">Bio</FormLabel>
                  <Input
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bio: e.target.value
                    }))}
                    bg="#1a1a1a"
                    color="white"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="cyan" type="submit">
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ProfileDashboard; 