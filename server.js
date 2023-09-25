const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs"); // Import the File System module

const app = express();

app.use(cors());
app.use(bodyParser.json());

const dbFilePath = "db.json"; // Define the path to your JSON data file

// Function to read data from the JSON file
function readDataFromFile() {
  try {
    const data = fs.readFileSync(dbFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data from file:", error);
    return [];
  }
}

// Function to write data to the JSON file
function writeDataToFile(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing data to file:", error);
  }
}

// Define CRUD routes
// 1. Create (POST)
app.post("/api/items", (req, res) => {
  const newItem = req.body;
  const data = readDataFromFile(); // Read the data from the file
  newItem.id = Date.now(); // Generate a unique ID (you can use a more robust method)
  data.push(newItem);
  writeDataToFile(data); // Write the updated data back to the file
  res.json(newItem);
});

// 2. Read (GET)
app.get("/api/items", (req, res) => {
  const data = readDataFromFile(); // Read the data from the file
  res.json(data);
});

// 3. Update (PUT)
app.put("/api/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  let data = readDataFromFile(); // Read the data from the file
  data = data.map((item) => (item.id === itemId ? updatedItem : item));
  writeDataToFile(data); // Write the updated data back to the file
  res.json(updatedItem);
});

// 4. Delete (DELETE)
app.delete("/api/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  let data = readDataFromFile(); // Read the data from the file
  data = data.filter((item) => item.id !== itemId);
  writeDataToFile(data); // Write the updated data back to the file
  res.json({ message: "Item deleted" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
