import { Box } from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import ProblemPanel from '../components/ProblemPanel';

const ProblemWorkspace = () => {
  // Get problem ID from URL parameters
  const { titleSlug } = useParams();
  
  // Track selected programming language
  const [language, setLanguage] = useState('python');
  
  // Fetch problem data using React Query
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
    <Box h="calc(100vh - 64px)" bg="#1e1e1e" overflow="hidden">
      {/* Main horizontal panel layout */}
      <PanelGroup direction="horizontal">
        {/* Left panel: Problem Description */}
        <Panel defaultSize={30} minSize={20} maxSize={45}>
          <Box h="100%" className="panel-content">
            <ProblemPanel problem={problem} isLoading={isLoading} />
          </Box>
        </Panel>

        <PanelResizeHandle className="resize-handle" />

        {/* Middle panel: Code Editor */}
        <Panel defaultSize={45} minSize={30}>
          <Box h="100%" className="panel-content">
            <EditorPanel language={language} setLanguage={setLanguage} />
          </Box>
        </Panel>

        <PanelResizeHandle className="resize-handle" />

        {/* Right panel: AI Chat Assistant */}
        <Panel defaultSize={25} minSize={15}>
          <Box h="100%" className="panel-content">
            <Chat />
          </Box>
        </Panel>
      </PanelGroup>
    </Box>
  );
};

// Editor component with language selector and controls
function EditorPanel({ language, setLanguage }) {
  return (
    <Box h="100%" display="flex" flexDirection="column">
      {/* Monaco code editor */}
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
      
      {/* Bottom controls bar */}
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