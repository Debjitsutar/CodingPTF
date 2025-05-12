document.addEventListener("DOMContentLoaded", function() {
  // Sample question data (in a real app, this would come from an API)
  const allQuestions = [
    {
      id: 1,
      title: "Largest Subarray Sum",
      difficulty: "Easy",
      topic: "Arrays",
      link: "https://leetcode.com/problems/maximum-subarray/"
    },
    {
      id: 2,
      title: "Two Sum",
      difficulty: "Easy",
      topic: "Arrays",
      link: "https://leetcode.com/problems/two-sum/"
    },
    {
      id: 3,
      title: "Merge Intervals",
      difficulty: "Medium",
      topic: "Arrays",
      link: "https://leetcode.com/problems/merge-intervals/"
    },
    {
      id: 4,
      title: "Product of Array Except Self",
      difficulty: "Medium",
      topic: "Arrays",
      link: "https://leetcode.com/problems/product-of-array-except-self/"
    },
    {
      id: 5,
      title: "Maximum Product Subarray",
      difficulty: "Medium",
      topic: "Arrays",
      link: "https://leetcode.com/problems/maximum-product-subarray/"
    },
    {
      id: 6,
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      topic: "Arrays",
      link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"
    },
    {
      id: 7,
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      topic: "Arrays",
      link: "https://leetcode.com/problems/search-in-rotated-sorted-array/"
    },
    {
      id: 8,
      title: "3Sum",
      difficulty: "Medium",
      topic: "Arrays",
      link: "https://leetcode.com/problems/3sum/"
    },
    {
      id: 9,
      title: "Container With Most Water",
      difficulty: "Medium",
      topic: "Arrays",
      link: "https://leetcode.com/problems/container-with-most-water/"
    },
    {
      id: 10,
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      topic: "Arrays",
      link: "https://leetcode.com/problems/sliding-window-maximum/"
    },
    {
      id: 11,
      title: "Minimum Window Substring",
      difficulty: "Hard",
      topic: "Strings",
      link: "https://leetcode.com/problems/minimum-window-substring/"
    },
    {
      id: 12,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      topic: "Strings",
      link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
    }
  ];

  // Pagination settings
  const questionsPerPage = 5;
  let currentPage = 1;
  const totalQuestions = allQuestions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  // DOM elements
  const questionsContainer = document.getElementById('questions-container');
  const paginationInfo = document.getElementById('pagination-info');
  const paginationControls = document.getElementById('pagination-controls');

  // Function to render questions for the current page
  function renderQuestions() {
    // Clear previous questions
    questionsContainer.innerHTML = '';
    
    // Calculate start and end index for current page
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);
    
    // Get questions for current page
    const currentPageQuestions = allQuestions.slice(startIndex, endIndex);
    
    // Render each question
    currentPageQuestions.forEach(question => {
      const difficultyColor = getDifficultyColor(question.difficulty);
      const topicColor = getTopicColor(question.topic);
      
      const questionElement = document.createElement('div');
      questionElement.style.cssText = `
        background-color: #1e293b;
        color: #f8fafc;
        padding: 20px;
        border-radius: 12px;
        max-width: 600px;
        margin-top: 20px;
        font-family: 'Segoe UI', sans-serif;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      `;
      
      questionElement.innerHTML = `
        <h1 style="font-size: 22px; margin-bottom: 10px;">${question.title}</h1>
        <p style="margin-bottom: 10px;">
          Difficulty: <span style="color: ${difficultyColor}; font-weight: bold;">${question.difficulty}</span>
        </p>
        <p style="margin-bottom: 20px;">
          Topic: <span style="color: ${topicColor}; font-weight: bold;">${question.topic}</span>
        </p>
        <a href="${question.link}" target="_blank" style="text-decoration: none;">
          <button style="
            padding: 10px 20px;
            background-color: #4f46e5;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s;
          " onmouseover="this.style.backgroundColor='#3730a3'" onmouseout="this.style.backgroundColor='#4f46e5'">
            Solve
          </button>
        </a>
      `;
      
      questionsContainer.appendChild(questionElement);
    });
    
    // Update pagination info
    paginationInfo.textContent = `${startIndex + 1} – ${endIndex} (${totalQuestions} total)`;
  }

  // Function to render pagination controls
  function renderPaginationControls() {
    paginationControls.innerHTML = '';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
    prevLi.innerHTML = `
      <a class="page-link" href="#" aria-label="Previous" ${currentPage === 1 ? 'tabindex="-1"' : ''}>
        <span aria-hidden="true">«</span>
      </a>
    `;
    prevLi.addEventListener('click', (e) => {
      if (currentPage > 1) {
        e.preventDefault();
        currentPage--;
        renderQuestions();
        renderPaginationControls();
      }
    });
    paginationControls.appendChild(prevLi);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page and ellipsis if needed
    if (startPage > 1) {
      const firstLi = document.createElement('li');
      firstLi.className = 'page-item';
      firstLi.innerHTML = `<a class="page-link" href="#">1</a>`;
      firstLi.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = 1;
        renderQuestions();
        renderPaginationControls();
      });
      paginationControls.appendChild(firstLi);
      
      if (startPage > 2) {
        const ellipsisLi = document.createElement('li');
        ellipsisLi.className = 'page-item disabled';
        ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
        paginationControls.appendChild(ellipsisLi);
      }
    }
    
    // Visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      const pageLi = document.createElement('li');
      pageLi.className = 'page-item' + (i === currentPage ? ' active' : '');
      pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pageLi.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = i;
        renderQuestions();
        renderPaginationControls();
      });
      paginationControls.appendChild(pageLi);
    }
    
    // Last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsisLi = document.createElement('li');
        ellipsisLi.className = 'page-item disabled';
        ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
        paginationControls.appendChild(ellipsisLi);
      }
      
      const lastLi = document.createElement('li');
      lastLi.className = 'page-item';
      lastLi.innerHTML = `<a class="page-link" href="#">${totalPages}</a>`;
      lastLi.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = totalPages;
        renderQuestions();
        renderPaginationControls();
      });
      paginationControls.appendChild(lastLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
    nextLi.innerHTML = `
      <a class="page-link" href="#" aria-label="Next" ${currentPage === totalPages ? 'tabindex="-1"' : ''}>
        <span aria-hidden="true">»</span>
      </a>
    `;
    nextLi.addEventListener('click', (e) => {
      if (currentPage < totalPages) {
        e.preventDefault();
        currentPage++;
        renderQuestions();
        renderPaginationControls();
      }
    });
    paginationControls.appendChild(nextLi);
  }

  // Helper function to get color based on difficulty
  function getDifficultyColor(difficulty) {
    switch(difficulty.toLowerCase()) {
      case 'easy': return '#16a34a';
      case 'medium': return '#d97706';
      case 'hard': return '#dc2626';
      default: return '#38bdf8';
    }
  }

  // Helper function to get color based on topic
  function getTopicColor(topic) {
    // Add more topics as needed
    switch(topic.toLowerCase()) {
      case 'arrays': return '#7c3aed';
      case 'strings': return '#059669';
      case 'linked list': return '#0284c7';
      case 'trees': return '#65a30d';
      case 'graphs': return '#c026d3';
      case 'dynamic programming': return '#ea580c';
      default: return '#38bdf8';
    }
  }

  // Initial render
  renderQuestions();
  renderPaginationControls();

  // In a real application, you would fetch data from an API like this:
  /*
  async function fetchQuestions() {
    try {
      const response = await fetch('https://api.example.com/questions');
      const data = await response.json();
      allQuestions = data;
      totalQuestions = allQuestions.length;
      totalPages = Math.ceil(totalQuestions / questionsPerPage);
      renderQuestions();
      renderPaginationControls();
    } catch (error) {
      console.error('Error fetching questions:', error);
      questionsContainer.innerHTML = `
        <div class="alert alert-danger">
          Failed to load questions. Please try again later.
        </div>
      `;
    }
  }
  
  fetchQuestions();
  */
});