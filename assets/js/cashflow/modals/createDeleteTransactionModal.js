import { showSuccessModal } from "../../modals/successModal.js";
import { showErrorModal } from "../../modals/errorModal.js";
import {
  loadSummary,
  loadTransactions,
  deleteTransaction,
} from "../handler.js";

// Function to open the delete confirmation modal
window.openDeleteConfirmationModal = function (transactionId) {
  showDeleteConfirmationModal(transactionId);
};

// Setup delete transaction modal by adding click handlers
export function setupDeleteTransactionModal() {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.onclick = (e) => {
      const transactionId = e.target.getAttribute("data-id");
      if (transactionId) {
        openDeleteConfirmationModal(transactionId);
      }
    };
  });
}

// Function to show the delete confirmation modal
function showDeleteConfirmationModal(transactionId) {
  const modal = createModalElement();
  document.body.appendChild(modal);

  // Attach event listeners for confirmation and cancellation
  attachModalEventListeners(modal, transactionId);
}

// Create modal element with content
function createModalElement() {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50";
  modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-sm w-full">
              <h2 class="text-lg font-semibold mb-4">Confirmation</h2>
              <p class="text-gray-700 mb-6">Are you sure you want to delete this transaction?</p>
              <div class="flex justify-end space-x-2">
                <button id="cancelBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded">
                  Cancel
                </button>
                <button id="confirmBtn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                  Confirm
                </button>
              </div>
            </div>
          `;
  return modal;
}

// Attach event listeners for modal buttons
function attachModalEventListeners(modal, transactionId) {
  const confirmBtn = modal.querySelector("#confirmBtn");
  const cancelBtn = modal.querySelector("#cancelBtn");

  confirmBtn.addEventListener("click", async () => {
    await handleDeleteTransaction(transactionId, modal);
  });

  cancelBtn.addEventListener("click", () => {
    closeModal(modal);
  });
}

// Handle transaction deletion
async function handleDeleteTransaction(transactionId, modal) {
  try {
    const token = localStorage.getItem("token");
    await deleteTransaction(token, transactionId);

    closeModal(modal);
    await reloadTransactions(token); // Reload transactions after deletion
    showSuccessModal("Transaction deleted successfully!");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    showErrorModal("Failed to delete transaction. Please try again.");
  }
}

// Close modal function
function closeModal(modal) {
  document.body.removeChild(modal);
}

// Reload transactions after deletion
async function reloadTransactions(token) {
  const updatedInitialBalance = await loadSummary(token);
  await loadTransactions(token, updatedInitialBalance);
}

// Initialize the delete modal setup
setupDeleteTransactionModal();
