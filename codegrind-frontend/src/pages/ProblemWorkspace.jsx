import { Box, Grid, GridItem } from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import ProblemPanel from '../components/ProblemPanel';

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

  return (
    <Box h="calc(100vh - 64px)" bg="#1e1e1e">
      <Grid
        templateColumns="30% 45% 25%"
        gap={0}
        h="100%"
      >
        {/* Problem Description */}
        <GridItem 
          overflowY="auto" 
          borderRight="1px solid" 
          borderColor="gray.600"
        >
          <ProblemPanel problem={problem} isLoading={isLoading} />
        </GridItem>

        {/* Code Editor */}
        <GridItem>
          <EditorPanel language={language} setLanguage={setLanguage} />
        </GridItem>

        {/* Chat Panel */}
        <GridItem 
          borderLeft="1px solid" 
          borderColor="gray.600"
        >
          <ChatPanel />
        </GridItem>
      </Grid>
    </Box>
  );
};

function EditorPanel({ language, setLanguage }) {
  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Box flex="1">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          defaultValue="# Your code here"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 20 }
          }}
        />
      </Box>
      <Box 
        p={2} 
        bg="#252526" 
        borderTop="1px solid"
        borderColor="gray.600"
        display="flex"
        gap={2}
      >
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button className="primary-button">Run Code</button>
        <button className="primary-button">Submit</button>
      </Box>
    </Box>
  );
}

export default ProblemWorkspace; 