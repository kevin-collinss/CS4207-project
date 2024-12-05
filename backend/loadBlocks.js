// Script used to run blockchain_test_dataset.json to generate test data.

const { Web3 } = require("web3");
const fs = require("fs");
require("dotenv").config();

// Loading the JSON dataset.
const dataset = JSON.parse(fs.readFileSync("blockchain_test_dataset.json", "utf8"));

// Setting up web3 connection.
const web3 = new Web3("http://127.0.0.1:7545");
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = JSON.parse(process.env.ABI);

// Connecting to the contract.
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function loadBlocks() {
    const accounts = await web3.eth.getAccounts(); // Get your wallet addresses
    console.log("Sender Address:", accounts[0]);

    // Processing the Requests.
    for (const note of dataset) {
        const { moduleID, noteID, blocks } = note;
        console.log("Processing:", moduleID, noteID);

        // Validating the moduleID.
        const validModules = ["CS4207", "CS4125", "CS4337", "CS4287"];
        if (!validModules.includes(moduleID)) {
            console.error(`Invalid moduleID: ${moduleID}`);
            continue;
        }

        try {
            // Checking if the note already exists.
            const existingBlocks = await contract.methods
                .getNoteBlocks(moduleID, parseInt(noteID))
                .call();

            if (existingBlocks.data.length === 0) {
                // Adding the first block as a new note.
                const firstBlock = blocks[0];
                if (!firstBlock || firstBlock.isReview) {
                    console.error(`No valid initial block found for note ${noteID} in module ${moduleID}`);
                    continue;
                }

                await contract.methods
                    .addNote(moduleID, parseInt(noteID), firstBlock.data)
                    .send({ from: accounts[0], gas: 3000000 });
                console.log(`Note ${noteID} added to module ${moduleID}`);
            }

            // Adding all subsequent blocks.
            for (let i = 1; i < blocks.length; i++) {
                const block = blocks[i];
                await contract.methods
                    .addBlock(moduleID, parseInt(noteID), block.data, block.isReview)
                    .send({ from: accounts[0], gas: 3000000 });
                console.log(`Block added to note ${noteID} in module ${moduleID}`);
            }
        } catch (error) {
            console.error(`Failed to process note ${noteID} in module ${moduleID}:`, error.message);
        }
    }
}

loadBlocks();
