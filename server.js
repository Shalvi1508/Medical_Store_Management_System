const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/menu.html");
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/medical_store", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Customer Schema
const customerSchema = new mongoose.Schema({
  customer_id: String,
  customer_name: String,
  phone_number: String,
  email_id: String,
});

const Customer = mongoose.model("Customer", customerSchema);

//Inventory

const inventorySchema = new mongoose.Schema({
  inventory_id: { type: String, required: true, unique: true },
  medicine_name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
//MEdicine

const medicineSchema = new mongoose.Schema({
  medicine_id: { type: String, required: true, unique: true },
  medicine_name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
});

const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;

// Routes for CRUD operations

// CREATE - Add new customer
app.post("/customers", async (req, res) => {
  const newCustomer = new Customer(req.body);
  try {
    await newCustomer.save();
    res.status(201).send(newCustomer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// READ - Get all customers
app.get("/customers", async (req, res) => {
  const customers = await Customer.find({});
  res.send(customers);
});

// READ - Get a specific customer by ID
app.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE - Update customer details by ID
app.put("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE - Remove a customer
app.delete("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Pharmacist Schema
const pharmacistSchema = new mongoose.Schema({
  pharmacist_id: String,
  pharmacist_name: String,
  phone_number: String,
  address: String,
});

const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);

// CREATE - Add new pharmacist
app.post("/pharmacists", async (req, res) => {
  const newPharmacist = new Pharmacist(req.body);
  try {
    await newPharmacist.save();
    res.status(201).send(newPharmacist);
  } catch (error) {
    res.status(400).send(error);
  }
});

// READ - Get all pharmacists
app.get("/pharmacists", async (req, res) => {
  const pharmacists = await Pharmacist.find({});
  res.send(pharmacists);
});

// READ - Get a specific pharmacist by ID
app.get("/pharmacists/:id", async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findById(req.params.id);
    if (!pharmacist) {
      return res.status(404).send();
    }
    res.send(pharmacist);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE - Update pharmacist details by ID
app.put("/pharmacists/:id", async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pharmacist) {
      return res.status(404).send();
    }
    res.send(pharmacist);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE - Remove a pharmacist
app.delete("/pharmacists/:id", async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findByIdAndDelete(req.params.id);
    if (!pharmacist) {
      return res.status(404).send();
    }
    res.send(pharmacist);
  } catch (error) {
    res.status(500).send(error);
  }
});

// CRUD Routes for Medicines

// Get all medicines
app.get("/medicines", async (req, res) => {
  const medicines = await Medicine.find();
  res.json(medicines);
});

// Get medicine by ID
app.get("/medicines/:id", async (req, res) => {
  const medicine = await Medicine.findOne({ medicine_id: req.params.id });
  res.json(medicine);
});

// Create new medicine
app.post("/medicines", async (req, res) => {
  const medicine = new Medicine(req.body);
  await medicine.save();
  res.status(201).send(medicine);
});

// Update medicine
app.put("/medicines/:id", async (req, res) => {
  const medicine = await Medicine.findOneAndUpdate(
    { medicine_id: req.params.id },
    req.body,
    { new: true }
  );
  res.send(medicine);
});

// Delete medicine
app.delete("/medicines/:id", async (req, res) => {
  const medicine = await Medicine.findOneAndDelete({
    medicine_id: req.params.id,
  });
  res.send(medicine);
});

// CRUD Routes for Inventory

// Get all inventory items
app.get("/inventory", async (req, res) => {
  const inventoryItems = await Inventory.find();
  res.json(inventoryItems);
});

// Get inventory by ID
app.get("/inventory/:id", async (req, res) => {
  const inventoryItem = await Inventory.findOne({
    inventory_id: req.params.id,
  });
  res.json(inventoryItem);
});

// Create new inventory item
app.post("/inventory", async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).send(inventory);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Update inventory item
app.put("/inventory/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findOneAndUpdate(
      { inventory_id: req.params.id },
      req.body,
      { new: true }
    );
    res.send(inventory);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete inventory item
app.delete("/inventory/:id", async (req, res) => {
  const inventory = await Inventory.findOneAndDelete({
    inventory_id: req.params.id,
  });
  res.send(inventory);
});

// Server port
app.listen(9010, () => {
  console.log("Server is running on port 9010");
  console.log(`Server is running on http://localhost:9010`);
});
