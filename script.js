document.addEventListener('DOMContentLoaded', function() {
    const addComponentBtn = document.getElementById('addComponentBtn');
    const componentList = document.querySelector('.component-list');
    const componentPlaceholder = document.querySelector('.component-item-placeholder');
    const runTestsBtn = document.getElementById('runTestsBtn');
    const resultsDisplay = document.querySelector('.results-display');
    const noResultsMsg = document.querySelector('.no-results');
    const currentYearSpan = document.getElementById('currentYear');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    let components = []; // Array to store component names

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Theme Toggler
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            theme = 'dark';
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            theme = 'light';
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Smooth scrolling and active nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) { // Adjust offset as needed
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });


    function renderComponents() {
        if (components.length === 0) {
            if (componentPlaceholder) componentPlaceholder.style.display = 'block';
            componentList.querySelectorAll('.component-item').forEach(item => item.remove()); // Clear existing items if any
        } else {
            if (componentPlaceholder) componentPlaceholder.style.display = 'none';
            componentList.innerHTML = ''; // Clear list before re-rendering
            components.forEach((componentName, index) => {
                const componentDiv = document.createElement('div');
                componentDiv.classList.add('component-item');

                const nameSpan = document.createElement('span');
                nameSpan.textContent = componentName;
                componentDiv.appendChild(nameSpan);

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('component-item-actions');

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.setAttribute('aria-label', `Delete ${componentName}`);
                deleteBtn.title = `刪除 ${componentName}`;
                deleteBtn.addEventListener('click', () => deleteComponent(index));
                actionsDiv.appendChild(deleteBtn);

                componentDiv.appendChild(actionsDiv);
                componentList.appendChild(componentDiv);
            });
        }
    }

    function addComponent() {
        const componentName = prompt("請輸入組件名稱:");
        if (componentName && componentName.trim() !== "") {
            components.push(componentName.trim());
            renderComponents();
            showToast(`組件 "${componentName.trim()}" 已新增`);
        } else if (componentName !== null) { // User didn't press cancel, but entered empty string
            showToast("組件名稱不可為空", "error");
        }
    }

    function deleteComponent(index) {
        const componentName = components[index];
        if (confirm(`您確定要刪除組件 "${componentName}" 嗎？`)) {
            components.splice(index, 1);
            renderComponents();
            showToast(`組件 "${componentName}" 已刪除`, "info");
        }
    }

    function runTests() {
        if (noResultsMsg) noResultsMsg.style.display = 'none';
        resultsDisplay.innerHTML = '<p class="result-item info"><i class="fas fa-spinner fa-spin"></i> 正在執行測試... (模擬中)</p>';
        runTestsBtn.disabled = true;
        runTestsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 執行中...'

        // Simulate test execution
        setTimeout(() => {
            resultsDisplay.innerHTML = ''; // Clear loading message
            const testType = document.getElementById('testType').value;
            const testFramework = document.getElementById('testFramework').value;

            if (components.length === 0) {
                resultsDisplay.innerHTML = '<p class="result-item failure"><i class="fas fa-times-circle"></i> 沒有可測試的組件。請先新增組件。</p>';
                runTestsBtn.disabled = false;
                runTestsBtn.innerHTML = '<i class="fas fa-play-circle"></i> 執行測試';
                return;
            }

            let allPassed = true;
            components.forEach(comp => {
                const pass = Math.random() > 0.3; // Simulate pass/fail
                const resultItem = document.createElement('p');
                resultItem.classList.add('result-item');
                if (pass) {
                    resultItem.classList.add('success');
                    resultItem.innerHTML = `<i class="fas fa-check-circle"></i> 組件 "${comp}" (${testType} using ${testFramework}): 通過`;
                } else {
                    resultItem.classList.add('failure');
                    resultItem.innerHTML = `<i class="fas fa-times-circle"></i> 組件 "${comp}" (${testType} using ${testFramework}): 失敗`;
                    allPassed = false;
                }
                resultsDisplay.appendChild(resultItem);
            });

            const summaryItem = document.createElement('p');
            summaryItem.classList.add('result-item', 'info', 'mt-1');
            summaryItem.style.fontWeight = 'bold';
            if (allPassed) {
                summaryItem.innerHTML = `<i class="fas fa-award"></i> 總結：所有測試均已通過！`;
                summaryItem.classList.replace('info', 'success');
            } else {
                summaryItem.innerHTML = `<i class="fas fa-exclamation-triangle"></i> 總結：部分測試失敗。`;
                summaryItem.classList.replace('info', 'failure');
            }
            resultsDisplay.appendChild(summaryItem);

            runTestsBtn.disabled = false;
            runTestsBtn.innerHTML = '<i class="fas fa-play-circle"></i> 再次執行測試';
            showToast("測試執行完畢！");

        }, 2500);
    }

    // Basic Toast Notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Center toast
        toast.style.left = `calc(50% - ${toast.offsetWidth / 2}px)`;

        setTimeout(() => {
            toast.classList.add('show');
        }, 10); // Small delay to ensure transition takes effect

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500); // Wait for fade out transition
        }, 3000);
    }

    // CSS for toast (add this to your style.css or a <style> tag in head)
    const toastStyle = `
        .toast {
            position: fixed;
            bottom: -100px; /* Start off-screen */
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--dark-bg);
            color: var(--text-color-dark);
            padding: 12px 20px;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            z-index: 2000;
            opacity: 0;
            transition: bottom 0.5s ease-in-out, opacity 0.5s ease-in-out;
            font-size: 0.95rem;
        }
        .toast.show {
            bottom: 30px; /* Slide in */
            opacity: 1;
        }
        .toast-success { background-color: var(--secondary-color); color: white; }
        .toast-error { background-color: var(--danger-color); color: white; }
        .toast-info { background-color: var(--primary-color); color: white; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = toastStyle;
    document.head.appendChild(styleSheet);


    // Initial render
    renderComponents();

    // Event listeners
    if (addComponentBtn) addComponentBtn.addEventListener('click', addComponent);
    if (runTestsBtn) runTestsBtn.addEventListener('click', runTests);
});
