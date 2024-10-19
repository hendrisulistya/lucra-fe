// modal.js

// Function to setup modal handlers
export function setupModalHandlers() {
  // Add Transaction Modal
  const addModal = document.getElementById("addTransactionModal");
  const openAddModalBtn = document.getElementById("openAddModalBtn");
  const closeAddModalBtn = document.getElementById("closeAddModal");
  const transactionForm = document.getElementById("transactionForm");

  openAddModalBtn.addEventListener("click", () => {
    addModal.classList.remove("hidden");
  });

  closeAddModalBtn.addEventListener("click", () => {
    addModal.classList.add("hidden");
  });

  // Handle form submission for Add Transaction
  transactionForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const date = document.getElementById("addDate").value;
    const description = document.getElementById("addDescription").value;
    const transactionType = document.getElementById("addTransactionType").value;
    const amount = document.getElementById("addAmount").value;

    // Check if any fields are empty
    if (!date || !description || !transactionType || !amount) {
      alert("Semua field harus diisi");
      return;
    }

    // Create a new transaction object
    const newTransaction = {
      date,
      description,
      transactionType,
      amount: parseFloat(amount),
    };

    try {
      console.log("New Transaction:", newTransaction);

      // Reset the form
      transactionForm.reset();

      // Hide the modal
      addModal.classList.add("hidden");

      // Display success message
      alert("Transaksi berhasil ditambahkan");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Gagal menambahkan transaksi. Silakan coba lagi.");
    }
  });

  // Close Add Modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === addModal) {
      addModal.classList.add("hidden");
    }
  });

  // Edit Transaction Modal
  const editModal = document.getElementById("editTransactionModal");
  const closeEditModalBtn = document.getElementById("closeEditModal");

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const transactionId = event.target.dataset.id;
      // Populate the modal fields with transaction data (fetch data here)
      document.getElementById("editDate").value = ""; // Populate with actual data
      document.getElementById("editDescription").value = ""; // Populate with actual data
      document.getElementById("editTransactionType").value = ""; // Populate with actual data
      document.getElementById("editAmount").value = ""; // Populate with actual data

      editModal.classList.remove("hidden");
    });
  });

  closeEditModalBtn.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

  // Delete Transaction Modal
  const deleteModal = document.getElementById("deleteTransactionModal");
  const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const transactionId = event.target.dataset.id;
      confirmDeleteBtn.dataset.id = transactionId;

      deleteModal.classList.remove("hidden");
    });
  });

  closeDeleteModalBtn.addEventListener("click", () => {
    deleteModal.classList.add("hidden");
  });

  confirmDeleteBtn.addEventListener("click", () => {
    const transactionId = confirmDeleteBtn.dataset.id;
    deleteTransaction(transactionId);
    deleteModal.classList.add("hidden");
  });
}

// Function to delete transaction (stub implementation)
function deleteTransaction(transactionId) {
  console.log(`Deleting transaction with ID: ${transactionId}`);
}
