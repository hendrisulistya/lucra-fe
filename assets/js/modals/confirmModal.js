// confirmModal.js

export function showConfirmModal(message, onConfirm) {
  // Create a modal container
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50";

  // Create the modal content
  modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 class="text-lg font-semibold mb-4">Confirmation</h2>
        <p class="text-gray-700 mb-6">${message}</p>
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

  // Append the modal to the body
  document.body.appendChild(modal);

  // Event listeners for buttons
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  confirmBtn.addEventListener("click", () => {
    onConfirm(closeModal); // Pass the closeModal function to onConfirm
  });

  cancelBtn.addEventListener("click", () => {
    closeModal();
  });

  // Close modal function
  function closeModal() {
    document.body.removeChild(modal);
  }
}
