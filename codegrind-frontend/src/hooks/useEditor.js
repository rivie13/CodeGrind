import { useState } from 'react';

export function useEditor() {
  const [language, setLanguage] = useState('python');

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    padding: { top: 20 },
    scrollBeyondLastLine: false,
    automaticLayout: true
  };

  const runCode = async () => {
    // Implementation for running code
  };

  const submitCode = async () => {
    // Implementation for submitting code
  };

  return {
    language,
    setLanguage,
    editorOptions,
    runCode,
    submitCode
  };
} 