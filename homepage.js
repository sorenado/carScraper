// Handle toggling of login/signup fourms 

let loginForm = document.getElementById('login-form');
let signupForm = document.getElementById('signup-form');

function toggleForm() {
  loginForm.style.display = (loginForm.style.display === 'none' || loginForm.style.display === '') ? 'block' : 'none';
  signupForm.style.display = (signupForm.style.display === 'none' || signupForm.style.display === '') ? 'block' : 'none';
}

function openLogin() {
    document.getElementsByClassName("login-window")[0].style.display = "block";
}
  
function closeLogin() {
    document.getElementsByClassName("login-window")[0].style.display = "none";
}

function changeToLogin() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
}

function changeToJoin() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
}


// Handle Signup/Login Requests
document.addEventListener('DOMContentLoaded', function() {
  const joinForm = document.getElementById('signup-form');

  joinForm.addEventListener('submit', event => {
    event.preventDefault(); 

    const name = document.getElementById('signup-form-name').value;
    const email = document.getElementById('signup-form-email').value;
    const password = document.getElementById('signup-form-password').value;

    const user = {
      user_name: name,
      email: email,
      password: password
    };

    fetch('/join-button-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(data => {
          console.log('User registered successfully:', data);
      })
      .catch(error => {
          console.error('Error registering user:', error);
      });
  });

  const verifyForm = document.getElementById('verify-btn');

  verifyForm.addEventListener('submit', event => {
    event.preventDefault(); 

    const codeInputs = document.querySelectorAll('.code');
    let codeString = '';

    codeInputs.forEach(input => {
      codeString += stringify(input.value);
    });

    fetch('/validate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(codeString)
    })
      .then(response => response.json())
      .then(data => {
          console.log('sent verification code successfully:', data);
      })
      .catch(error => {
          console.error('did not sent code successfully, :', error);
      });
  });

  // Handle Verfication Code Prompt
  document.getElementById('signup-submit').addEventListener('click', function(event) {
    event.preventDefault();

    const loginWindow = document.querySelector('.login-window-content');

    // Iterate through the children and hide them if they're not verify-form
    for (const child of loginWindow.children) {
        if (child.id !== 'verify-form') {
            child.style.display = 'none';
        }
    }


    // Ensure verify-form is visible
    const verifyForm = document.getElementById('verify-form');
    verifyForm.style.display = 'block';
  });

});
