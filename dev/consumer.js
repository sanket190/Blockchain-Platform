

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Web3 = require('web3');
const EnergyMarket_abi =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsAdded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "addFunds",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "addTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokensToBuy",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "consumer",
				"type": "address"
			}
		],
		"name": "buyEnergyTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokensToSell",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "Producer",
				"type": "address"
			}
		],
		"name": "sellEnergyTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ethToTokenRate",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ethToTokenRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getEnergyTokenBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "getEnergyTokenBalanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getEthToTokenRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // replace with the ABI of your EnergyMarket contract


const web3 = new Web3('http://localhost:8545');

// replace with your own account address and private key
const consumerAddress = '0xef64211da2c6B2018e6eDF0Bd7d4059201942f6d';
const consumerPrivateKey = '0x94eb4daa83f561121c0b4059f2d0203b589e6afed9f09d50a8e5bb4c5888de1f';

const energyMarketContractAddress = '0x8DDF808a5A4d374E068C6e344a2083cD3d868786'; // replace with the deployed contract address
const energyMarketContract = new web3.eth.Contract(EnergyMarket_abi, energyMarketContractAddress);

app.use(bodyParser.json());


// API endpoint for buying energy tokens
app.post('/buy', async (req, res) => {
  try {
    const amountInEth = req.body.amountInEth;
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000;

    

    // calculate the amount of energy tokens to buy based on the price of ETH per token
    const ethToTokenRate = await energyMarketContract.methods.getEthToTokenRate().call();
    const amountInWei = Web3.utils.toWei(amountInEth.toString(), 'ether');
    const tokensToBuy = Web3.utils.toBN(amountInEth).div(Web3.utils.toBN(ethToTokenRate)).toString();

    // check that the energy market has enough tokens to sell
    const energyMarketBalance = await energyMarketContract.methods.getEnergyTokenBalance().call(); // it contract who this balance
    // console.log(energyMarketBalance);
    if (Web3.utils.toBN(energyMarketBalance).lt(Web3.utils.toBN(tokensToBuy))) {
      return res.status(400).send('Energy market does not have enough tokens to sell');
    }

    // check that the consumer has enough ETH to buy the tokens
    const consumerBalance = await web3.eth.getBalance(consumerAddress); // account of blockchain
    // console.log(consumerBalance,tokensToBuy,amountInWei);
    if (Web3.utils.toBN(consumerBalance).lt(Web3.utils.toBN(amountInWei))) {
      return res.status(400).send('Consumer does not have enough ETH to buy tokens');
    }

    // create the transaction to buy energy tokens
    const nonce = await web3.eth.getTransactionCount(consumerAddress);
    const txParams = {
      nonce: Web3.utils.toHex(nonce),
      gasPrice: Web3.utils.toHex(gasPrice),
      gasLimit: Web3.utils.toHex(gasLimit),
      to: energyMarketContractAddress,
      value: Web3.utils.toHex(amountInWei),
      data: energyMarketContract.methods.buyEnergyTokens(tokensToBuy,consumerAddress).encodeABI()
    };

    // sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txParams, consumerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    res.send(`Transaction successful: ${receipt.transactionHash}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(3000, () => console.log('API server started on port 3000'));
