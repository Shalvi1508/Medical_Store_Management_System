let editingCustomerId = null;

document.addEventListener("DOMContentLoaded", function () {
  loadCustomers();

  const customerForm = document.getElementById("customerForm");
  customerForm.addEventListener("submit", addOrUpdateCustomer);
});

async function loadCustomers() {
  try {
    const response = await fetch("/customers");
    if (!response.ok) throw new Error("Failed to load customers");

    const customers = await response.json();
    const customerTable = document.getElementById("customerTable");
    customerTable.innerHTML = "";

    customers.forEach((customer) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${customer.customer_id}</td>
                <td>${customer.customer_name}</td>
                <td>${customer.phone_number}</td>
                <td>${customer.email_id}</td>
                <td>
                    <button onclick="editCustomer('${customer._id}')">Edit</button>
                    <button onclick="deleteCustomer('${customer._id}')">Delete</button>
                </td>
            `;
      customerTable.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

function validateForm(customer_id, phone_number, email_id, customers) {
  const idRegex = /^CUST\d{3}$/;
  const phoneRegex = /^\d{10}$/;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!idRegex.test(customer_id)) {
    alert("Customer ID must be in the format CUST001.");
    return false;
  }

  if (
    customers.some(
      (customer) =>
        customer.customer_id === customer_id &&
        customer._id !== editingCustomerId
    )
  ) {
    alert("Customer ID already exists.");
    return false;
  }

  if (!phoneRegex.test(phone_number)) {
    alert("Phone number must be a 10-digit number.");
    return false;
  }

  if (!emailRegex.test(email_id)) {
    alert("Email must be in the format abc@gmail.com.");
    return false;
  }

  return true;
}

async function addOrUpdateCustomer(event) {
  event.preventDefault();

  const customer_id = document.getElementById("customer_id").value;
  const customer_name = document.getElementById("customer_name").value;
  const phone_number = document.getElementById("phone_number").value;
  const email_id = document.getElementById("email_id").value;

  const customer = { customer_id, customer_name, phone_number, email_id };

  try {
    const response = await fetch("/customers");
    const customers = await response.json();

    if (!validateForm(customer_id, phone_number, email_id, customers)) {
      return;
    }

    let saveResponse;
    if (editingCustomerId) {
      saveResponse = await fetch(`/customers/${editingCustomerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
    } else {
      saveResponse = await fetch("/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
    }

    if (saveResponse.ok) {
      loadCustomers();
      document.getElementById("customerForm").reset();
      editingCustomerId = null;
    } else {
      console.log("Failed to save customer.");
    }
  } catch (error) {
    console.error(error);
  }
}

async function editCustomer(id) {
  try {
    const response = await fetch(`/customers/${id}`);
    if (!response.ok) throw new Error("Failed to fetch customer data");

    const customer = await response.json();

    document.getElementById("customer_id").value = customer.customer_id;
    document.getElementById("customer_name").value = customer.customer_name;
    document.getElementById("phone_number").value = customer.phone_number;
    document.getElementById("email_id").value = customer.email_id;

    editingCustomerId = customer._id;
  } catch (error) {
    console.error(error);
  }
}

async function deleteCustomer(id) {
  try {
    const response = await fetch(`/customers/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadCustomers();
    } else {
      console.log("Failed to delete customer.");
    }
  } catch (error) {
    console.error(error);
  }
}
