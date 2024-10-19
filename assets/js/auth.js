// auth.js
import { API_BASE_URL } from "./constant.js";

export async function validateToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return false; // No token, not valid
  }

  try {
    const response = await fetch(`${API_BASE_URL}/validate-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token as Bearer token
      },
    });

    if (!response.ok) {
      throw new Error("Token validation failed");
    }

    const data = await response.json();
    return data.valid; // Return the validity status
  } catch (error) {
    console.error("Error during token validation:", error);
    return false; // Assume not valid on error
  }
}

export async function logout() {
  // Clear token
  localStorage.removeItem("token");

  // Check if the token is removed
  const isTokenRemoved = !localStorage.getItem("token");

  if (isTokenRemoved) {
    showLogoutModal();
  }

  // Redirect to login page
  window.location.href = "login.html";
}

// Function to show logout modal
function showLogoutModal() {
  // Create modal element
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50";

  // Modal content
  const modalContent = document.createElement("div");
  modalContent.className = "bg-white rounded-lg p-5 text-center";
  modalContent.innerHTML = `
    <p class="text-lg">You have logged out successfully!</p>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Automatically remove the modal after 2 seconds
  setTimeout(() => {
    document.body.removeChild(modal);
  }, 5000);
}
