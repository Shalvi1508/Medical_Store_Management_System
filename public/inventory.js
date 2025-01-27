let editingInventoryId = null;

document.addEventListener("DOMContentLoaded", function () {
  loadInventory();
  loadMedicinesDropdown();

  const inventoryForm = document.getElementById("inventoryForm");
  inventoryForm.addEventListener("submit", addOrUpdateInventory);
});

async function loadInventory() {
  const response = await fetch("/inventory");
  const inventoryItems = await response.json();

  const inventoryTable = document.getElementById("inventoryTable");
  inventoryTable.innerHTML = "";

  inventoryItems.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.inventory_id}</td>
            <td>${item.medicine_name}</td>
            <td>${item.quantity}</td>
            <td>
                <button onclick="editInventory('${item.inventory_id}')">Edit</button>
                <button onclick="deleteInventory('${item.inventory_id}')">Delete</button>
            </td>
        `;
    inventoryTable.appendChild(row);
  });
}

async function loadMedicinesDropdown() {
  const response = await fetch("/medicines");
  const medicines = await response.json();

  const medicineDropdown = document.getElementById("medicine_name");
  medicineDropdown.innerHTML = "";

  medicines.forEach((medicine) => {
    const option = document.createElement("option");
    option.value = medicine.medicine_name;
    option.text = medicine.medicine_name;
    medicineDropdown.appendChild(option);
  });
}

function validateInventoryForm(inventory_id) {
  const idRegex = /^INV\d{3}$/;

  if (!idRegex.test(inventory_id)) {
    alert("Inventory ID must be in the format INV001.");
    return false;
  }

  return true;
}

async function addOrUpdateInventory(event) {
  event.preventDefault();

  const inventory_id = document.getElementById("inventory_id").value;
  const medicine_name = document.getElementById("medicine_name").value;
  const quantity = document.getElementById("quantity").value;

  const inventory = { inventory_id, medicine_name, quantity };

  if (!validateInventoryForm(inventory_id)) {
    return;
  }

  let response;
  if (editingInventoryId) {
    response = await fetch(`/inventory/${editingInventoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inventory),
    });
  } else {
    response = await fetch("/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inventory),
    });
  }

  if (response.ok) {
    loadInventory();
    document.getElementById("inventoryForm").reset();
    editingInventoryId = null;
  } else {
    console.log("Failed to save inventory.");
  }
}
async function editInventory(id) {
  const response = await fetch(`/inventory/${id}`);
  const inventory = await response.json();

  document.getElementById("inventory_id").value = inventory.inventory_id;
  document.getElementById("medicine_name").value = inventory.medicine_name;
  document.getElementById("quantity").value = inventory.quantity;

  editingInventoryId = inventory.inventory_id;
}

async function deleteInventory(id) {
  const response = await fetch(`/inventory/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    loadInventory();
  }
}
