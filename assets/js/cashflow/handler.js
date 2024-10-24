// handler.js

import { API_BASE_URL } from "../constant.js";

// Function to fetch cashflow summary
export async function loadSummary(token) {
  const response = await fetch(`${API_BASE_URL}/cashflow/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cashflow summary");
  }

  return response.json(); // Return the parsed JSON response
}

// Function to get initial balance from summary
export async function getInitialBalance(token) {
  const summary = await loadSummary(token);
  return summary.initial_balance;
}

export function getTokenInfo() {
  const tokenInfo = JSON.parse(
    atob(localStorage.getItem("token").split(".")[1])
  );

  return tokenInfo;
}

// Function to fetch all transactions
export async function getAllTransactions(token) {
  const response = await fetch(`${API_BASE_URL}/cashflow/getAllTransactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const transactions = await response.json();

  if (!Array.isArray(transactions)) {
    throw new Error("Transactions data is not an array");
  }

  return transactions;
}

// Function to load transactions and display them
export async function loadTransactions(token) {
  try {
    const transactions = await getAllTransactions(token);
    const initialBalance = await getInitialBalance(token);

    // Display transactions and return the final balance
    return displayTransactions(transactions, initialBalance);
  } catch (error) {
    console.error("Error loading transactions:", error);
    showErrorModal("Failed to load transactions. Please try again.");
  }
}

// Function to display transactions
export function displayTransactions(transactions, initialBalance) {
  const tokenPayload = JSON.parse(
    atob(localStorage.getItem("token").split(".")[1])
  );

  const transactionsBody = document.getElementById("transactions-body");
  transactionsBody.innerHTML = ""; // Clear existing transactions
  let finalBalance = initialBalance;

  if (transactions.length === 0) {
    transactionsBody.innerHTML = `<tr><td colspan="7" class="text-center">No transactions found.</td></tr>`;
    return finalBalance; // No transactions to display, return the initial balance
  }

  transactions.forEach((transaction, index) => {
    const isIncome = transaction.transaction_type === "income";
    finalBalance += isIncome ? transaction.amount : -transaction.amount;

    const row = `
      <tr>
        <td class="border px-4 py-2 text-center">${index + 1}</td>
        <td class="border px-4 py-2 text-center">${new Date(
          transaction.date
        ).toLocaleDateString()}</td>
        <td class="border px-4 py-2">${transaction.description}</td>
        <td class="border px-4 py-2 text-center ${
          isIncome ? "text-green-500" : ""
        }">
          ${isIncome ? transaction.amount.toLocaleString() : ""}
        </td>
        <td class="border px-4 py-2 text-center ${
          !isIncome ? "text-red-500" : ""
        }">
          ${!isIncome ? transaction.amount.toLocaleString() : ""}
        </td>
        <td class="border px-4 py-2 text-center">${finalBalance.toLocaleString()}</td>
        <td class="border px-4 py-2 text-center">
          <button class="update-btn text-blue-500 hover:underline" data-id="${
            transaction.txid
          }">Edit</button>
          <button class="delete-btn text-red-500 hover:underline ml-2" data-id="${
            transaction.txid
          }" onclick="openDeleteConfirmationModal('${
      transaction.txid
    }')">Delete</button>
        </td>
      </tr>
    `;
    transactionsBody.insertAdjacentHTML("beforeend", row);
  });

  document.getElementById("avatar-username").textContent =
    tokenPayload.username;
  document.getElementById("avatar-user-role").textContent = tokenPayload.role;
  document.getElementById(
    "initial-balance"
  ).textContent = `Rp ${initialBalance.toLocaleString()}`;
  document.getElementById(
    "final-balance"
  ).textContent = `Rp ${finalBalance.toLocaleString()}`;

  return finalBalance; // Return the final balance for further calculations if needed
}

// Function to add a new transaction
export async function addTransaction(token, data) {
  const response = await fetch(`${API_BASE_URL}/cashflow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add transaction");
  }

  return response.json(); // Return the response data if needed
}

// Function to update a transaction
export async function updateTransaction(token, transactionId, transactionData) {
  const data = {
    date: new Date(transactionData.date).toISOString(),
    description: transactionData.description,
    transaction_type: transactionData.transaction_type,
    amount: parseFloat(transactionData.amount),
  };

  const response = await fetch(`${API_BASE_URL}/cashflow/${transactionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }

  return response.json(); // Return the updated transaction data
}

// Function to delete a transaction
export async function deleteTransaction(token, transactionId) {
  const response = await fetch(`${API_BASE_URL}/cashflow/${transactionId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
}

export async function downloadTransaction() {
  // Create a full-screen modal element
  const modalOverlay = document.createElement("div");
  modalOverlay.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"; // Full-screen overlay with dim background

  const modalContent = document.createElement("div");
  modalContent.className =
    "bg-white text-black p-6 rounded shadow-lg text-center"; // Modal content styling
  modalContent.textContent = "Downloading, please wait...";

  // Append the content to the overlay
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  try {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/cashflow/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "kas-rt49.png";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
    a.remove();

    // Update the modal message for success
    modalContent.textContent = "Download completed!";
    modalContent.className =
      "bg-green-500 text-white p-6 rounded shadow-lg text-center"; // Change to success style
  } catch (error) {
    console.error("Error downloading cashflow image:", error);

    // Update the modal message for failure
    modalContent.textContent = "Failed to download. Please try again.";
    modalContent.className =
      "bg-red-500 text-white p-6 rounded shadow-lg text-center"; // Change to error style
  } finally {
    // Automatically remove the modal after 3 seconds
    setTimeout(() => {
      modalOverlay.remove();
    }, 3000);
  }
}
