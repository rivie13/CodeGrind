import MonacoEditor from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import ProblemPanel from '../components/ProblemPanel';

function ProblemWorkspace() {
  const { titleSlug } = useParams();
  
  const { data: problem, isLoading } = useQuery(['problem', titleSlug], 
    () => fetch(`http://localhost:3000/api/problem/${titleSlug}`).then(res => res.json())
  );

  return (
    <div className="problem-workspace">
      <ProblemPanel problem={problem} isLoading={isLoading} />
      <EditorPanel language="python" />
      <ChatPanel />
    </div>
  );
}

function EditorPanel({ language }) {
  return (
    <div className="panel editor-panel">
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
      <div className="editor-controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button>Run Code</button>
        <button>Submit</button>
      </div>
    </div>
  );
}

export default ProblemWorkspace; 