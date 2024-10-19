// successModal.js

export function showSuccessModal(message) {
  // Create the modal element if it doesn't exist
  let successModal = document.getElementById("successModal");
  if (!successModal) {
    successModal = document.createElement("div");
    successModal.id = "successModal";
    successModal.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "flex",
      "items-center",
      "justify-center",
      "bg-black",
      "bg-opacity-60",
      "hidden",
      "z-50"
    );

    // Create the modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add(
      "bg-white",
      "p-6",
      "rounded-lg",
      "shadow-lg",
      "text-center",
      "w-80",
      "max-w-full",
      "transition-transform",
      "transform",
      "scale-95"
    );
    modalContent.innerHTML = `
      <p class="text-lg font-semibold text-green-600 mb-2">Success</p>
      <p class="text-sm text-gray-600 mb-4" id="successMessage"></p>
      <button id="closeSuccessModal" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
        Close
      </button>
    `;

    successModal.appendChild(modalContent);
    document.body.appendChild(successModal);

    // Add animation for modal entrance
    setTimeout(() => {
      modalContent.classList.remove("scale-95");
      modalContent.classList.add("scale-100");
    }, 10);

    // Close the modal when the close button is clicked
    const closeButton = document.getElementById("closeSuccessModal");
    closeButton.addEventListener("click", () => {
      successModal.classList.add("hidden");
    });
  }

  // Set the success message
  document.getElementById("successMessage").textContent = message;

  // Show the modal
  successModal.classList.remove("hidden");
}
