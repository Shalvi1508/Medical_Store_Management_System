let editingPharmacistId = null;

document.addEventListener("DOMContentLoaded", function () {
  loadPharmacists();

  const pharmacistForm = document.getElementById("pharmacistForm");
  pharmacistForm.addEventListener("submit", addOrUpdatePharmacist);
});

async function loadPharmacists() {
  const response = await fetch("/pharmacists");
  const pharmacists = await response.json();

  const pharmacistTable = document.getElementById("pharmacistTable");
  pharmacistTable.innerHTML = "";

  pharmacists.forEach((pharmacist) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${pharmacist.pharmacist_id}</td>
            <td>${pharmacist.pharmacist_name}</td>
            <td>${pharmacist.phone_number}</td>
            <td>${pharmacist.address}</td>
            <td>
                <button onclick="editPharmacist('${pharmacist._id}')">Edit</button>
                <button onclick="deletePharmacist('${pharmacist._id}')">Delete</button>
            </td>
        `;
    pharmacistTable.appendChild(row);
  });
}

function validatePharmacistForm(pharmacist_id, phone_number, pharmacists) {
  const idRegex = /^PHARM\d{3}$/;
  const phoneRegex = /^\d{10}$/;

  if (!idRegex.test(pharmacist_id)) {
    alert("Pharmacist ID must be in the format PHAR001.");
    return false;
  }

  if (
    pharmacists.some(
      (pharmacist) =>
        pharmacist.pharmacist_id === pharmacist_id &&
        pharmacist._id !== editingPharmacistId
    )
  ) {
    alert("Pharmacist ID already exists.");
    return false;
  }

  if (!phoneRegex.test(phone_number)) {
    alert("Phone number must be a 10-digit positive number.");
    return false;
  }

  return true;
}

async function addOrUpdatePharmacist(event) {
  event.preventDefault();

  const pharmacist_id = document.getElementById("pharmacist_id").value;
  const pharmacist_name = document.getElementById("pharmacist_name").value;
  const phone_number = document.getElementById("phone_number").value;
  const address = document.getElementById("address").value;

  const pharmacist = { pharmacist_id, pharmacist_name, phone_number, address };

  try {
    const response = await fetch("/pharmacists");
    const pharmacists = await response.json();

    if (!validatePharmacistForm(pharmacist_id, phone_number, pharmacists)) {
      return;
    }

    let saveResponse;
    if (editingPharmacistId) {
      saveResponse = await fetch(`/pharmacists/${editingPharmacistId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pharmacist),
      });
    } else {
      saveResponse = await fetch("/pharmacists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pharmacist),
      });
    }

    if (saveResponse.ok) {
      loadPharmacists();
      pharmacistForm.reset();
      editingPharmacistId = null;
    } else {
      console.log("Failed to save pharmacist.");
    }
  } catch (error) {
    console.error(error);
  }
}

async function editPharmacist(id) {
  const response = await fetch(`/pharmacists/${id}`);
  const pharmacist = await response.json();

  document.getElementById("pharmacist_id").value = pharmacist.pharmacist_id;
  document.getElementById("pharmacist_name").value = pharmacist.pharmacist_name;
  document.getElementById("phone_number").value = pharmacist.phone_number;
  document.getElementById("address").value = pharmacist.address;

  editingPharmacistId = pharmacist._id;
}

async function deletePharmacist(id) {
  const response = await fetch(`/pharmacists/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    loadPharmacists();
  }
}
