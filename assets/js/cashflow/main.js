// Import functions from other modules
import { validateToken, logout } from "../auth.js";
import { loadTransactions, getTokenInfo, loadSummary } from "./handler.js";
import { setupAddTransactionModal } from "../cashflow/modals/createAddTransactionModal.js";
import { setupDeleteTransactionModal } from "./modals/createDeleteTransactionModal.js";
import { setupUpdateTransactionModal } from "./modals/createUpdateTransactionModal.js";

// Function to reload transactions
async function reloadTransactions() {
  const token = localStorage.getItem("token");
  await loadTransactions(token);

  // Reinitialize modal setups after transactions are reloaded
  setupDeleteTransactionModal();
  setupUpdateTransactionModal();
}

// Function to reload statistics
async function reloadStatistic(token) {
  const summary = await loadSummary(token);
  const totalTxElement = document.getElementById("total-tx");
  const amountTxElement = document.getElementById("amount-tx");
  const finalBalanceElement = document.getElementById("final-balance");

  totalTxElement.textContent = summary.total_tx;
  amountTxElement.textContent = summary.total_income + summary.total_expense;
  finalBalanceElement.textContent = summary.final_amount;
}

// Function to reload statistics
async function reloadSetting() {
  const tokenInfo = getTokenInfo();

  // Get user details from tokenInfo
  const username = tokenInfo.username;
  const role = tokenInfo.role;

  // Convert Unix timestamp to a Date object
  const formattedDate = new Date(tokenInfo.exp * 1000); // Multiply by 1000 to convert seconds to milliseconds

  // Select DOM elements for displaying user details
  const settingUsernameElement = document.getElementById("setting-username");
  const settingRoleElement = document.getElementById("setting-role"); // Corrected from "setting-username" to "setting-role"
  const settingExpElement = document.getElementById("setting-exp");

  // Update the content of the elements if they exist
  if (settingUsernameElement) {
    settingUsernameElement.textContent = username;
  } else {
    console.error("Element with ID 'setting-username' not found.");
  }

  if (settingRoleElement) {
    settingRoleElement.textContent = role;
  } else {
    console.error("Element with ID 'setting-role' not found.");
  }

  if (settingExpElement) {
    settingExpElement.textContent = formattedDate.toLocaleString();
  } else {
    console.error("Element with ID 'setting-exp' not found.");
  }
}

// Function to initialize the app
async function initializeApp() {
  if (!(await validateToken())) {
    window.location.href = "login.html";
    return;
  }

  document.body.style.display = "block"; // Show the body after token validation

  // Load the default content and handle any errors
  await loadContentFromHTML("section/transaction.html");

  // Set up modal functionality
  setupModalFunctions();
}

// Function to set up modal functionality
function setupModalFunctions() {
  setupAddTransactionModal();
  setupDeleteTransactionModal();
  setupUpdateTransactionModal();
}

// Event listener for the logout button
document.getElementById("logoutButton").addEventListener("click", async () => {
  await logout(); // Perform the logout
  window.location.href = "login.html"; // Redirect to the login page
});

// Document ready event
document.addEventListener("DOMContentLoaded", initializeApp);

// Function to fetch and update main content from an HTML file
async function loadContentFromHTML(filePath) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.text();
    document.getElementById("main-content").innerHTML = data;

    // Reload transactions or statistics based on the loaded file
    if (filePath === "section/transaction.html") {
      await reloadTransactions();
    } else if (filePath === "section/statistic.html") {
      await reloadStatistic(token);
    } else if (filePath === "section/setting.html") {
      await reloadSetting();
    }
  } catch (error) {
    console.error("Error loading content:", error);
  }
}

// Event listeners for loading different content sections
document.getElementById("transactions-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContentFromHTML("section/transaction.html");
});

document.getElementById("statistic-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContentFromHTML("section/statistic.html");
});

document.getElementById("settings-link").addEventListener("click", (e) => {
  e.preventDefault();
  loadContentFromHTML("section/setting.html");
});
