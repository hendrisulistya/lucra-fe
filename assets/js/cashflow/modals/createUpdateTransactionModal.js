import { showSuccessModal } from "../../modals/successModal.js";
import { showErrorModal } from "../../modals/errorModal.js";
import {
  loadSummary,
  loadTransactions,
  updateTransaction,
} from "../handler.js";

// Function to open the update transaction modal
window.openUpdateModal = function (transactionId, transactionData) {
  showUpdateTransactionModal(transactionId, transactionData);
};

// Show the update transaction modal
export async function showUpdateTransactionModal(
  transactionId,
  transactionData
) {
  // Close any existing modal before creating a new one
  const existingModal = document.querySelector(".fixed.inset-0");
  if (existingModal) {
    closeModal(existingModal);
  }

  const modal = createModalElement(transactionData);
  document.body.appendChild(modal);

  // Attach event listeners for the update and cancel buttons
  attachModalEventListeners(modal, transactionId);
}

// Create modal element with content
function createModalElement(transactionData) {
  const formattedDate = formatDateForInput(transactionData.date); // Format the date

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50";
  modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full">
          <h2 class="text-lg font-semibold mb-4">Update Transaction</h2>
          <form id="updateTransactionForm">
            <div class="mb-4">
              <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="date" value="${formattedDate}" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" required>
            </div>
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" id="description" value="${
                transactionData.description
              }" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" required>
            </div>
            <div class="mb-4">
              <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" id="amount" value="${
                transactionData.amount
              }" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" required>
            </div>
            <div class="mb-4">
              <label for="transactionType" class="block text-sm font-medium text-gray-700">Transaction Type</label>
              <select id="transactionType" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" required>
                <option value="income" ${
                  transactionData.transaction_type === "income"
                    ? "selected"
                    : ""
                }>Income</option>
                <option value="expense" ${
                  transactionData.transaction_type === "expense"
                    ? "selected"
                    : ""
                }>Expense</option>
              </select>
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancelBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded">Cancel</button>
              <button type="submit" id="updateBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Update</button>
            </div>
          </form>
        </div>
      `;
  return modal;
}

// Attach event listeners for modal buttons
function attachModalEventListeners(modal, transactionId) {
  const updateForm = modal.querySelector("#updateTransactionForm");
  const cancelBtn = modal.querySelector("#cancelBtn");

  // Handle form submission
  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleUpdateTransaction(transactionId, modal);
  });

  // Handle cancel button
  cancelBtn.addEventListener("click", () => {
    closeModal(modal);
  });
}

// Setup update transaction modal by adding click handlers
export function setupUpdateTransactionModal() {
  const updateButtons = document.querySelectorAll(".update-btn");

  updateButtons.forEach((button) => {
    // Remove any previous click event listeners to avoid duplicates
    button.onclick = async (e) => {
      const transactionId = e.target.getAttribute("data-id");

      // Fetch transaction data with error handling
      try {
        const transactionData = await fetchTransactionData(transactionId);
        if (transactionId && transactionData) {
          openUpdateModal(transactionId, transactionData);
        } else {
          console.error("No transaction data found.");
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        showErrorModal("Failed to load transaction data. Please try again.");
      }
    };
  });
}

// Fetch transaction data by ID (You should implement this based on your API structure)
async function fetchTransactionData(transactionId) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:8080/cashflow/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    console.error("Failed to fetch transaction data:", response.status);
    showErrorModal("Failed to load transaction data. Please try again.");
    return null;
  }
}

// Handle transaction update
async function handleUpdateTransaction(transactionId, modal) {
  const description = modal.querySelector("#description").value;
  const amount = parseFloat(modal.querySelector("#amount").value);
  const transactionType = modal.querySelector("#transactionType").value;
  const date = modal.querySelector("#date").value;

  const updatedTransaction = {
    description,
    amount,
    transaction_type: transactionType,
    date,
  };

  try {
    const token = localStorage.getItem("token");
    await updateTransaction(token, transactionId, updatedTransaction);

    closeModal(modal);

    const updatedInitialBalance = await loadSummary(token);
    await loadTransactions(token, updatedInitialBalance); // Reload transactions after updating

    showSuccessModal("Transaction updated successfully!");

    // Re-attach event listeners to update buttons after closing modal
    setupUpdateTransactionModal(); // Ensure this is called after the transactions are reloaded
  } catch (error) {
    console.error("Error updating transaction:", error);
    showErrorModal("Failed to update transaction. Please try again.");
  }
}

// Function to clear modal input fields
function clearModalFields(modal) {
  modal.querySelector("#description").value = "";
  modal.querySelector("#amount").value = "";
  modal.querySelector("#transactionType").value = ""; // Set to default if needed
  modal.querySelector("#date").value = "";
}

// Close modal function
function closeModal(modal) {
  modal.removeEventListener("submit", handleUpdateTransaction); // Remove any event listeners attached to the modal
  document.body.removeChild(modal);
}

// Function to convert ISO date string to "yyyy-MM-dd" format
function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
