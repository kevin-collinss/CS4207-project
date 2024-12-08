const axios = require("axios");
const fs = require("fs");

// Loading the JSON dataset
const dataset = JSON.parse(fs.readFileSync("blockchain_test_dataset.json", "utf8"));

// Defining the backend URL
const BACKEND_URL = "http://localhost:5000";

async function loadBlocks() {
    console.log("Starting to load blocks...");

    for (const note of dataset) {
        const { moduleID, noteID, blocks } = note;
        console.log(`Processing noteID: ${noteID}, moduleID: ${moduleID}`);

        try {
            // Adding the first block as a new note
            const firstBlock = blocks[0];
            if (!firstBlock || firstBlock.isReview) {
                console.error(
                    `No valid initial block found for noteID: ${noteID}, moduleID: ${moduleID}`
                );
                continue;
            }

            const addNoteResponse = await axios.post(`${BACKEND_URL}/addNote`, {
                moduleId: moduleID,
                noteId: noteID,
                data: firstBlock.data,
                sender: "0x697d5ccb69DA579E84b5b1734F701D71a7A0d5e6",
            });
            console.log(
                `Note added successfully: ${noteID}, transactionHash: ${addNoteResponse.data.transactionHash}`
            );

            // Adding all subsequent blocks
            for (let i = 1; i < blocks.length; i++) {
                const block = blocks[i];

                const addBlockResponse = await axios.post(`${BACKEND_URL}/addBlock`, {
                    moduleId: moduleID,
                    noteId: noteID,
                    data: block.data,
                    isReview: block.isReview,
                    sender: "0x697d5ccb69DA579E84b5b1734F701D71a7A0d5e6",
                });

                console.log(
                    `Block added to noteID: ${noteID}, transactionHash: ${addBlockResponse.data.transactionHash}`
                );
            }
        } catch (error) {
            console.error(`Failed to process noteID: ${noteID}, moduleID: ${moduleID}`);
            console.error(error.response?.data || error.message);
        }
    }
    console.log("Finished processing blocks.");
}

loadBlocks();
