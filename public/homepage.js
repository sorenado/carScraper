// Handle toggling of login/signup fourms

let loginForm = document.getElementById("login-form");
let signupForm = document.getElementById("signup-form");

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

const signUpSubmissionBtn = document.getElementById("signup-submit");
signUpSubmissionBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default form submission
  signUpSubmission();
});

function signUpSubmission() {
  // Get references to the form elements
  const name = document.getElementById("signup-form-name").value;
  const email = document.getElementById("signup-form-email").value;
  const password = document.getElementById("signup-form-password").value;

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
    .then((response) => response.json())
    .then((data) => {
      console.log("User registered successfully:", data);
      // You can handle the server's response here
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      // Handle any errors that occur during the fetch
    });
}
