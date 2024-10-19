// utils.js
export function showError(message, errorElementId) {
  const errorElement = document.getElementById(errorElementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  } else {
    console.error(`Element with ID "${errorElementId}" not found.`);
  }
}
