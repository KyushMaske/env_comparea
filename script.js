document.addEventListener('DOMContentLoaded', () => {
    const comparisonContainer = document.getElementById('comparison-container');
    const addBoxBtn = document.getElementById('add-box-btn');
    let boxCount = 2; // We start with two boxes

    // --- Main Comparison Logic ---
    function compareContent() {
        const sourceLines = document.getElementById('content-0').value.split('\n');
        const sourceSet = new Set(sourceLines);

        document.querySelectorAll('.content-input').forEach((input, index) => {
            if (index === 0) {
                // The source diffs against itself to show its content
                const diffOutput = document.getElementById(`diff-0`);
                diffOutput.innerHTML = sourceLines.map(line => `<span class="unchanged">${escapeHtml(line)}</span>`).join('');
                return;
            }

            const compareLines = input.value.split('\n');
            const compareSet = new Set(compareLines);
            const diffOutput = document.getElementById(`diff-${index}`);
            let diffHtml = '';

            // Find lines added or changed in the comparison box
            compareLines.forEach(line => {
                if (!sourceSet.has(line)) {
                    diffHtml += `<span class="added">${escapeHtml(line)}</span>`;
                } else {
                    diffHtml += `<span class="unchanged">${escapeHtml(line)}</span>`;
                }
            });

            // Find lines removed from the source
            sourceLines.forEach(line => {
                if (line.trim() !== '' && !compareSet.has(line)) {
                    diffHtml += `<span class="removed">${escapeHtml(line)}</span>`;
                }
            });

            diffOutput.innerHTML = diffHtml;
        });
    }

    // --- Event Handling ---
    function setupEventListeners() {
        document.querySelectorAll('.content-input').forEach(input => {
            input.removeEventListener('input', compareContent); // Prevent duplicate listeners
            input.addEventListener('input', compareContent);
        });

        document.querySelectorAll('.sort-btn').forEach(button => {
            button.removeEventListener('click', handleSort); // Prevent duplicate listeners
            button.addEventListener('click', handleSort);
        });
    }

    // --- Sorting Logic ---
    function handleSort(event) {
        const targetId = event.target.dataset.target;
        const textarea = document.getElementById(targetId);
        if (textarea) {
            const lines = textarea.value.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
            lines.sort();
            textarea.value = lines.join('\n');
            compareContent(); // Re-run comparison after sorting
        }
    }

    // --- Dynamically Adding New Boxes ---
    addBoxBtn.addEventListener('click', () => {
        const newBoxId = boxCount;
        const newBoxLetter = String.fromCharCode(65 + newBoxId); // A, B, C, ...

        const newComparisonSet = document.createElement('div');
        newComparisonSet.classList.add('comparison-set');
        newComparisonSet.innerHTML = `
            <div class="comparer-box">
                <div class="box-header">
                    <h2>Compare to ${newBoxLetter}</h2>
                    <button class="sort-btn" data-target="content-${newBoxId}">Sort</button>
                </div>
                <textarea id="content-${newBoxId}" class="content-input" placeholder="Enter content to compare..."></textarea>
            </div>
            <div class="diff-output-box">
                <h2>Differences</h2>
                <pre id="diff-${newBoxId}" class="diff-display"></pre>
            </div>
        `;
        
        comparisonContainer.appendChild(newComparisonSet);
        boxCount++;
        setupEventListeners(); // Re-attach listeners to include the new elements
    });

    // --- Utility Function ---
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(text || ''));
        return div.innerHTML;
    }

    // --- Initial Setup ---
    setupEventListeners();
    compareContent();
});