// Import LeetCode from the npm package

document.addEventListener('DOMContentLoaded', async () => {
    const problemList = document.getElementById('problem-list');
    const difficultyFilter = document.getElementById('difficulty');
    
    async function loadProblems(difficulty = '') {
        try {
            const url = new URL('http://localhost:3000/api/problems');
            if (difficulty) {
                url.searchParams.append('difficulty', difficulty);
            }
            
            const response = await fetch(url);
            const problems = await response.json();
            
            problemList.innerHTML = problems.questions.map(problem => `
                <div class="problem-card">
                    <h3>${problem.title}</h3>
                    <p>Problem #${problem.questionFrontendId}</p>
                    <span class="difficulty ${problem.difficulty.toLowerCase()}">
                        ${problem.difficulty}
                    </span>
                </div>
            `).join('');
        } catch (error) {
            problemList.innerHTML = `<p>Error loading problems: ${error.message}</p>`;
        }
    }

    difficultyFilter.addEventListener('change', (e) => {
        loadProblems(e.target.value);
    });

    // Load initial problems
    loadProblems();
});
