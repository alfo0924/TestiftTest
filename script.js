document.addEventListener('DOMContentLoaded', function() {
    const addComponentBtn = document.getElementById('addComponentBtn');
    const componentList = document.querySelector('.component-list');
    const runTestsBtn = document.getElementById('runTestsBtn');
    const resultsDisplay = document.querySelector('.results-display');

    // Function to add a new component
    function addComponent() {
        const componentName = prompt("Enter component name:");
        if (componentName) {
            const componentDiv = document.createElement('div');
            componentDiv.classList.add('component-item');
            componentDiv.textContent = componentName;
            componentList.appendChild(componentDiv);
        }
    }

    // Function to run tests (placeholder)
    function runTests() {
        resultsDisplay.textContent = 'Running tests... (simulated)';
        setTimeout(() => {
            resultsDisplay.textContent = 'All tests passed! (simulated)';
        }, 2000);
    }

    // Event listeners
    addComponentBtn.addEventListener('click', addComponent);
    runTestsBtn.addEventListener('click', runTests);
});
