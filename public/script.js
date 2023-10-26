// Password show functionality
const registerPassword = document.getElementById("register-password");
const loginPassword = document.getElementById("login-password");

function togglePasswordVisibility(input) {
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);
}

document.querySelectorAll(".password-toggle-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const formId = btn.getAttribute("data-form");
    const passwordInput = document.getElementById(`${formId}-password`);
    togglePasswordVisibility(passwordInput);
  });
});

const successfulLogin = true; // Set it to true or false depending on your actual logic
if (successfulLogin) {
  document.getElementById("map").style.display = "block";
}
