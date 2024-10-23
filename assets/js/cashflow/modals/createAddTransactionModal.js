import { loadSummary, loadTransactions, addTransaction } from "../handler.js";
import { showSuccessModal } from "../../modals/successModal.js";
import { showErrorModal } from "../../modals/errorModal.js";

function formatNumberWithCommas(numberString) {
  // Convert the string to a number, then format it with commas
  const number = parseInt(numberString, 10);

  if (isNaN(number)) return ""; // Return an empty string if the input is not a valid number

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function setupAddTransactionModal() {
  // Create the modal elements
  const addModal = document.createElement("div");
  addModal.id = "createTransactionModal";
  addModal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden";

  const modalContent = document.createElement("div");
  modalContent.className =
    "bg-white rounded-lg p-6 w-full max-w-md mx-4 md:w-1/3"; // Updated for responsiveness

  const closeModalBtn = document.createElement("button");
  closeModalBtn.id = "closeModalBtn";
  closeModalBtn.className =
    "close-modal absolute top-4 right-4 text-gray-500 hover:text-gray-800";
  closeModalBtn.innerHTML = "&times;";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-4 text-center"; // Center the title for better mobile appearance
  title.textContent = "Tambah Data Transaksi";

  const addTransactionForm = document.createElement("form");
  addTransactionForm.id = "transactionForm";

  // Create form fields
  const fields = [
    { label: "Tanggal", type: "date", name: "date", required: true },
    { label: "Keterangan", type: "text", name: "description", required: true },
    {
      label: "Jenis Transaksi",
      type: "select",
      name: "transactionType",
      options: [
        { value: "income", text: "Pemasukan" },
        { value: "expense", text: "Pengeluaran" },
      ],
      required: true,
    },
    {
      label: "Jumlah",
      type: "text",
      name: "amount",
      required: true,
    },
  ];

  fields.forEach((field) => {
    const fieldContainer = document.createElement("div");
    fieldContainer.className = "mb-4";

    const label = document.createElement("label");
    label.htmlFor = field.name;
    label.className = "block text-sm font-medium text-gray-700";
    label.textContent = field.label;

    let input;
    if (field.type === "select") {
      input = document.createElement("select");
      input.name = field.name;
      input.id = field.name;
      input.className =
        "block mt-1 p-2 w-full border border-gray-300 rounded-md";

      // Adding a relative class to the parent container to position the dropdown correctly
      const fieldContainer = document.createElement("div");
      fieldContainer.className = "mb-4 relative";

      // Create and append each option to the select element
      field.options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        input.appendChild(opt);
      });

      // Append the label and select input to the container
      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      addTransactionForm.appendChild(fieldContainer);
    } else {
      input = document.createElement("input");
      input.type = field.type;
      input.name = field.name;
      input.id = field.name;
      input.className = "mt-1 p-2 w-full border border-gray-300 rounded-md";
      if (field.required) input.required = true;
      if (field.label === "Jumlah") {
        input.maxLength = 10;
        input.addEventListener("input", (e) => {
          const value = e.target.value.replace(/[^0-9]/g, "");
          const limitedValue = value.slice(0, 10);
          e.target.value = formatNumberWithCommas(limitedValue);
        });
      }
    }

    fieldContainer.appendChild(label);
    fieldContainer.appendChild(input);
    addTransactionForm.appendChild(fieldContainer);
  });

  // Create buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex justify-end space-x-2";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "bg-gray-500 text-white px-4 py-2 rounded-lg";
  cancelButton.textContent = "Batal";

  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.className = "bg-blue-700 text-white px-4 py-2 rounded-lg";
  saveButton.textContent = "Simpan";

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(saveButton);
  addTransactionForm.appendChild(buttonContainer);

  modalContent.appendChild(closeModalBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(addTransactionForm);
  addModal.appendChild(modalContent);
  document.body.appendChild(addModal);

  // Open the Add Transaction modal
  const openAddModalBtn = document.getElementById("btnAddTransaction");
  openAddModalBtn.addEventListener("click", () => {
    addModal.classList.remove("hidden");
  });

  // Close the modal when the close button or cancel button is clicked
  closeModalBtn.addEventListener("click", () => {
    addModal.classList.add("hidden");
  });

  // Handle form submission
  addTransactionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = addTransactionForm.date.value;
    const description = addTransactionForm.description.value;
    const transaction_type = addTransactionForm.transactionType.value;
    const rawAmount = addTransactionForm.amount.value.replace(/,/g, "");
    const amount = parseFloat(rawAmount);

    const newTransaction = {
      date,
      description,
      transaction_type,
      amount,
    };

    try {
      const token = localStorage.getItem("token");
      await addTransaction(token, newTransaction);
      addTransactionForm.reset();
      addModal.classList.add("hidden");
      const initialBalance = await loadSummary(token);
      await loadTransactions(token, initialBalance);
      showSuccessModal("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      showErrorModal("Failed to add transaction. Please try again.");
    }
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === addModal) {
      addModal.classList.add("hidden");
    }
  });

  // Cancel button functionality
  cancelButton.addEventListener("click", () => {
    addModal.classList.add("hidden");
  });
}

// Exporting a specific function to open the modal
export function openAddTransactionModal() {
  const addModal = document.getElementById("createTransactionModal");
  addModal.classList.remove("hidden");
}
