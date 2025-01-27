let editingMedicineId = null;

document.addEventListener("DOMContentLoaded", function () {
  loadMedicines();

  const medicineForm = document.getElementById("medicineForm");
  medicineForm.addEventListener("submit", addOrUpdateMedicine);
});

async function loadMedicines() {
  const response = await fetch("/medicines");
  const medicines = await response.json();

  const medicineTable = document.getElementById("medicineTable");
  medicineTable.innerHTML = "";

  medicines.forEach((medicine) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${medicine.medicine_id}</td>
      <td>${medicine.medicine_name}</td>
      <td>${medicine.price}</td>
      <td>${medicine.quantity}</td>
      <td>
        <button onclick="editMedicine('${medicine.medicine_id}')">Edit</button>
        <button onclick="deleteMedicine('${medicine.medicine_id}')">Delete</button>
      </td>
    `;
    medicineTable.appendChild(row);
  });
}

function validateMedicineForm(medicine_id) {
  const idRegex = /^MED\d{3}$/;

  if (!idRegex.test(medicine_id)) {
    alert("Medicine ID must be in the format MED001.");
    return false;
  }

  return true;
}

async function addOrUpdateMedicine(event) {
  event.preventDefault();

  const medicine_id = document.getElementById("medicine_id").value;
  const medicine_name = document.getElementById("medicine_name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  if (!validateMedicineForm(medicine_id)) {
    return;
  }

  const medicine = { medicine_id, medicine_name, price, quantity };

  let response;
  if (editingMedicineId) {
    response = await fetch(`/medicines/${editingMedicineId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicine),
    });
  } else {
    response = await fetch("/medicines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicine),
    });
  }

  if (response.ok) {
    loadMedicines();
    document.getElementById("medicineForm").reset();
    editingMedicineId = null;
  } else {
    console.log("Failed to save medicine.");
  }
}

async function editMedicine(id) {
  const response = await fetch(`/medicines/${id}`);
  const medicine = await response.json();

  document.getElementById("medicine_id").value = medicine.medicine_id;
  document.getElementById("medicine_name").value = medicine.medicine_name;
  document.getElementById("price").value = medicine.price;
  document.getElementById("quantity").value = medicine.quantity;

  editingMedicineId = medicine.medicine_id;
}

async function deleteMedicine(id) {
  const response = await fetch(`/medicines/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    loadMedicines();
  }
}
