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
const contractABI = JSON.parse(process.env.ABI);
const contractAddress = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
web3.eth.accounts.wallet.add(privateKey);

// Initialize contract instance
const academicResources = new web3.eth.Contract(contractABI, contractAddress);

// Use body parser middleware to parse JSON request bodies
app.use(bodyParser.json());


async function checkBalance(accountAddress) {
  try {
      // Fetch balance in Wei
      const balanceWei = await web3.eth.getBalance(accountAddress);

      // Convert Wei to Ether
      const balanceEther = web3.utils.fromWei(balanceWei, 'ether');

      console.log(`Balance of ${accountAddress}: ${balanceEther} Ether`);

      return balanceEther;
  } catch (error) {
      console.error("Error fetching balance:", error);
  }
}

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Blockchain Resource Sharing API");
});

app.post('/checkBalance', async (req, res) => {
  const { accountAddress } = req.body;

  if (!accountAddress) {
    return res
      .status(400)
      .json({
        error: "Missing required fields: accountAddress.",
      });
  }

  try {
    const balance = await checkBalance(accountAddress)

    res.status(200).json({
      message: "Balance successfully recieved!",
      balance: balance,
    });

  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({
      error: "Failed to add note. Please check the contract or input data.",
    });
  }
});

app.post('/createAccount', async (req, res) => {
  try {
    // Generate a new account
    const account = web3.eth.accounts.create();
    web3.eth.accounts.wallet.add(account.privateKey);

    const gasPrice = await web3.eth.getGasPrice();
    const tx = {
      from: web3.eth.accounts.privateKeyToAccount(privateKey).address,
      to: account.address,
      value: web3.utils.toWei('2', 'ether'),
      gas: 21000,
      gasPrice
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      // Send back the account address and private key
      res.status(200).json({
          address: account.address,
          privateKey: account.privateKey,
          balance: checkBalance(account.address)
      });
  } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({
          error: "Failed to create account. Please try again later."
      });
  }
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

    //get difficulty from the contract
    const difficulty = await academicResources.methods.getMiningDifficulty().call();

    const nonce = await mineNonce(moduleId, noteId, data, difficulty);
    if (!nonce) throw new Error("Failed to mine a valid nonce!");

    console.log(`Nonce mined: ${nonce}`);

    // Send the transaction to the contract to add a new note
    const tx = await academicResources.methods.addNote(moduleId, parseInt(noteId), data, parseInt(nonce))
      .send({ from: sender });

    res.status(200).json({
      message: "Note added successfully!",
      transactionHash: tx.transactionHash,
    });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({
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

    //get difficulty from the contract
    const difficulty = await academicResources.methods.getMiningDifficulty().call();

    const nonce = await mineNonce(moduleId, noteId, data, difficulty);
    if (!nonce) throw new Error("Failed to mine a valid nonce!");

    console.log(`Nonce mined: ${nonce}`);

    // Send the transaction to the contract to add a block (note version or review)
    const tx = await academicResources.methods
      .addBlock(moduleId, parseInt(noteId), data, isReview, parseInt(nonce))
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
    const timestamps = result.timestamps.map((timestamp) => Number(timestamp));
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

// Function to mine the nonce
function mineNonce(moduleId, noteId, data, difficulty) {
  let nonce = 0n; 

  const baseTarget = BigInt('0x' + 'f'.repeat(64)); 
  const target = baseTarget / BigInt(difficulty);

  console.log("Base target:", baseTarget.toString());
  console.log("Target:     ", target.toString());

  while (true) {
    
    const hash = web3.utils.soliditySha3(
      {type: "string", value: moduleId}, 
      {type: "uint256", value: noteId}, 
      {type: "string", value: data}, 
      {type: "uint256", value: nonce}, 
    );
    if (!hash) throw new Error("Failed to generate hash.");

    const hashAsBigInt = BigInt(`0x${hash.slice(2)}`); 

    if (hashAsBigInt < target) {
      console.log(`Valid nonce found: ${nonce}`);
      return nonce.toString(); 
    }

    nonce += 1n;
    if (nonce > 100000n) {  
      console.log("Nonce generation failed after 100000 attempts.");
      return null;  
    }
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
