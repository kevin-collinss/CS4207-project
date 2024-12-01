const express = require("express");
const bodyParser = require("body-parser");
const { Web3 } = require("web3");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(require("cors")());
// Web3 Setup
const web3 = new Web3("http://127.0.0.1:7545");
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "moduleId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "noteId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "data",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isReview",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      }
    ],
    "name": "BlockAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "moduleId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "noteId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "data",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      }
    ],
    "name": "NoteAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "moduleNotes",
    "outputs": [
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isReview",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "modules",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "moduleId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "noteId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      }
    ],
    "name": "addNote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "moduleId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "noteId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isReview",
        "type": "bool"
      }
    ],
    "name": "addBlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "moduleId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "noteId",
        "type": "uint256"
      }
    ],
    "name": "getNoteBlocks",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "data",
        "type": "string[]"
      },
      {
        "internalType": "address[]",
        "name": "submitters",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "timestamps",
        "type": "uint256[]"
      },
      {
        "internalType": "bool[]",
        "name": "isReviews",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
const contractAddress = process.env.CONTRACT_ADDRESS; // Replace with deployed contract address
const privateKey = process.env.PRIVATE_KEY;
web3.eth.accounts.wallet.add(privateKey);

// Initialize contract instance
const academicResources = new web3.eth.Contract(contractABI, contractAddress);

// Use body parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Blockchain Resource Sharing API");
});

// Add a new note (first block in a note's blockchain)
app.post("/addNote", async (req, res) => {
  const { moduleId, noteId, data, sender } = req.body;

  if (!moduleId || !noteId || !data || !sender) {
    return res
      .status(400)
      .json({
        error: "Missing required fields: moduleId, noteId, data, sender.",
      });
  }

  try {
    // Send the transaction to the contract to add a new note
    const tx = await academicResources.methods
      .addNote(moduleId, parseInt(noteId), data)
      .send({ from: sender });

    res.status(200).json({
      message: "Note added successfully!",
      transactionHash: tx.transactionHash,
    });
  } catch (error) {
    console.error("Error adding note:", error);
    res
      .status(500)
      .json({
        error: "Failed to add note. Please check the contract or input data.",
      });
  }
});

// Add a new version or review to an existing note
app.post("/addBlock", async (req, res) => {
  const { moduleId, noteId, data, isReview, sender } = req.body;

  if (!moduleId || !noteId || !data || isReview === undefined || !sender) {
    return res
      .status(400)
      .json({
        error:
          "Missing required fields: moduleId, noteId, data, isReview, sender.",
      });
  }

  try {
    // Send the transaction to the contract to add a block (note version or review)
    const tx = await academicResources.methods
      .addBlock(moduleId, parseInt(noteId), data, isReview)
      .send({ from: sender });

    res.status(200).json({
      message: "Block added successfully!",
      transactionHash: tx.transactionHash,
    });
  } catch (error) {
    console.error("Error adding block:", error);
    res
      .status(500)
      .json({
        error: "Failed to add block. Please check the contract or input data.",
      });
  }
});

app.get("/getNoteBlocks", async (req, res) => {
  const { moduleId, noteId } = req.query;

  if (!moduleId || !noteId) {
    return res.status(400).json({ error: "Missing required fields: moduleId, noteId." });
  }

  try {
    // Call the smart contract to fetch blocks for the given note
    const result = await academicResources.methods
      .getNoteBlocks(moduleId, parseInt(noteId))
      .call();

    console.log("Raw result from smart contract:", result);

    // Use the named keys to access the values
    const data = result.data;
    const submitters = result.submitters;
    const timestamps = result.timestamps.map((timestamp) => Number(timestamp)); // Convert BigInt to Number if necessary
    const isReviews = result.isReviews;

    // Handle empty results
    if (data.length === 0) {
      return res.status(404).json({ message: "No blocks found for this note." });
    }

    res.status(200).json({
      data,
      submitters,
      timestamps,
      isReviews,
    });
  } catch (error) {
    console.error("Error fetching note blocks:", error);
    res.status(500).json({
      error: "Failed to fetch note blocks. Please check the contract or input data.",
    });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
