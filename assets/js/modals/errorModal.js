// errorModal.js

export function showErrorModal(message) {
  // Create the modal element if it doesn't exist
  let errorModal = document.getElementById("errorModal");
  if (!errorModal) {
    errorModal = document.createElement("div");
    errorModal.id = "errorModal";
    errorModal.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "flex",
      "items-center",
      "justify-center",
      "bg-gray-900",
      "bg-opacity-50",
      "hidden"
    );

    // Create the modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add("bg-white", "p-5", "rounded", "shadow-lg");
    modalContent.innerHTML = `
        <p id="errorMessage"></p>
        <button id="closeErrorModal" class="mt-4 text-blue-500 hover:underline">Close</button>
      `;

    errorModal.appendChild(modalContent);
    document.body.appendChild(errorModal);

    // Close the modal when the close button is clicked
    const closeButton = document.getElementById("closeErrorModal");
    closeButton.addEventListener("click", () => {
      errorModal.classList.add("hidden");
    });
  }

  // Set the error message
  document.getElementById("errorMessage").textContent = message;

  // Show the modal
  errorModal.classList.remove("hidden");
}
