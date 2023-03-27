const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Web3 = require('web3');

const web3 = new Web3('http://localhost:8545');

// replace with your own account address and private key
const producerAddress = '0xef64211da2c6B2018e6eDF0Bd7d4059201942f6d';
const producerPrivateKey = '0x94eb4daa83f561121c0b4059f2d0203b589e6afed9f09d50a8e5bb4c5888de1f';
const EnergyMarket_abi=[
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
];

const energyMarketContractAddress = '0x8DDF808a5A4d374E068C6e344a2083cD3d868786'; // replace with the deployed contract address
const energyMarketContract = new web3.eth.Contract(EnergyMarket_abi, energyMarketContractAddress);

app.use(bodyParser.json());

// Define the constants
const WATTS_PER_KILOWATT_HOUR = 1000;
const SECONDS_PER_HOUR = 3600;

// Define the initial values
let energyProduced = 0;
let lastMeasurementTime = Date.now();


// Continuously measure the energy produced and update the total
setInterval(() => {
  // Simulate measuring the power output in watts
  const powerOutputInWatts = Math.random() * 10000;

  // Calculate the time elapsed since the last measurement
  const currentTime = Date.now();
  const timeElapsedInSeconds = (currentTime - lastMeasurementTime) / 100;

  // Calculate the energy produced in kilowatt-hours (kWh)
  const energyProducedInKWh = (powerOutputInWatts * timeElapsedInSeconds) / (WATTS_PER_KILOWATT_HOUR * SECONDS_PER_HOUR);

  // Update the total energy produced
  energyProduced += energyProducedInKWh;

  // Update the last measurement time
  lastMeasurementTime = currentTime;

  // Log the current energy produced
  // console.log(`Current energy produced: ${energyProduced.toFixed(2)} kWh`);

  // console.log(`Current energy produced: ${energyProduced.toFixed(2)} kWh`);

  // Add the energy produced as tokens to the contract
  // async function AddTokens(contract, producerAddress, amount) {
  //   const weiAmount = web3.utils.toWei(amount.toFixed(2), 'ether');
  //   const receipt = await contract.methods.addTokens().send({ from: producerAddress, value: weiAmount });
  //   console.log();
  // }
  AddTokens(energyProduced.toFixed(2));
}, 1000); // Repeat every second

async function AddTokens(amount) {
  var intvalue = Math.round( amount );
  if (intvalue<1){
    return;
  };
  // const accounts = await web3.eth.getAccounts();
  // const weiAmount = web3.utils.toWei(amount.toString(), 'ether'); // convert amount to string
  const receipt = await energyMarketContract.methods.addTokens().send({ from: producerAddress, value: intvalue });
  
}




app.post('/sell', async (req, res) => {
  try {
    const { amountInTokens } = req.body;
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000;

    // check that the producer has enough tokens to sell
    const producerTokenBalance = await energyMarketContract.methods.getEnergyTokenBalanceOf(producerAddress).call();
    if (Web3.utils.toBN(producerTokenBalance).lt(Web3.utils.toBN(amountInTokens))) {
      return res.status(400).json({ error: 'Producer does not have enough energy tokens to sell' });
    }

    // calculate the amount of ETH to receive based on the price of ETH per token
    const tokenToEthRate = await energyMarketContract.methods.getEthToTokenRate().call();
    const amountInWei = Web3.utils.toBN(amountInTokens).mul(Web3.utils.toBN(tokenToEthRate)).toString();

    // create the transaction to sell energy tokens
    const nonce = await web3.eth.getTransactionCount(producerAddress);
    const txParams = {
      nonce: Web3.utils.toHex(nonce),
      gasPrice: Web3.utils.toHex(gasPrice),
      gasLimit: Web3.utils.toHex(gasLimit),
      to: energyMarketContractAddress,
      data: energyMarketContract.methods.sellEnergyTokens(amountInTokens,producerAddress).encodeABI()
    };

    // sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txParams, producerPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction receipt:', receipt);

    return res.status(200).json({ message: `Successfully sold ${amountInTokens} energy tokens for ${Web3.utils.fromWei(amountInWei, 'ether')} ETH` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while selling energy tokens' });
  }
});

app.listen(3000, () => console.log('API server started on port 3000'));