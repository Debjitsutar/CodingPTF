document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('dataTable');
    const rows = table.querySelectorAll('tbody tr');
    
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(2)'); // Name column
        if (nameCell) {
          const nameText = nameCell.textContent.toLowerCase();
          row.style.display = nameText.includes(searchTerm) ? '' : 'none';
        }
      });
    });
  });