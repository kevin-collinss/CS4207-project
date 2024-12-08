pragma solidity ^0.8.0;

contract AcademicResources {
    // Define a block structure for notes
    struct Block {
        string data;         // Note content or review text
        address submitter;   // Address of the person adding the block
        uint256 timestamp;   // Timestamp of the block
        bool isReview;       // True if it's a review, false if it's a note version
    }

    // Mapping: module ID => note ID => list of blocks (a blockchain for each note)
    mapping(string => mapping(uint256 => Block[])) public moduleNotes;

    // Predefined module IDs
    string[] public modules = ["CS4207", "CS4125", "CS4337", "CS4287"];

    // Proof of Work difficulty
    uint256 public miningDifficulty = 1000;
    function getMiningDifficulty() public view returns (uint256) {
        return miningDifficulty;
    }

    // Events for logging actions
    event NoteAdded(string moduleId, uint256 noteId, string data, address submitter);
    event BlockAdded(string moduleId, uint256 noteId, string data, bool isReview, address submitter);

    // Modifier to ensure valid module
    modifier validModule(string memory moduleId) {
        bool isValid = false;
        for (uint256 i = 0; i < modules.length; i++) {
            if (keccak256(abi.encodePacked(modules[i])) == keccak256(abi.encodePacked(moduleId))) {
                isValid = true;
                break;
            }
        }
        require(isValid, "Invalid module ID");
        _;
    }

    // Proof of Work validation
    function validateProofOfWork(string memory moduleId, uint256 noteId, string memory data, uint256 nonce) public view returns (bool) {
        // Data & nonce hashed
        bytes32 hash = keccak256(abi.encodePacked(moduleId, noteId, data, nonce));
        // Check against difficulty

        uint256 baseTarget = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
        uint256 target = baseTarget / miningDifficulty;
        return uint256(hash) < target;
    }

    // Add a new note (first block in a note's blockchain)
    function addNote(string memory moduleId, uint256 noteId, string memory data, uint256 nonce) public validModule(moduleId) {
        require(moduleNotes[moduleId][noteId].length == 0, "Note already exists");
        require(validateProofOfWork(moduleId, noteId, data, nonce), "Invalid proof of work");
        Block memory newBlock = Block({
            data: data,
            submitter: msg.sender,
            timestamp: block.timestamp,
            isReview: false
        });
        moduleNotes[moduleId][noteId].push(newBlock);
        emit NoteAdded(moduleId, noteId, data, msg.sender);
    }

    // Add a new version or review to an existing note
    function addBlock(string memory moduleId, uint256 noteId, string memory data, bool isReview, uint256 nonce) public validModule(moduleId) {
        require(moduleNotes[moduleId][noteId].length > 0, "Note does not exist");
        require(validateProofOfWork(moduleId, noteId, data, nonce), "Invalid proof of work");
        Block memory newBlock = Block({
            data: data,
            submitter: msg.sender,
            timestamp: block.timestamp,
            isReview: isReview
        });
        moduleNotes[moduleId][noteId].push(newBlock);
        emit BlockAdded(moduleId, noteId, data, isReview, msg.sender);
    }

    // Fetch blocks for a specific note
    function getNoteBlocks(string memory moduleId, uint256 noteId)
        public
        view
        validModule(moduleId)
        returns (
            string[] memory data,
            address[] memory submitters,
            uint256[] memory timestamps,
            bool[] memory isReviews
        )
    {
        uint256 blockCount = moduleNotes[moduleId][noteId].length;

        string[] memory blockData = new string[](blockCount);
        address[] memory blockSubmitters = new address[](blockCount);
        uint256[] memory blockTimestamps = new uint256[](blockCount);
        bool[] memory blockIsReviews = new bool[](blockCount);

        for (uint256 i = 0; i < blockCount; i++) {
            Block storage currentBlock = moduleNotes[moduleId][noteId][i];
            blockData[i] = currentBlock.data;
            blockSubmitters[i] = currentBlock.submitter;
            blockTimestamps[i] = currentBlock.timestamp;
            blockIsReviews[i] = currentBlock.isReview;
        }

        return (blockData, blockSubmitters, blockTimestamps, blockIsReviews);
    }
}
