
const ABI = [
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

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const CONTRACT_ADDRESS = '0x8DDF808a5A4d374E068C6e344a2083cD3d868786'; // Replace with your contract address

const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

account_address_of_contract =  '0x933b304ee2da4930bf4d81a7abCFC6a436De24C2';

// add the fund to the contract's wallet
async function addFundsToWallet(amount) {
    // const accounts = await web3.eth.getAccounts();
    const weiAmount = web3.utils.toWei(amount.toString(), 'ether'); // convert amount to string
    const receipt = await contract.methods.addFunds().send({ from: account_address_of_contract, value: weiAmount });
    return receipt;
}

// withdraw the funds from the contract's wallet
async function withdrawFundsFromWallet(amount) {
//   const accounts = await web3.eth.getAccounts();
  const weiAmount = web3.utils.toWei(amount.toString(), 'ether');
  const receipt = await contract.methods.withdrawFunds(weiAmount,account_address_of_contract).send({ from: CONTRACT_ADDRESS });
  return receipt;
}

async function getBalance(address) {
    const balance = await contract.methods.balanceOf(address).call();
    const balanceBN = new web3.utils.BN(balance.toString());
    return web3.utils.fromWei(balanceBN, 'ether');
}

addFundsToWallet('10').then(console.log).catch(console.error);
// withdrawFundsFromWallet('10').then(console.log).catch(console.error);
// getBalance('0x8cF99F4D1724B500EeBab7018C667397a9d9773c').then(console.log).catch(console.error);