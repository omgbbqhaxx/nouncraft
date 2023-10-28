"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;


/**
 * Setup the orchestra
 */
function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      //options: {
        // Mikko's test key - don't copy as your mileage may vary
      //  infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      //},
      rpc: {
        1: "https://mainnet.base.org",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_391E26A3B43A3350"
      }
    }
  };



  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
  });

}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
    const chainData = evmChains.getChain(chainId);
  document.querySelector("#network-name").textContent = chainData.name;

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  document.querySelector("#selected-account").textContent = selectedAccount;

  // Get a handl
  const template = document.querySelector("#template-balance");
  const accountContainer = document.querySelector("#accounts");

  const contractAddress =  "0x0dAE55272e290D7789Bb05Ca25bf1711d5D5Aae0";
  var Tether = new web3.eth.Contract([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lister","type":"address"},{"indexed":false,"internalType":"uint256","name":"productId","type":"uint256"}],"name":"ProductDelisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lister","type":"address"},{"indexed":false,"internalType":"uint256","name":"productId","type":"uint256"}],"name":"ProductListed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lister","type":"address"},{"indexed":false,"internalType":"uint256","name":"productId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"ProductPriceChanged","type":"event"},{"inputs":[{"internalType":"uint256","name":"productID","type":"uint256"}],"name":"buyproduct","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"productId","type":"uint256"},{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"changeProductPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"productID","type":"uint256"}],"name":"checkDownload","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"productId","type":"uint256"}],"name":"delistProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"productId","type":"uint256"}],"name":"getProduct","outputs":[{"components":[{"internalType":"address","name":"lister","type":"address"},{"internalType":"string","name":"productImage","type":"string"},{"internalType":"string","name":"productURL","type":"string"},{"internalType":"uint256","name":"productPrice","type":"uint256"},{"internalType":"string","name":"productExplanation","type":"string"},{"internalType":"bool","name":"isDelisted","type":"bool"}],"internalType":"struct NounCraft.Product","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getblockhash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"productImage","type":"string"},{"internalType":"string","name":"productURL","type":"string"},{"internalType":"uint256","name":"productPrice","type":"uint256"},{"internalType":"string","name":"productExplanation","type":"string"}],"name":"listProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nAddrHash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"x","type":"address"}],"name":"nAddrHashx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"productCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}],"0x0dAE55272e290D7789Bb05Ca25bf1711d5D5Aae0");




  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
     
    // ethBalance is a BigNumber instance
    // https://github.com/indutny/bn.js/
    const ethBalance = web3.utils.fromWei(balance, "ether");
    


    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
 
    // Fill in the templated row and put in the document
    const clone = template.content.cloneNode(true);
    clone.querySelector(".address").textContent = address;
    clone.querySelector(".balance").textContent = humanFriendlyBalance;

    accountContainer.appendChild(clone);
  });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}




