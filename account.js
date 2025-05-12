// account.js
document.addEventListener('DOMContentLoaded', function() {
  // Load data from localStorage or use default
  let savedData = localStorage.getItem('accountData');
  let userData = savedData ? JSON.parse(savedData).user : defaultAccountData.user;
  
  // Save default data if it doesn't exist
  if (!savedData) {
    localStorage.setItem('accountData', JSON.stringify(defaultAccountData));
  }

  // DOM elements
  const editBtn = document.querySelector('.btn-light');
  const deleteBtn = document.querySelector('.btn-danger');
  const avatarImg = document.getElementById('avatar-img');
  const userName = document.getElementById('user-name');
  const userTitle = document.getElementById('user-title');
  const userBio = document.getElementById('user-bio');
  const userEmail = document.getElementById('user-email');
  const userPhone = document.getElementById('user-phone');
  const avatarUpload = document.getElementById('avatar-upload-input');
  const avatarUploadBtn = document.getElementById('avatar-upload-btn');
  const editableFields = [userName, userTitle, userBio, userEmail, userPhone];

  // Initialize the page
  loadUserData();

  // Edit button click handler
  editBtn.addEventListener('click', function() {
    if (editBtn.textContent === 'Edit') {
      enableEditMode();
    } else {
      saveChanges();
    }
  });

  // Delete button click handler
  deleteBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete your account data? This cannot be undone.')) {
      localStorage.removeItem('accountData');
      userData = defaultAccountData.user; // Reset to default
      localStorage.setItem('accountData', JSON.stringify(defaultAccountData)); // Save default
      loadUserData(); // Reload default data
      disableEditMode(); // Ensure edit mode is disabled
      showToast('Account data has been reset to default.');
    }
  });

  // Avatar change handler
  if (avatarUploadBtn && avatarUpload) {
    avatarUploadBtn.addEventListener('click', function() {
      avatarUpload.click(); // Trigger file input
    });

    avatarUpload.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const newAvatar = e.target.result; // Base64 string
          avatarImg.src = newAvatar; // Update UI
          userData.avatar = newAvatar; // Update userData
          // Save to localStorage immediately
          const updatedData = {
            user: {
              name: userName.value,
              title: userTitle.value,
              bio: userBio.value,
              email: userEmail.value,
              phone: userPhone.value,
              avatar: newAvatar
            }
          };
          localStorage.setItem('accountData', JSON.stringify(updatedData));
          showToast('Avatar updated successfully!');
        };
        reader.readAsDataURL(file); // Convert image to base64
      } else {
        showToast('Please select a valid image file.');
      }
      // Reset file input to allow re-uploading the same file
      avatarUpload.value = '';
    });
  }

  // Load user data into form
  function loadUserData() {
    const currentData = JSON.parse(localStorage.getItem('accountData')).user;
    userName.value = currentData.name || '';
    userTitle.value = currentData.title || '';
    userBio.value = currentData.bio || '';
    userEmail.value = currentData.email || '';
    userPhone.value = currentData.phone || '';
    avatarImg.src = currentData.avatar || '1.jpg'; // Fallback to default avatar
  }

  // Enable edit mode
  function enableEditMode() {
    editableFields.forEach(field => {
      field.readOnly = false;
      field.classList.add('bg-body', 'border', 'px-2');
      field.classList.remove('bg-transparent', 'border-0', 'px-0');
    });
    
    // Show avatar upload button
    if (avatarUploadBtn) {
      avatarUploadBtn.style.display = 'flex';
    }
    
    editBtn.textContent = 'Save';
    editBtn.classList.remove('btn-light');
    editBtn.classList.add('btn-primary');
  }

  // Disable edit mode
  function disableEditMode() {
    editableFields.forEach(field => {
      field.readOnly = true;
      field.classList.remove('bg-body', 'border', 'px-2');
      field.classList.add('bg-transparent', 'border-0', 'px-0');
    });
    
    // Hide avatar upload button
    if (avatarUploadBtn) {
      avatarUploadBtn.style.display = 'none';
    }
    
    editBtn.textContent = 'Edit';
    editBtn.classList.remove('btn-primary');
    editBtn.classList.add('btn-light');
  }

  // Save changes
  function saveChanges() {
    const updatedData = {
      user: {
        name: userName.value,
        title: userTitle.value,
        bio: userBio.value,
        email: userEmail.value,
        phone: userPhone.value,
        avatar: userData.avatar
      }
    };
    
    localStorage.setItem('accountData', JSON.stringify(updatedData));
    userData = updatedData.user;
    disableEditMode();
    showToast('Changes saved successfully!');
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '1050';
    toast.innerHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
});