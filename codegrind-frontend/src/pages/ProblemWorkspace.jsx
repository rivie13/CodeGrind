import { Box, Button, HStack, Select } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';

const ProblemWorkspace = () => {
    const { titleSlug } = useParams();
    const [language, setLanguage] = useState('python');
    
    const { data: problem, isLoading } = useQuery({
        queryKey: ['problem', titleSlug],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3000/api/problem/${titleSlug}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }
    });

    const defaultCode = `# Write your solution here
def solution():
    pass
`;

    return (
        <Box h="calc(100vh - 60px)" bg="gray.800">
            <PanelGroup direction="horizontal">
                {/* Problem Description Panel */}
                <Panel defaultSize={30} minSize={20}>
                    <Box
                        h="100%"
                        overflowY="auto"
                        bg="gray.900"
                        borderRight="1px solid"
                        borderColor="gray.600"
                        px={6}
                        py={4}
                    >
                        {isLoading ? (
                            <div>Loading problem...</div>
                        ) : problem ? (
                            <div dangerouslySetInnerHTML={{ __html: problem.content }} />
                        ) : (
                            <div>Problem not found</div>
                        )}
                    </Box>
                </Panel>

                {/* Resize Handle */}
                <PanelResizeHandle className="resize-handle" />

                {/* Code Editor Panel */}
                <Panel defaultSize={40} minSize={30}>
                    <Box h="100%" bg="gray.800" display="flex" flexDirection="column">
                        {/* Editor Controls */}
                        <HStack 
                            spacing={4} 
                            p={4} 
                            borderBottom="1px solid" 
                            borderColor="gray.600"
                        >
                            <Select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                w="150px"
                                bg="gray.700"
                                color="white"
                                _hover={{ borderColor: "cyan.400" }}
                            >
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </Select>
                            <Button
                                colorScheme="green"
                                size="md"
                                onClick={() => console.log('Run code')}
                            >
                                Run Code
                            </Button>
                            <Button
                                colorScheme="blue"
                                size="md"
                                onClick={() => console.log('Submit')}
                            >
                                Submit
                            </Button>
                        </HStack>

                        {/* Editor */}
                        <Box flex="1">
                            <Editor
                                height="100%"
                                defaultLanguage="python"
                                defaultValue={defaultCode}
                                theme="vs-dark"
                                language={language}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </Box>
                    </Box>
                </Panel>

                {/* Resize Handle */}
                <PanelResizeHandle className="resize-handle" />

                {/* Chat Panel */}
                <Panel defaultSize={30} minSize={20}>
                    <Box
                        h="100%"
                        bg="gray.900"
                        borderLeft="1px solid"
                        borderColor="gray.600"
                    >
                        <Chat />
                    </Box>
                </Panel>
            </PanelGroup>
        </Box>
    );
};

export default ProblemWorkspace; 