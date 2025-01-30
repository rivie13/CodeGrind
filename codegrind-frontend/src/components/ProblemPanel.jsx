import DOMPurify from 'dompurify';

function ProblemPanel({ problem, isLoading }) {
  if (isLoading) return <div className="panel problem-panel">Loading problem...</div>;

  if (!problem?.data?.question) {
    return (
      <div className="panel problem-panel error-message">
        <h3>Error loading problem</h3>
        <p>Problem not found</p>
        <a href="/problems">← Back to Problems List</a>
      </div>
    );
  }

  const { title, difficulty, questionId, content } = problem.data.question;

  return (
    <div className="panel problem-panel">
      <h2>{title}</h2>
      <div className="problem-stats">
        {difficulty && (
          <span className={`difficulty ${difficulty.toLowerCase()}`}>
            {difficulty}
          </span>
        )}
        {questionId && <span>Problem #{questionId}</span>}
      </div>
      <div 
        className="problem-description"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    </div>
  );
}

export default ProblemPanel; 