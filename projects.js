// Global data variable
let data = null;

// Load data and initialize the page
document.addEventListener("DOMContentLoaded", function () {
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
    renderProblemAnalysis();
}

function getPaginatedQuestions(pageNumber) {
    const questionsPerPage = 5;
    const startIndex = (pageNumber - 1) * questionsPerPage;
    return data.questions.slice(startIndex, startIndex + questionsPerPage);
}

function renderTable(questions) {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = '';

    questions.forEach((question, index) => {
        const row = document.createElement('tr');
        if (index % 2 === 1) row.style.backgroundColor = '#f9f9f9';

        row.innerHTML = `
            <td><div class="d-flex align-items-center"><div class="ms-4">${question.title}</div></div></td>
            <td>
                <div class="avatar-group">
                    ${question.languages.map(lang => `
                        <div class="avatar avatar-xs">
                            <img class="avatar-img" src="${lang.toLowerCase()}.png" alt="${lang}">
                        </div>`).join('')}
                </div>
            </td>
            <td>
                <div class="avatar avatar-xs" style="margin-left: 1.2vw;">
                    <a href="${question.practiceLink}">
                        <img class="avatar-img" src="${question.practiceSite}" alt="Practice site" 
                            style="${question.practiceSite === 'gfg.png' ? 'width: 39px; height: 23px;' : ''}">
                    </a>
                </div>
            </td>
            <td>
                <select class="form-select form-select-sm border-0 status-select" style="width: auto;" 
                    data-question-id="${question.id}">
                    <option class="text-danger" value="Unattempted" ${question.status === 'Unattempted' ? 'selected' : ''}>Unattempted</option>
                    <option class="text-warning" value="In Progress" ${question.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option class="text-success" value="Completed" ${question.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option class="text-primary" value="Review" ${question.status === 'Review' ? 'selected' : ''}>Review</option>
                </select>
            </td>
            <td>
                <div class="avatar-group">
                    ${question.companies.map(company => `
                        <div class="avatar avatar-xs">
                            <img class="avatar-img" src="${company}" alt="${company.split('.')[0]}">
                        </div>`).join('')}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderPagination() {
    if (!data) return;

    const paginationContainer = document.querySelector('.pagination');
    const questionsPerPage = 5;
    const totalPages = Math.ceil(data.questions.length / questionsPerPage);
    paginationContainer.innerHTML = '';

    const prevItem = document.createElement('li');
    prevItem.className = 'page-item';
    prevItem.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">«</span></a>`;
    prevItem.addEventListener('click', e => {
        e.preventDefault();
        const current = parseInt(document.querySelector('.pagination .active')?.textContent || 1);
        if (current > 1) goToPage(current - 1);
    });
    paginationContainer.appendChild(prevItem);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item${i === 1 ? ' active' : ''}`;
        const link = document.createElement('a');
        link.className = 'page-link';
        link.href = '#';
        link.textContent = i;
        link.addEventListener('click', e => {
            e.preventDefault();
            goToPage(i);
        });
        pageItem.appendChild(link);
        paginationContainer.appendChild(pageItem);
    }

    const nextItem = document.createElement('li');
    nextItem.className = 'page-item';
    nextItem.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">»</span></a>`;
    nextItem.addEventListener('click', e => {
        e.preventDefault();
        const current = parseInt(document.querySelector('.pagination .active')?.textContent || 1);
        if (current < totalPages) goToPage(current + 1);
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

function updateActivePage(newPage) {
    document.querySelectorAll('.pagination .page-item').forEach((item, i) => {
        if (i > 0 && i < document.querySelectorAll('.pagination .page-item').length - 1) {
            item.classList.remove('active');
            if (parseInt(item.textContent) === parseInt(newPage)) {
                item.classList.add('active');
            }
        }
    });
}

function initializeTableFunctionality() {
    const completedCountElement = document.getElementById('completedCount');
    const searchInput = document.getElementById('questionSearch');

    function updateCompletedCount() {
        if (!data || !completedCountElement) return;
        const valid = ['Completed', 'Review'];
        const completed = data.questions.filter(q => valid.includes(q.status)).length;
        completedCountElement.textContent = `${completed} out of ${data.questions.length} programs completed`;
    }

    function applyColorClass(select) {
        const classes = {
            'Unattempted': 'text-danger',
            'In Progress': 'text-warning',
            'Completed': 'text-success',
            'Review': 'text-primary'
        };
        Object.values(classes).forEach(c => select.classList.remove(c));
        select.classList.add(classes[select.value]);
    }

    function handleStatusChange(select) {
        const id = parseInt(select.dataset.questionId);
        const newStatus = select.value;
        const idx = data.questions.findIndex(q => q.id === id);
        if (idx !== -1) {
            data.questions[idx].status = newStatus;
            localStorage.setItem('questionsData', JSON.stringify(data));

            if (newStatus === 'Review' && data.questions[idx].practiceLink) {
                window.open(data.questions[idx].practiceLink, '_blank');
            }

            updateCompletedCount();
            applyColorClass(select);
            renderProblemAnalysis();
        }
    }

    document.querySelectorAll('.status-select').forEach(select => {
        applyColorClass(select);
        select.addEventListener('change', function () {
            handleStatusChange(this);
        });
    });

    updateCompletedCount();

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const term = this.value.toLowerCase();
            const currentPage = parseInt(document.querySelector('.pagination .active')?.textContent || 1);
            if (term) {
                const filtered = data.questions.filter(q =>
                    q.title.toLowerCase().includes(term) ||
                    q.status.toLowerCase().includes(term) ||
                    q.languages.some(l => l.toLowerCase().includes(term)) ||
                    q.companies.some(c => c.toLowerCase().includes(term))
                );
                const original = [...data.questions];
                data.questions = filtered;
                renderPagination();
                goToPage(1);
                data.questions = original;
            } else {
                renderPagination();
                goToPage(currentPage);
            }
        });
    }
}

function renderProblemAnalysis() {
    const counts = data.questions.reduce((acc, q) => {
        acc[q.status] = (acc[q.status] || 0) + 1;
        return acc;
    }, {});

    ['Unattempted', 'In Progress', 'Completed', 'Review'].forEach(status => {
        if (!counts[status]) counts[status] = 0;
    });

    const total = data.questions.length;
    if (total === 0) return;

    let startAngle = 0;
    const colors = {
        'Unattempted': 'red',
        'In Progress': 'rgb(0,102,204)',
        'Completed': 'rgb(12,155,25)',
        'Review': 'rgb(255,193,7)'
    };

    const slicesHTML = ['Unattempted', 'In Progress', 'Completed', 'Review'].map(status => {
        const count = counts[status];
        const angle = (count / total) * 360;
        const endRotate = startAngle - angle;
        const html = `
            <div class="slice" style="transform: rotate(${startAngle}deg);">
                <span style="
                    transform: rotate(${endRotate}deg);
                    background-color: ${colors[status]};
                "></span>
            </div>`;
        startAngle += angle;
        return html;
    }).join('');

    const legendHTML = ['Unattempted', 'In Progress', 'Completed', 'Review'].map(status => `
        <li style="border-color:${colors[status]}; padding:.25em .5em;">
            <em>${status}</em><span>${counts[status]}</span>
        </li>`).join('');

    const pie = document.querySelector('.pieID.pie');
    const legend = document.querySelector('.pieID.legend');
    if (pie) pie.innerHTML = slicesHTML;
    if (legend) legend.innerHTML = legendHTML;
}
