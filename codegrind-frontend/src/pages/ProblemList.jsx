import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ProblemList() {
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading } = useQuery(
    ['problems', difficulty],
    () => fetch(`http://localhost:3000/api/problems${difficulty ? `?difficulty=${difficulty}` : ''}`)
      .then(res => res.json())
  );

  const problems = data?.questions || [];
  const totalPages = Math.ceil(problems.length / perPage);
  const currentProblems = problems.slice((page - 1) * perPage, page * perPage);

  if (isLoading) return <div>Loading problems...</div>;

  return (
    <div className="problems-container">
      <h2>LeetCode Problems</h2>
      <div className="filters">
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <select 
          value={perPage} 
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
      <div className="problem-list">
        {currentProblems.map(problem => (
          <div key={problem.titleSlug} className="problem-card">
            <Link 
              to={`/problem/${problem.titleSlug}`} 
              className="problem-link"
            >
              <h3>{problem.title}</h3>
              <p>Problem #{problem.questionFrontendId}</p>
              <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
            </Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button 
          className="pagination-button"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          &lt; Previous
        </button>
        <span id="page-info">
          Page <span>{page}</span> of <span>{totalPages}</span>
        </span>
        <button 
          className="pagination-button"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default ProblemList;
