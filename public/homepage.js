// Handle toggling of login/signup fourms

let loginForm = document.getElementById("login-form");
let signupForm = document.getElementById("signup-form");
const fieldIssuesDiv = document.getElementById('fieldIssues');

function toggleForm() {
  loginForm.style.display =
    loginForm.style.display === "none" || loginForm.style.display === ""
      ? "block"
      : "none";
  signupForm.style.display =
    signupForm.style.display === "none" || signupForm.style.display === ""
      ? "block"
      : "none";
}

function applyOverlay() {
  const body = document.querySelector('body');

  if (!body.classList.contains('overlay')) {
    body.classList.add('overlay');
  }
}

function removeOverlay() {
  const body = document.querySelector('body');

  if (body.classList.contains('overlay')) {
    body.classList.remove('overlay');
  }
}

function openLogin() {
  document.getElementsByClassName("login-window")[0].style.display = "block";
  document.getElementById("login-form").style.display = "block";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("verifyPopup").style.display = "none";

  applyOverlay();
}

function openSignUp() {
  document.getElementsByClassName("login-window")[0].style.display = "block";
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
  document.getElementById("verifyPopup").style.display = "none";

  applyOverlay();
}

function closeLogin() {
  document.getElementsByClassName("login-window")[0].style.display = "none";

  removeOverlay();
}

function shakeButton(btn) {
  const button = document.getElementById(btn);
  button.classList.add('shake-button');

  button.addEventListener('animationend', () => {
    button.classList.remove('shake-button');
  });
}

document.addEventListener('click', function(event) {
  const body = document.querySelector('body');
  const overlay = document.getElementById('overlay');

  if (event.target === overlay) {
    popup.style.display = 'none';
    body.classList.remove('overlay');
  }
});

const signUpSubmissionBtn = document.getElementById("signup-submit");
signUpSubmissionBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default form submission
  
  const name = document.getElementById("signup-form-name").value;
  const email = document.getElementById("signup-form-email").value;
  const password = document.getElementById("signup-form-password").value;


  if (name.length < 1 || email.length < 1 || password.length < 1) {
    fieldIssuesDiv.innerHTML = "Please make sure that you have entered a value for your name, email, and password."
    shakeButton('signup-submit');
  }

  if (name.length > 1 && email.length > 1 && password.length > 1) {
    fieldIssuesDiv.innerHTML = ""
  }

  if (fieldIssuesDiv.innerHTML === "" ) {
    signUpSubmission(name, email, password);
  }

});

function signUpSubmission(name, email, password) {
  console.log('ran function ')
  // Create a data object to send to the server
  const user = {
    name: name,
    email: email,
    password: password,
  };

  // Send the data to the server using the Fetch API
  fetch("/join-button-form", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 409) {
        fieldIssuesDiv.innerHTML = "An account with that email already exists. Please use a different email or <a onclick='openLogin()'>login</a>.";
        shakeButton('signup-submit');
        return Promise.reject(new Error("Account already exists"));
      } else if (!response.ok) {
        throw new Error("An error occurred. Please try again later.");
      }
    
      // Return the response as text
      return response.text(); 
    })
    .then((data) => {
      if (data === "OK") {
        console.log("User registered successfully.");
        openVerifyPane();
      } else {
        // Handle the response data based on your requirements
        console.log("Unexpected response:", data);
      }
    })
    .catch((error) => {
      // Handle errors, including 409 case
      if (error.message !== "Account already exists") {
        console.error("Error registering user:", error);
      }
    });
}




function openVerifyPane() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("verifyPopup").style.display = "block";
}