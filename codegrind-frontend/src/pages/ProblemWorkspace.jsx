import { Box, Button, HStack, Select, Text } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import 'react-resizable/css/styles.css';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';

const ProblemWorkspace = () => {
    const { titleSlug } = useParams();
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(`# Write your solution here\n\ndef solution():\n    print("Hello, World!")\n`);
    const [executionResult, setExecutionResult] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);

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

    const handleRunCode = async () => {
        setIsExecuting(true);
        setExecutionResult('Executing code...');

        try {
            const response = await fetch('http://localhost:3000/api/run-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language, code }),
            });

            const result = await response.json();

            if (result.error) {
                setExecutionResult(`Error: ${result.error}\n${result.details || ''}`);
                return;
            }

            let output = '';

            if (result.compile_output) {
                output += `Compilation Error:\n${result.compile_output}\n\n`;
            }

            if (result.stderr) {
                output += `Runtime Error:\n${result.stderr}\n\n`;
            }

            if (result.stdout) {
                output += `Program Output:\n${result.stdout}`;
            }

            if (!output && result.status) {
                output += `Status: ${result.status.description}\n`;
                if (result.message) {
                    output += `Message: ${result.message}\n`;
                }
            }

            if (!output.trim()) {
                output = 'Program executed but produced no output.';
            }

            if (result.time) {
                output += `\n\nExecution Time: ${result.time}s`;
            }
            if (result.memory) {
                output += `\nMemory Used: ${Math.round(result.memory)} KB`;
            }

            setExecutionResult(output);
        } catch (error) {
            setExecutionResult(`Error: ${error.message}`);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <Box h="calc(100vh - 60px)" bg="gray.800" display="flex" flexDirection="column">
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
                        <HStack spacing={4} p={4} borderBottom="1px solid" borderColor="gray.600">
                            <Select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                w="150px"
                                bg="gray.700"
                                color="white"
                            >
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </Select>
                            <Button
                                colorScheme="green"
                                isLoading={isExecuting}
                                onClick={handleRunCode}
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
                        <Box flex="1" minH="200px">
                            <Editor
                                height="100%"
                                defaultLanguage="python"
                                value={code}
                                onChange={(value) => setCode(value)}
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

                        {/* Resizable Terminal Output */}
                        <ResizableBox
                            height={150}
                            width={Infinity}
                            minConstraints={[Infinity, 50]}
                            maxConstraints={[Infinity, 400]}
                            axis="y"
                            resizeHandles={['n']}
                            handle={
                                <div 
                                    style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        left: 0,
                                        right: 0,
                                        height: '10px',
                                        cursor: 'row-resize',
                                        backgroundColor: 'rgba(127, 127, 127, 0.2)',
                                        zIndex: 10
                                    }}
                                />
                            }
                        >
                            <Box
                                position="relative"
                                height="100%"
                                bg="black"
                                color="green.300"
                                fontFamily="mono"
                                fontSize="sm"
                                overflowY="auto"
                                borderTop="1px solid"
                                borderColor="gray.600"
                                p={4}
                            >
                                <Text whiteSpace="pre-wrap" fontFamily="mono">
                                    {executionResult || 'Run your code to see output here...'}
                                </Text>
                            </Box>
                        </ResizableBox>
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

            <style jsx global>{`
                .react-resizable {
                    position: relative;
                }
                .react-resizable-handle {
                    position: absolute;
                    width: 100%;
                    height: 10px;
                    background-color: transparent;
                    top: -5px;
                    cursor: row-resize;
                    z-index: 10;
                }
                .react-resizable-handle:hover {
                    background-color: rgba(127, 127, 127, 0.4);
                }
                .react-resizable-handle:active {
                    background-color: rgba(127, 127, 127, 0.6);
                }
            `}</style>
        </Box>
    );
};

export default ProblemWorkspace; 