// Import LeetCode from the npm package

document.addEventListener('DOMContentLoaded', async () => {
    const problemList = document.getElementById('problem-list');
    const difficultyFilter = document.getElementById('difficulty');
    const problemsPerPageSelect = document.getElementById('problems-per-page');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    
    let currentPage = 1;
    let totalPages = 1;
    let allProblems = [];
    
    async function fetchAllProblems(difficulty = '') {
        try {
            const url = new URL('http://localhost:3000/api/problems');
            if (difficulty && difficulty !== '') {
                url.searchParams.append('difficulty', difficulty.toUpperCase());
            }
            
            console.log('Fetching with difficulty:', difficulty); // Debug log
            const response = await fetch(url);
            const data = await response.json();
            
            // Debug logging
            console.log('First problem received:', data.questions[0]);
            console.log('Total problems:', data.questions.length);
            
            return data.questions || [];
        } catch (error) {
            console.error('Error fetching problems:', error);
            return [];
        }
    }
    
    function displayProblems(problems, page, perPage) {
        console.log('Displaying problems:', { page, perPage, total: problems.length });
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const pageProblems = problems.slice(start, end);
        
        problemList.innerHTML = pageProblems.map(problem => `
            <div class="problem-card">
                <a href="problem-details.html?titleSlug=${problem.titleSlug}" class="problem-link">
                    <h3>${problem.title}</h3>
                    <p>Problem #${problem.questionFrontendId}</p>
                    <span class="difficulty ${(problem.difficulty || '').toLowerCase()}">
                        ${problem.difficulty || 'Unknown'}
                    </span>
                </a>
            </div>
        `).join('');
        
        // Update pagination info
        currentPageSpan.textContent = page;
        totalPagesSpan.textContent = totalPages;
        
        // Update button states
        prevPageButton.disabled = page === 1;
        nextPageButton.disabled = page === totalPages;
    }
    
    async function loadProblems(difficulty = '') {
        try {
            allProblems = await fetchAllProblems(difficulty);
            const perPage = parseInt(problemsPerPageSelect.value);
            totalPages = Math.ceil(allProblems.length / perPage);
            currentPage = 1;
            
            displayProblems(allProblems, currentPage, perPage);
        } catch (error) {
            problemList.innerHTML = `<p>Error loading problems: ${error.message}</p>`;
        }
    }
    
    // Event Listeners
    difficultyFilter.addEventListener('change', (e) => {
        loadProblems(e.target.value);
    });
    
    problemsPerPageSelect.addEventListener('change', () => {
        const perPage = parseInt(problemsPerPageSelect.value);
        totalPages = Math.ceil(allProblems.length / perPage);
        currentPage = 1;
        displayProblems(allProblems, currentPage, perPage);
    });
    
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProblems(allProblems, currentPage, parseInt(problemsPerPageSelect.value));
        }
    });
    
    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProblems(allProblems, currentPage, parseInt(problemsPerPageSelect.value));
        }
    });
    
    // Load initial problems
    loadProblems();
});