async function generateMemo() {

  const web3 = new Web3(provider);

  //await fetchAccountData(provider);
  const contractAddress =  "0x0dAE55272e290D7789Bb05Ca25bf1711d5D5Aae0";
  var Tether = new web3.eth.Contract([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lister","type":"address"},{"indexed":false,"internalType":"uint256","name":"productId","type":"uint256"}],"name":"ProductDelisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lister","type":"address"},{"indexed":false,"internalType":"uint256","name":"productId","type":"uint256"}],"name":"ProductListed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lister","type":"address"},{"indexed":false,"internalType":"uint256","name":"productId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"ProductPriceChanged","type":"event"},{"inputs":[{"internalType":"uint256","name":"productID","type":"uint256"}],"name":"buyproduct","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"productId","type":"uint256"},{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"changeProductPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"productID","type":"uint256"}],"name":"checkDownload","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"productId","type":"uint256"}],"name":"delistProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"productId","type":"uint256"}],"name":"getProduct","outputs":[{"components":[{"internalType":"address","name":"lister","type":"address"},{"internalType":"string","name":"productImage","type":"string"},{"internalType":"string","name":"productURL","type":"string"},{"internalType":"uint256","name":"productPrice","type":"uint256"},{"internalType":"string","name":"productExplanation","type":"string"},{"internalType":"bool","name":"isDelisted","type":"bool"}],"internalType":"struct NounCraft.Product","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getblockhash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"productImage","type":"string"},{"internalType":"string","name":"productURL","type":"string"},{"internalType":"uint256","name":"productPrice","type":"uint256"},{"internalType":"string","name":"productExplanation","type":"string"}],"name":"listProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nAddrHash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"x","type":"address"}],"name":"nAddrHashx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"productCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}],"0x0dAE55272e290D7789Bb05Ca25bf1711d5D5Aae0");



  Tether.options.gasPrice = '200000';
  Tether.options.gas = 5000000;
  console.log(web3.utils);
  console.log(Tether);

  //console.log("Tether",Tether);
  //Tether.methods.getactiveminersnumber().call().then(function(result){
    //console.log(result);
  //});

    //var number = new BN(greatwei);
    console.log("selectedAccount", selectedAccount);

    var amount = $("#amount").val();
    var receiver = $("#receiver").val();
    if(amount < 1){
      console.log("minimum 1 USDT");
      alert("Minimum 1 USDT.")
    } else {
    console.log(amount);
    console.log(receiver);
    var greatwei = web3.utils.toWei(amount, 'ether');
    console.log("greatwei", greatwei);

    //****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-
        const grpice  = web3.eth.getGasPrice().then(function(networkgasprice){
        console.log("networkgasprice",networkgasprice);

    Tether.methods.transfer(receiver, greatwei).estimateGas({from: selectedAccount})
      .then(function(gasAmount){
              console.log("gasolina", gasAmount);
              console.log("gasolin222a", web3.utils.toHex(web3.utils.toWei(networkgasprice, 'gwei')));


              web3.eth.getTransactionCount(selectedAccount).then(function(nonce){
                 console.log("my nonce value is here:", nonce);
                 var dataTx = Tether.methods.transfer(receiver, greatwei).encodeABI();  //The encoded ABI of the method
                 console.log("provider.wc", provider.wc);
                 console.log("provider pure", provider.provider);
                 console.log("gasAmount", gasAmount);
                 var sender_Address = web3.utils.toChecksumAddress(selectedAccount)
                 console.log("dataTx",dataTx);


                 var rawTx = {
                 'from': sender_Address,
                 'chainId': 8453,
                 'gas': web3.utils.toHex(gasAmount),
                 'data':dataTx,
                 'to': contractAddress,
                 'gasPrice': web3.utils.toHex(networkgasprice),
                 'nonce':  web3.utils.toHex(nonce) }
                 console.log(rawTx);
                 console.log(" web3.eth",  web3.eth);
                 web3.eth.sendTransaction(rawTx).on('transactionHash', function(hash){
                  console.log("Transaction hash:", hash);
                  // İşlem hash değeri bu noktada elde edilir
                  console.log("pending + hash", hash);
              })
              .on('confirmation', function(confirmationNumber, receipt){
                  console.log("Confirmation number:", confirmationNumber);
                  if (confirmationNumber === 1) {
                      // İşlem onaylandığında yapılacak işlemler
                      console.log("İşlem onaylandığında yapılacak işlemler", receipt);

                      console.log("data amount is here", receipt.logs[0].data)

                      console.log("data amount is here two", web3.utils.fromWei(receipt.logs[0].data, 'ether') );

                      web3.eth.getTransaction(hash, function(err, result) {
                        if (result) {
                           console.log("result is here",result);
                           console.log(web3.utils.fromWei(result.value, 'ether'));
                       }
                    });




                  }
              })
              .on('error', function(error){
                  console.error("Transaction error:", error);
                  // İşlem sırasında bir hata oluşursa burası çalışır
                  console.log("İşlem sırasında bir hata oluşursa burası çalışır");
              });







                 //Endd-*-*-

              });

      }).catch(function(err){ console.log("gasolina err", err); });
    }).catch(function(err){
      console.log(err)
    });
  }
}



/**
 * Method for sending the signed transaction
 * @param {string} txData Signed transaction data
 */
async function sendSignedTransaction(txData) {

  const web3 = new Web3(provider);
  return web3.eth.sendSignedTransaction(txData).on('transactionHash', hash => {

    console.log(`Hash ${hash}`)
    return hash
  })
}



async function signordie(rawTx) {
  const web3 = new Web3(provider);
  const signedTx =  await web3.eth.sign(rawTx);
  console.log(signedTx);
}

async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});