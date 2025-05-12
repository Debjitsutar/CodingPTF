// Sample data structure
const leaderboardData = [
  {
    rank: 1,
    name: "Promit Sur",
    avatar: "freepik__upload__71749-512x512.jpg",
    solved: 450,
    accuracy: 92,
    badges: [
      {
        text: "Top 1%",
        style:
          "background: linear-gradient(135deg, #FFD700 0%, #FFAA00 100%); color: #000 !important; font-weight: 600; border: none; box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);",
        icon: "military_tech"
      },
      {
        text: "Legendary Coder",
        style:
          "background-color: #390f6181; color: #8A2BE2; border: 1px solid #7B1FA2;",
        icon: "auto_awesome"
      }
    ],
    rankColor: "#f9bc06"
  },
  {
    rank: 2,
    name: "Alex Johnson",
    avatar: "ava2.jpg",
    solved: 420,
    accuracy: 89,
    badges: [
      {
        text: "Top 5%",
        style: "background-color: #f3f4f6; color: #6b7280;",
        icon: ""
      },
      {
        text: "Contest Master",
        style: "background-color: #f3e8ff; color: #7e22ce;",
        icon: ""
      }
    ],
    rankColor: "#c0c0c0"
  },
  {
    rank: 3,
    name: "Riya Kapoor",
    avatar: "ava3.jpg",
    solved: 410,
    accuracy: 88,
    badges: [
      {
        text: "Speed Solver",
        style: "background-color: #e0f7fa; color: #00796b;",
        icon: "bolt"
      }
    ],
    rankColor: "#cd7f32"
  },
  {
    rank: 4,
    name: "Mohit Verma",
    avatar: "ava4.jpg",
    solved: 400,
    accuracy: 90,
    badges: [
      {
        text: "Daily Streak",
        style: "background-color: #ffe0b2; color: #e65100;",
        icon: "calendar_month"
      }
    ],
    rankColor: "#5c6bc0"
  },
  {
    rank: 5,
    name: "Ayesha Malik",
    avatar: "freepik__upload__71749-512x512.jpg",
    solved: 395,
    accuracy: 87,
    badges: [
      {
        text: "Top Coder",
        style: "background-color: #dcedc8; color: #33691e;",
        icon: "grade"
      }
    ],
    rankColor: "#8e44ad"
  },
  {
    rank: 6,
    name: "Rahul Singh",
    avatar: "ava2.jpg",
    solved: 388,
    accuracy: 86,
    badges: [
      {
        text: "Problem Setter",
        style: "background-color: #fff3e0; color: #ef6c00;",
        icon: "build"
      }
    ],
    rankColor: "#2c3e50"
  },
  {
    rank: 7,
    name: "Sneha Patel",
    avatar: "ava3.jpg",
    solved: 376,
    accuracy: 84,
    badges: [
      {
        text: "Consistent Performer",
        style: "background-color: #ede7f6; color: #5e35b1;",
        icon: "leaderboard"
      }
    ],
    rankColor: "#009688"
  },
  {
    rank: 8,
    name: "Kunal Mehta",
    avatar: "ava4.jpg",
    solved: 370,
    accuracy: 83,
    badges: [
      {
        text: "100 Days Coder",
        style: "background-color: #ffe082; color: #ff6f00;",
        icon: "hourglass_bottom"
      }
    ],
    rankColor: "#1abc9c"
  },
  {
    rank: 9,
    name: "Nikita Sharma",
    avatar: "ava5.jpg",
    solved: 362,
    accuracy: 82,
    badges: [
      {
        text: "Fast Climber",
        style: "background-color: #f8bbd0; color: #c2185b;",
        icon: "trending_up"
      }
    ],
    rankColor: "#d35400"
  },
  {
    rank: 10,
    name: "Aditya Deshmukh",
    avatar: "ava2.jpg",
    solved: 355,
    accuracy: 80,
    badges: [
      {
        text: "Night Owl",
        style: "background-color: #cfd8dc; color: #37474f;",
        icon: "nights_stay"
      }
    ],
    rankColor: "#7f8c8d"
  }
];


// Function to generate table rows
function populateLeaderboard() {
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = ''; // Clear existing rows
  
  leaderboardData.forEach(user => {
    const row = document.createElement('tr');
    row.setAttribute('role', 'button');
    row.setAttribute('data-bs-toggle', 'offcanvas');
    row.setAttribute('data-bs-target', '#productModal');
    row.setAttribute('aria-controls', 'productModal');
    
    // Generate badges HTML
    const badgesHtml = user.badges.map(badge => `
      <span class="badge" style="${badge.style}">
        ${badge.icon ? `<span class="material-symbols-outlined fs-6 me-1">${badge.icon}</span>` : ''}
        ${badge.text}
      </span>
    `).join('');
    
    // Render row
    row.innerHTML = `
      <td style="width: 0px; font-weight: 600;"><span style="color: ${user.rankColor}">${user.rank}</span></td>
      <td>
        <div class="d-flex align-items-center">
          <div class="avatar text-primary">
            <img class="avatar-img" src="${user.avatar}" alt="${user.name}">
          </div>
          <div class="ms-4">
            <div style="color: ${user.rankColor || 'inherit'}; font-weight: 400;">${user.name}</div>
          </div>
        </div>
      </td>
      <td style="padding-left: 47px; color: ${user.rankColor || 'inherit'}; font-weight: 500;">${user.solved}</td>
      <td><span class="badge bg-success-subtle text-success" style="padding-left: 16.875px; padding-right: 13px;">${user.accuracy}%</span></td>
      <td style="width: 0px">
        <div class="d-flex gap-2">
          ${badgesHtml}
        </div>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}


// Call the function when the page loads
document.addEventListener('DOMContentLoaded', populateLeaderboard);

// Optional: Add search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#dataTable tbody tr');
  
  rows.forEach(row => {
    const name = row.querySelector('td:nth-child(2) div.ms-4 div').textContent.toLowerCase();
    const solved = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
    if (name.includes(searchTerm) || solved.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// Optional: Add sorting functionality
function sortTable(columnIndex, ascending) {
  leaderboardData.sort((a, b) => {
    let valA, valB;
    
    switch(columnIndex) {
      case 0: // Rank
        valA = a.rank;
        valB = b.rank;
        break;
      case 1: // Name
        valA = a.name;
        valB = b.name;
        break;
      case 2: // Solved
        valA = a.solved;
        valB = b.solved;
        break;
      case 3: // Accuracy
        valA = a.accuracy;
        valB = b.accuracy;
        break;
    }
    
    if (typeof valA === 'string') {
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return ascending ? valA - valB : valB - valA;
    }
  });
  
  populateLeaderboard();
}

