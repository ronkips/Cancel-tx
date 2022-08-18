const cancelTx = async () => {
  require('dotenv').config()
  //Import the secret .env file where our private key and API  are stored
  const { API_KEY, PRIVATE_KEY } = process.env
  //we can now use this aliases instesd of using our actual key.
  const { ethers } = require('ethers')
  //import ethers library
  const { Network, initializeAlchemy } = require('@alch/alchemy-sdk')
  //import alchemy SDK
  const settings = {
    apiKey: API_KEY,
    network: Network.ETH_GOERLI,
    maxRetries: 10,
  }
  const alchemy = initializeAlchemy(settings)
  //initialize our Alchemy SDK with our settings config.
  const provider = alchemy.getProvider()
  //Create new provider instance with alchemy to make request using our API
  const myAddress = '0x6DB98f0beEa48A2C7AD0C8fF2d640fc84FE440ae'
  const nonce = await provider.getTransactionCount(myAddress)
  // Get the latest nonce foe our wallet address
  const walletInst = new ethers.Wallet(PRIVATE_KEY, provider)
  //unlike web3.js Ethers separates the provider and private key , so we must create a wallet instance

  const transaction = {
    gasLimit: '53000',
    maxPriorityFeePerGas: ethers.utils.parseUnits('1', 'gwei'),
    nonce: nonce,
    type: 2, //the EIP-2718 type of tx envelope
  }

  const replacementTx = {
     gasLimit: "53000",
    maxPriorityFeePerGas: ethers.utils.parseUnits("1.55", "gwei"),
    maxFeePerGas: ethers.utils.parseUnits("1.8", "gwei"),
    nonce: nonce,
    type: 2,
  }

  try {
    const signedTx = await walletInst.sendTransaction(transaction)
    const signedReplacementTx = await walletInst.sendTransaction(replacementTx)

    console.log(
      'The hash of the transaction we are going to cancel is:',
      signedTx.hash,
    )

    console.log(
      'The hash of your replacement transaction is:',
      signedReplacementTx.hash,
      '\n Check Alchemy Mempool to view the status of your transaction!',
    )
  } catch (error) {
    console.log(
      'Hey..Something went wrong while submitting your transactions:',
      error,
    )
  }
}

cancelTx()
