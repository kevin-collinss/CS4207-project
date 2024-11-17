// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentNotes {
    string public message;

    event MessageUpdated(string oldMessage, string newMessage);

    constructor() {
        message = "Hello, Blockchain!";
    }

    function setMessage(string memory newMessage) public {
        string memory oldMessage = message;
        message = newMessage;
        emit MessageUpdated(oldMessage, newMessage);
    }
}