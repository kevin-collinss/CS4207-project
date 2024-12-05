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
        "internalType": "address",
        "name": "miner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "nonce",
        "type": "uint32"
      }
    ],
    "name": "BlockMined",
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
    "inputs": [],
    "name": "miningDifficulty",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
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
    "inputs": [],
    "name": "getMiningDifficulty",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
      },
      {
        "internalType": "uint32",
        "name": "nonce",
        "type": "uint32"
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
      },
      {
        "internalType": "uint32",
        "name": "nonce",
        "type": "uint32"
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
        "internalType": "bytes",
        "name": "header",
        "type": "bytes"
      },
      {
        "internalType": "uint32",
        "name": "nonce",
        "type": "uint32"
      }
    ],
    "name": "validateProofOfWork",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
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
        "internalType": "uint32",
        "name": "newDifficulty",
        "type": "uint32"
      }
    ],
    "name": "setMiningDifficulty",
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
        "internalType": "uint256",
        "name": "blockIndex",
        "type": "uint256"
      }
    ],
    "name": "revertToBlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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

    // Fetch the current mining difficulty from the contract
    const difficulty = await academicResources.methods.miningDifficulty().call();

    // Prepare the header for mining
    const header = moduleId + noteId + data;

    // Mine the nonce
    const nonce = await mineNonce(header, difficulty);

    console.log(`Nonce mined: ${nonce}`);

    // Send the transaction to the contract to add a new note
    const tx = await academicResources.methods
      .addNote(moduleId, parseInt(noteId), data, nonce)
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


function mineNonce(header, difficulty) {
  let nonce = 0n; 

  // const target = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') / BigInt(difficulty);
  // (0xffff *208)
  const target = (BigInt(0xffff) * (BigInt(2) ** BigInt(208))) / BigInt(difficulty);
  console.log("Target:", target.toString());
  // const target = (BigInt(0xf) * (BigInt(2) ** BigInt(208))) / BigInt(difficulty);

  while (true) {
    const hash = web3.utils.soliditySha3(header + nonce.toString());
    const hashAsBigInt = BigInt(`0x${hash.slice(2)}`);
    console.log("Nonce:", nonce, "Hash:", hashAsBigInt.toString());
    console.log("Target:", target.toString());
    console.log("Hash  :", hashAsBigInt.toString());

    if (hashAsBigInt < target) {
      console.log(`Valid nonce found: ${nonce}`);
      return nonce.toString(); 
    }

    nonce += 1n; 
  }
}


async function testValidateProofOfWork() {
  const moduleId = "CS4215";
  const noteId = 12345;
  const data = "This is a test note";
  const header = moduleId + noteId + data;  

  const difficulty = await academicResources.methods.miningDifficulty().call();

  const nonce = await mineNonce(header, difficulty);
  console.log(`Nonce mined: ${nonce}`);

  const isValid = await academicResources.methods.validateProofOfWork(header, nonce).call();
  console.log("Is the mined nonce valid? ", isValid);

  if (isValid) {
    console.log("Proof of work is valid.");
  } else {
    console.log("Proof of work is invalid.");
  }
}

testValidateProofOfWork().catch(console.error);


// function mineNonce(header) {
//   console.log("Header:", header.toString()); 

//   let nonce = 0n; 

//   const target = BigInt('0x' + 'fff'.repeat(64)); 
//   while (true) {
//     const hash = web3.utils.soliditySha3(header.toString() + nonce.toString());
//     const hashAsBigInt = BigInt(`0x${hash.slice(2)}`);

//     console.log("Nonce:", nonce.toString());
//     console.log("Hash: ", hashAsBigInt.toString());
    
//     if (hashAsBigInt < target) {
//       console.log("Found valid nonce:", nonce); 
//       return nonce;
//     }

//     nonce += BigInt(1); // Increment nonce
//   }
// }


// function mineNonce(header, difficulty) {
//   console.log("head:", header.toString()); 
//   difficulty = BigInt(difficulty);
//   let nonce = 0n; // Start with nonce as a BigInt

//   const target = BigInt((BigInt(0xffff) * (BigInt(2) ** BigInt(208))) / difficulty);
//   console.log("Target:", target.toString()); 

//   while (true) {
//     const hash = web3.utils.soliditySha3(header.toString() + nonce.toString());

//     // const hashAsBigInt = BigInt(hash); 

//     const hashAsBigInt = BigInt(`0x${hash.slice(2)}`);


//     // console.log("head:", header.toString()); 
//     console.log("nonce:", nonce.toString());
//     // console.log("Hash:", hash);
//     console.log("Hash  : ", hashAsBigInt.toString());
//     console.log("Target: ", target.toString() + "\n"); 
    
//     // let a = 26959535291011309493156476344723991336010898738574164086137773096950n;
//     // let b = 26959535291011309493156476344723991336010898738574164086137773096960n

//     // if(a < target){
//     //   console.log("nonce : " + nonce);
//     // }



//     if (hashAsBigInt < target) {
//       // console.log("Found valid nonce:", nonce); // Log the valid nonce
//       return nonce; // Return the BigInt nonce
      
//     }
//     nonce += BigInt(1); 
//   }
// }
