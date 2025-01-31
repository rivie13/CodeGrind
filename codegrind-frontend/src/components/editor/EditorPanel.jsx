import { Box } from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import { useEditor } from '../../hooks/useEditor';
import EditorControls from './EditorControls';

const EditorPanel = () => {
  const { language, setLanguage, editorOptions } = useEditor();

  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Box flex="1">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          defaultValue="# Your code here"
          options={editorOptions}
        />
      </Box>
      <EditorControls 
        language={language}
        onLanguageChange={setLanguage}
      />
    </Box>
  );
};

export default EditorPanel; 