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
        1: "https://rpc.scroll.io",
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
    console.log("first of all i need to get chainData.name", chainData.name);

    if(chainData.name=="scroll") {

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

  const contractAddress =  "0xe43963dC6b4CDC6F860119E70332bb317f4f2CBC";
  var Tether = new web3.eth.Contract([{"type":"constructor","stateMutability":"nonpayable","inputs":[]},{"type":"event","name":"ProductDelisted","inputs":[{"type":"address","name":"lister","internalType":"address","indexed":true},{"type":"uint256","name":"productId","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"ProductListed","inputs":[{"type":"address","name":"lister","internalType":"address","indexed":true},{"type":"uint256","name":"productId","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"ProductPriceChanged","inputs":[{"type":"address","name":"lister","internalType":"address","indexed":true},{"type":"uint256","name":"productId","internalType":"uint256","indexed":false},{"type":"uint256","name":"newPrice","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"payable","outputs":[],"name":"buyproduct","inputs":[{"type":"uint256","name":"productID","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeProductPrice","inputs":[{"type":"uint256","name":"productId","internalType":"uint256"},{"type":"uint256","name":"newPrice","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"checkDownload","inputs":[{"type":"address","name":"buyer","internalType":"address"},{"type":"uint256","name":"productID","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"delistProduct","inputs":[{"type":"uint256","name":"productId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple","name":"","internalType":"struct NounCraft.Product","components":[{"type":"address","name":"lister","internalType":"address"},{"type":"string","name":"productImage","internalType":"string"},{"type":"string","name":"productURL","internalType":"string"},{"type":"uint256","name":"productPrice","internalType":"uint256"},{"type":"string","name":"productExplanation","internalType":"string"},{"type":"bool","name":"isDelisted","internalType":"bool"}]}],"name":"getProduct","inputs":[{"type":"uint256","name":"productId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getblockhash","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"listProduct","inputs":[{"type":"string","name":"productImage","internalType":"string"},{"type":"string","name":"productURL","internalType":"string"},{"type":"uint256","name":"productPrice","internalType":"uint256"},{"type":"string","name":"productExplanation","internalType":"string"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nAddrHash","inputs":[]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nAddrHashx","inputs":[{"type":"address","name":"x","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"productCount","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferOwnership","inputs":[{"type":"address","name":"newOwner","internalType":"address payable"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"}]}],"0xe43963dC6b4CDC6F860119E70332bb317f4f2CBC");
 

  


  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
    const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);

    const getstatus =  await Tether.methods.checkDownload(address, 1).call().then(function(result){
      //the result holds your Token Balance that you can assign to a var
        console.log("resulttt", result);
      if(result) {
        //if result is true user can download content
        document.querySelector("#playwithmmask").style.display = "none";
        document.querySelector("#startdownload").style.display = "block";
        console.log("if purchasement is true", result);

      } else {
        // else show buy button only!.

      }
       

    });

    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    const clone = template.content.cloneNode(true);
    clone.querySelector(".address").textContent = address;
    clone.querySelector(".balance").textContent = humanFriendlyBalance;

    accountContainer.appendChild(clone);
  });

  await Promise.all(rowResolvers);
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
} else {
      // Call the function when needed
  switchOrAddNetwork();
}

}

async function switchOrAddNetwork() {
    const networkParams = {
      chainId: '0x82750', // Replace with the hexadecimal chain ID of your network
      rpcUrls: ['https://rpc.scroll.io'],
      chainName: 'Scroll',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://blockscout.scroll.io/'],
    };
  
    try {
      // Try to switch to the network
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x82750' }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          // Try to add the network
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams],
          });
        } catch (addError) {
          // Handle any errors that occur when trying to add the network
          console.error('Error adding network:', addError);
        }
      } else {
        // Handle other errors
        console.error('Error switching network:', error);
      }
    }
  }
  

  


 
async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}

 


