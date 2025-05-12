
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const signInForm = document.querySelector('#signinModal form');
    const signUpForm = document.querySelector('#signupModal form');
    const userNameElements = document.querySelectorAll('#content h1, .dropdown-toggle');

    let currentUser = null;

    // Generate a random avatar URL
    function getRandomAvatar() {
        const gender = Math.random() > 0.5 ? 'men' : 'women';
        const number = Math.floor(Math.random() * 100);
        return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
    }

    // Update UI with user info
    function updateUserUI(user) {
        userNameElements.forEach(element => {
            if (element.tagName === 'H1') {
                element.textContent = `Hello! ${user.name}`;
            } else {
                const nameSpan = element.querySelector('span:not(.avatar)');
                if (nameSpan) {
                    nameSpan.textContent = user.name;
                } else {
                    const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                    if (textNodes.length > 0) {
                        textNodes[0].textContent = user.name;
                    }
                }
            }
        });

        const avatarImg = document.querySelector('.avatar-img');
        if (avatarImg) {
            avatarImg.src = user.avatar || 'default-avatar.jpg';
        }
    }

    // Sign In Handler
    if (signInForm) {
        signInForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = signInForm.querySelector('input[type="email"]').value;
            const password = signInForm.querySelector('input[type="password"]').value;

            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            currentUser = {
                name: email.split('@')[0],
                email,
                avatar: getRandomAvatar()
            };

            updateUserUI(currentUser);
            $('#signinModal').modal('hide');
            alert(`Welcome back, ${currentUser.name}!`);
        });

        const forgotPasswordLink = signInForm.querySelector('.forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function (e) {
                e.preventDefault();
                alert('Password reset functionality would go here');
            });
        }

        const goToSignUp = signInForm.querySelector('.go-to-signup');
        if (goToSignUp) {
            goToSignUp.addEventListener('click', function (e) {
                e.preventDefault();
                $('#signinModal').modal('hide');
                $('#signupModal').modal('show');
            });
        }
    }

    // Sign Up Handler
    if (signUpForm) {
        signUpForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = signUpForm.querySelector('input[type="text"]').value;
            const email = signUpForm.querySelector('input[type="email"]').value;
            const password = signUpForm.querySelectorAll('input[type="password"]')[0].value;
            const confirmPassword = signUpForm.querySelectorAll('input[type="password"]')[1].value;

            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (password.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }

            currentUser = {
                name,
                email,
                avatar: getRandomAvatar()
            };

            updateUserUI(currentUser);
            $('#signupModal').modal('hide');
            alert(`Welcome to Classroom, ${currentUser.name}!`);
        });

        const goToSignIn = signUpForm.querySelector('.go-to-signin');
        if (goToSignIn) {
            goToSignIn.addEventListener('click', function (e) {
                e.preventDefault();
                $('#signupModal').modal('hide');
                $('#signinModal').modal('show');
            });
        }
    }

    // Clear form on modal close
    $('.modal').on('hidden.bs.modal', function () {
        const form = this.querySelector('form');
        if (form) form.reset();
    });
});

