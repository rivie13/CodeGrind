document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');
    
    // Initialize Monaco Editor
    require(['vs/editor/editor.main'], function() {
        window.editor = monaco.editor.create(document.getElementById('monaco-editor'), {
            value: '# Your code here\n',
            language: 'python',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: {
                enabled: false
            },
            fontSize: 14,
            scrollBeyondLastLine: false,
            roundedSelection: false,
            padding: {
                top: 20
            },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            contextmenu: true,
            scrollbar: {
                vertical: 'visible',
                horizontal: 'visible'
            }
        });

        // Add language selector after editor creation
        const languageSelect = document.getElementById('language-select');
        languageSelect.value = 'javascript'; // Set default
        languageSelect.addEventListener('change', (e) => {
            monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
        });

        // Ensure editor layout is updated
        window.addEventListener('resize', () => {
            editor.layout();
        });
    });

    const problemContent = document.getElementById('problem-content');
    const urlParams = new URLSearchParams(window.location.search);
    const titleSlug = urlParams.get('titleSlug');

    console.log('Title Slug:', titleSlug);

    if (!titleSlug) {
        problemContent.innerHTML = '<p>Error: Problem not found</p>';
        return;
    }

    try {
        const url = `http://localhost:3000/api/problem/${titleSlug}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        const problem = await response.json();
        console.log('Response data:', problem);
        
        if (response.status !== 200) {
            throw new Error(problem.error || 'Failed to fetch problem details');
        }

        // Add console.log to debug the response
        console.log('Problem data:', problem);

        // Get difficulty from the data.question object
        const difficulty = problem.data?.question?.difficulty || '';
        
        problemContent.innerHTML = `
            <h2>${problem.data?.question?.title || 'Untitled Problem'}</h2>
            <div class="problem-stats">
                ${difficulty ? 
                    `<span class="difficulty ${difficulty}">
                        ${difficulty}
                    </span>` : ''
                }
                ${problem.data?.question?.questionId ? 
                    `<span>Problem #${problem.data.question.questionId}</span>` : ''
                }
            </div>
            <div class="problem-description">
                ${problem.data?.question?.content || 'Problem description not available'}
            </div>
        `;
    } catch (error) {
        problemContent.innerHTML = `
            <div class="error-message">
                <h3>Error loading problem</h3>
                <p>${error.message}</p>
                <a href="problems.html">← Back to Problems List</a>
            </div>
        `;
    }

    const handles = document.querySelectorAll('.resize-handle');
    
    handles.forEach((handle, index) => {
        let isResizing = false;
        let startX;
        let startWidths;
        
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.pageX;
            
            // Get the panels adjacent to this handle
            const panels = [
                handle.previousElementSibling,
                handle.nextElementSibling
            ];
            
            startWidths = panels.map(panel => panel.offsetWidth);
            
            handle.classList.add('active');
            
            // Add event listeners for dragging
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', () => {
                isResizing = false;
                handle.classList.remove('active');
                document.removeEventListener('mousemove', handleMouseMove);
            });
        });
        
        function handleMouseMove(e) {
            if (!isResizing) return;
            
            const panels = [
                handle.previousElementSibling,
                handle.nextElementSibling
            ];
            
            const dx = e.pageX - startX;
            
            // Update widths
            panels[0].style.width = `${startWidths[0] + dx}px`;
            panels[1].style.width = `${startWidths[1] - dx}px`;
        }
    });
});