async function generateMemo() {

  const web3 = new Web3(provider);

  //await fetchAccountData(provider);
  const contractAddress =  "0xe43963dC6b4CDC6F860119E70332bb317f4f2CBC";
  var Tether = new web3.eth.Contract([{"type":"constructor","stateMutability":"nonpayable","inputs":[]},{"type":"event","name":"ProductDelisted","inputs":[{"type":"address","name":"lister","internalType":"address","indexed":true},{"type":"uint256","name":"productId","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"ProductListed","inputs":[{"type":"address","name":"lister","internalType":"address","indexed":true},{"type":"uint256","name":"productId","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"ProductPriceChanged","inputs":[{"type":"address","name":"lister","internalType":"address","indexed":true},{"type":"uint256","name":"productId","internalType":"uint256","indexed":false},{"type":"uint256","name":"newPrice","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"payable","outputs":[],"name":"buyproduct","inputs":[{"type":"uint256","name":"productID","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeProductPrice","inputs":[{"type":"uint256","name":"productId","internalType":"uint256"},{"type":"uint256","name":"newPrice","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"checkDownload","inputs":[{"type":"address","name":"buyer","internalType":"address"},{"type":"uint256","name":"productID","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"delistProduct","inputs":[{"type":"uint256","name":"productId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple","name":"","internalType":"struct NounCraft.Product","components":[{"type":"address","name":"lister","internalType":"address"},{"type":"string","name":"productImage","internalType":"string"},{"type":"string","name":"productURL","internalType":"string"},{"type":"uint256","name":"productPrice","internalType":"uint256"},{"type":"string","name":"productExplanation","internalType":"string"},{"type":"bool","name":"isDelisted","internalType":"bool"}]}],"name":"getProduct","inputs":[{"type":"uint256","name":"productId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getblockhash","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"listProduct","inputs":[{"type":"string","name":"productImage","internalType":"string"},{"type":"string","name":"productURL","internalType":"string"},{"type":"uint256","name":"productPrice","internalType":"uint256"},{"type":"string","name":"productExplanation","internalType":"string"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nAddrHash","inputs":[]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nAddrHashx","inputs":[{"type":"address","name":"x","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"productCount","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferOwnership","inputs":[{"type":"address","name":"newOwner","internalType":"address payable"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"}]}],"0xe43963dC6b4CDC6F860119E70332bb317f4f2CBC");
  var productID = 1;


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
    document.querySelector("#playwithmmask").textContent  = "Please wait 1 blockchain conf..";
    var greatwei = web3.utils.toWei('0.0001', 'ether');

    console.log("greatwei", greatwei);
    const grpice  = web3.eth.getGasPrice().then(function(networkgasprice){
    console.log("networkgasprice",networkgasprice);

    Tether.methods.buyproduct(productID).estimateGas({from: selectedAccount , value: greatwei})
      .then(function(gasAmount){
              console.log("gasolina", gasAmount);
              console.log("gasolin222a", web3.utils.toHex(web3.utils.toWei(networkgasprice, 'gwei')));
              

              web3.eth.getTransactionCount(selectedAccount).then(function(nonce){
                 console.log("my nonce value is here:", nonce);
                 var dataTx = Tether.methods.buyproduct(productID).encodeABI();  //The encoded ABI of the method
                 console.log("provider.wc", provider.wc);
                 console.log("provider pure", provider.provider);
                 console.log("gasAmount", gasAmount);
                 var sender_Address = web3.utils.toChecksumAddress(selectedAccount)
                 console.log("dataTx",dataTx);


                 var rawTx = {
                 'from': sender_Address,
                 'value': greatwei,
                 'chainId': 534352,
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
                  //checkiechan
                  document.querySelector("#playwithmmask").style.display = "none";
                  document.querySelector("#startdownload").style.display = "block";

                  
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
              });

      }).catch(function(err){ console.log("gasolina err", err); });
    }).catch(function(err){
      console.log(err)
    });
  
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

async function onDisconnect() {
  console.log("Killing the wallet connection", provider);
  if(provider.close) {
    await provider.close();
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