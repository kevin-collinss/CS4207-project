# **Setup & How to Run**

This guide will help you set up and run the project locally.

## **Prerequisites**
Before starting, ensure you have the following installed:  
1. **Node.js** 
2. **Ganache** 
3. **MetaMask**   


Notes:
- 1st is before starting from step 3, you need to copy Step 4 from lab sheet, but have it pointing to the config.json in this project
- Then after this, do step 6 from lab on this so you have meta mask properly configured up
## **Step 1: Follow the Lab Sheet**
Complete the lab sheet to ensure you have everything installed ( or just do up to step 1 and then copy what I say in notes above with step 2)  
[**Lab Sheet Link**](https://learn.ul.ie/d2l/le/lessons/45656/topics/841626) 

## **Step 2: Clone the Repository**
Clone the project repository and navigate to the project directory:  
```bash
git clone <repository-url>
cd CS4207-project
```

# **Step 3: Set Up the Blockchain**

### Navigate to the `blockchain/` directory:
```bash
cd blockchain
```
From here, you may need to run
```
npm install
```
but if did lab sheet should be grand


# Step 4: Compile and deploy smart contract
In this directory, run
```
truffle compile
truffle migrate --reset --network development
```


Now, in the output you will see something like this if works
``` 

   Deploying 'StudentNotes'
   ------------------------
   > transaction hash:    0xc950120dc30897b47a258427cc23da054222ed4d750e88a8124be7d351e74c21
   > Blocks: 0            Seconds: 0
   > contract address:    0x05ad404F118dc63087f17b25Bb245D972B78Dc5f
   > block number:        1
   > block timestamp:     1731854371
   > account:             0xa8821d96820080d27cD20C5F2f6Ec268E16404Bc
   > balance:             99.99249316
   > gas used:            375342 (0x5ba2e)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00750684 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00750684 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.00750684 ETH
```

Copy the Contract address figure and then go into frontend/index.html and on line 16, replace with your address

Run this frontend and you can connect metamask up and run a request.


## Extras

This just very basic so you can connect and send a messsage with blockchain. We will basically then need to configure this up with a spring boot backend as we said we would use java. Then link with frontend so then for example, if we are going with project I sent within discord we can have endpoints to upload notes leave reviews blah blah blah. 