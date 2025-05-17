// Global data variable
let data = null;

// Load data and initialize the page
document.addEventListener("DOMContentLoaded", function() {
    // First try to load from localStorage
    const savedData = localStorage.getItem('questionsData');
    if (savedData) {
        try {
            data = JSON.parse(savedData);
            initializeUI();
        } catch (e) {
            console.error("Error parsing saved data:", e);
            loadFromJSON();
        }
    } else {
        loadFromJSON();
    }
});

function loadFromJSON() {
    fetch('projects.json')
        .then(response => response.json())
        .then(fetchedData => {
            data = fetchedData;
            localStorage.setItem('questionsData', JSON.stringify(data));
            initializeUI();
        })
        .catch(error => console.error('Error loading JSON:', error));
}

function initializeUI() {
    renderPagination();
    goToPage(1);
    initializeTableFunctionality();
}

// Helper function to get paginated questions
function getPaginatedQuestions(pageNumber) {
    const questionsPerPage = 5;
    const startIndex = (pageNumber - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return data.questions.slice(startIndex, endIndex);
}

function renderTable(questions) {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    questions.forEach((question, index) => {
        const row = document.createElement('tr');
        if (index % 2 === 1) row.style.backgroundColor = '#f9f9f9';

        row.innerHTML =
            `<td>
                <div class="d-flex align-items-center">
                    <div class="ms-4">
                        <div>${question.title}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="avatar-group">
                    ${question.languages.map(lang => 
                        `<div class="avatar avatar-xs">
                            <img class="avatar-img" src="${lang.toLowerCase()}.png" alt="${lang}">
                        </div>`
                    ).join('')}
                </div>
            </td>
            <td>
                <div class="avatar-group">
                    <div class="avatar avatar-xs" style="margin-left: 1.2vw;">
                        <a href="${question.practiceLink}">
                            <img class="avatar-img" src="${question.practiceSite}" alt="Practice site" 
                                style="${question.practiceSite === 'gfg.png' ? 'width: 39px; height: 23px;' : ''}">
                        </a>
                    </div>
                </div>
            </td>
            <td>
                <select class="form-select form-select-sm border-0 status-select" style="width: auto;" 
                    data-question-id="${question.id}">
                    <option class="text-danger" value="Unattempted" 
                        ${question.status === 'Unattempted' ? 'selected' : ''}>Unattempted</option>
                    <option class="text-warning" value="In Progress" 
                        ${question.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option class="text-success" value="Completed" 
                        ${question.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option class="text-primary" value="Review" 
                        ${question.status === 'Review' ? 'selected' : ''}>Review</option>
                </select>
            </td>
            <td>
                <div class="avatar-group">
                    ${question.companies.map(company => 
                        `<div class="avatar avatar-xs">
                            <img class="avatar-img" src="${company}" alt="${company.split('.')[0]}">
                        </div>`
                    ).join('')}
                </div>
            </td>`;

        tbody.appendChild(row);
    });
}

function renderPagination() {
    if (!data) return;
    
    const paginationContainer = document.querySelector('.pagination');
    const questionsPerPage = 5;
    const totalPages = Math.ceil(data.questions.length / questionsPerPage);

    paginationContainer.innerHTML = '';

    // Previous button
    const prevItem = document.createElement('li');
    prevItem.className = 'page-item';
    prevItem.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">«</span></a>`;
    prevItem.addEventListener('click', (e) => {
        e.preventDefault();
        const currentActive = document.querySelector('.pagination .active');
        const currentPage = currentActive ? parseInt(currentActive.textContent) : 1;
        if (currentPage > 1) goToPage(currentPage - 1);
    });
    paginationContainer.appendChild(prevItem);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item' + (i === 1 ? ' active' : '');
        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            goToPage(i);
        });
        pageItem.appendChild(pageLink);
        paginationContainer.appendChild(pageItem);
    }

    // Next button
    const nextItem = document.createElement('li');
    nextItem.className = 'page-item';
    nextItem.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">»</span></a>`;
    nextItem.addEventListener('click', (e) => {
        e.preventDefault();
        const currentActive = document.querySelector('.pagination .active');
        const currentPage = currentActive ? parseInt(currentActive.textContent) : 1;
        if (currentPage < totalPages) goToPage(currentPage + 1);
    });
    paginationContainer.appendChild(nextItem);
}

function goToPage(pageNumber) {
    if (!data) return;
    
    const questions = getPaginatedQuestions(pageNumber);
    renderTable(questions);
    updateActivePage(pageNumber);
    initializeTableFunctionality();
}

function updateActivePage(newActivePage) {
    const pageItems = document.querySelectorAll('.pagination .page-item');
    pageItems.forEach((item, index) => {
        // Skip prev/next buttons (first and last elements)
        if (index > 0 && index < pageItems.length - 1) {
            item.classList.remove('active');
            if (index === newActivePage) item.classList.add('active');
        }
    });
}

function initializeTableFunctionality() {
    const completedCountElement = document.getElementById('completedCount');
    const searchInput = document.getElementById('questionSearch');

    function updateCompletedCount() {
    if (!data || !completedCountElement) return;
    
    const validStatuses = ['Completed', 'Review'];
    const completedCount = data.questions.filter(q => validStatuses.includes(q.status)).length;
    completedCountElement.textContent = `${completedCount} out of ${data.questions.length} programs completed`;
}

    function applyColorClass(select) {
        const colorClasses = {
            'Unattempted': 'text-danger',
            'In Progress': 'text-warning',
            'Completed': 'text-success',
            'Review': 'text-primary'
        };
        
        // Remove all color classes
        Object.values(colorClasses).forEach(cls => select.classList.remove(cls));
        // Add the appropriate class
        select.classList.add(colorClasses[select.value]);
    }

    function handleStatusChange(select) {
    const questionId = parseInt(select.dataset.questionId);
    const newStatus = select.value;
    
    // Find and update the question
    const questionIndex = data.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
        data.questions[questionIndex].status = newStatus;
        localStorage.setItem('questionsData', JSON.stringify(data));
        
        // Open practice link if status changed to Review
        if (newStatus === 'Review') {
            const question = data.questions[questionIndex];
            if (question.practiceLink) {
                window.open(question.practiceLink, '_blank');
            }
        }
        
        // Update the count
        updateCompletedCount();
        applyColorClass(select);
    }
}

    // Initialize status dropdowns
    document.querySelectorAll('.status-select').forEach(select => {
        applyColorClass(select);
        select.addEventListener('change', function() {
            handleStatusChange(this);
        });
    });

    updateCompletedCount();

    // Rest of your search functionality remains the same...
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const currentPage = document.querySelector('.pagination .active')?.textContent || 1;
            
            if (searchTerm) {
                // Search across all questions
                const filteredQuestions = data.questions.filter(question => {
                    return (
                        question.title.toLowerCase().includes(searchTerm) ||
                        question.status.toLowerCase().includes(searchTerm) ||
                        question.languages.some(lang => lang.toLowerCase().includes(searchTerm)) ||
                        question.companies.some(company => company.toLowerCase().includes(searchTerm))
                    );
                });
                
                const originalQuestions = [...data.questions];
                data.questions = filteredQuestions;
                renderPagination();
                goToPage(1);
                data.questions = originalQuestions;
            } else {
                renderPagination();
                goToPage(currentPage);
            }
        });
    }
}
