const path = require("path");
const fs = require("fs").promises;
const axios = require("axios");
const { removeDuplicates } = require("./utils/arrayUtils"); 

const DATA_URI = "https://microsoftedge.github.io/Demos/json-dummy-data/256KB.json";
const fileLocation = path.join(__dirname, "data", "users.js");

async function fetchDataAndSave(dataURI, fileLocation) {
  try {
      const res = await axios.get(dataURI);
      const data = removeDuplicates(res.data);
      
      await fs.writeFile(fileLocation, JSON.stringify(data), "utf-8");  
    } catch (err) {
      console.error("Something went work when reading the data.");
    }
}

async function init() {
  try {
    await fs.access(fileLocation);
    console.log("Data file already exists. Skipping initialization.");
  } catch (err) {
    await fetchDataAndSave(DATA_URI, fileLocation);
    console.log("Data file created successfully!");
  }
}

init();

fetchDataAndSave(DATA_URI, fileLocation);