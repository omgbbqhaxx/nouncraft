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
let web3Modal;

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
  document.querySelector("#btn-disconnect").style.display = "none";
  document.querySelector(".blockimage").style.display = "none";

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
      },
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_391E26A3B43A3350",
      },
    },
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

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  // Get a handl
  const template = document.querySelector("#template-balance");
  //const accountContainer = document.querySelector("#accounts");
  //document.querySelector("#network-name").textContent = chainData.name;
  //document.querySelector("#selected-account").textContent = selectedAccount;

  // Purge UI elements any previously loaded accounts
  //accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);

    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    const clone = template.content.cloneNode(true);
    clone.querySelector(".address").textContent = address;
    clone.querySelector(".balance").textContent = humanFriendlyBalance;

    //accountContainer.appendChild(clone);

    // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    var icon = blockies.create({
      // All options are optional
      seed: address, // seed used to generate icon data, default: random
      //color: '#dfe', // to manually specify the icon color, default: random
      //bgcolor: '#aaa', // choose a different background color, default: random
      size: 15, // width/height of the icon in blocks, default: 8
      scale: 3, // width/height of each block in pixels, default: 4
      //spotcolor: '#000' // each pixel has a 13% chance of being of a third color,
      // default: random. Set to -1 to disable it. These "spots" create structures
      // that look like eyes, mouths and noses.
    });
    console.log(icon);
    $(".blockimage").attr("src", icon.toDataURL());
    //$(".blockimage").append(icon);
    // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  });

  await Promise.all(rowResolvers);
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#btn-disconnect").style.display = "block";
  document.querySelector(".blockimage").style.display = "block";
  document.querySelector("#connected").style.display = "block";
}

async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#btn-disconnect").style.display = "block";
  document.querySelector(".blockimage").style.display = "block";
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled");

  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled");
}

async function approvefunction() {
  const web3 = new Web3(provider);

  //await fetchAccountData(provider);
  const contractAddress = "0xbB56a9359DF63014B3347585565d6F80Ac6305fd";
  var VRNounsNFTContract = new web3.eth.Contract(
    [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [],
        name: "COLORS",
        outputs: [{ internalType: "string[80]", name: "", type: "string[80]" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "attributes",
        outputs: [
          { internalType: "string", name: "co", type: "string" },
          { internalType: "string", name: "coo", type: "string" },
          { internalType: "string", name: "cooo", type: "string" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "getApproved",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getEthBalance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "_owner", type: "address" }],
        name: "getNFTzBelongingToOwner",
        outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "maxNFT",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "newTokenId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "_minter", type: "address" }],
        name: "publicmint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "operator", type: "address" },
          { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
        ],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
        name: "tokenByIndex",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "index", type: "uint256" },
        ],
        name: "tokenOfOwnerByIndex",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_wamount", type: "uint256" },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    "0xbB56a9359DF63014B3347585565d6F80Ac6305fd"
  );

  const erc405address = "0x2eC7dDaC189f429954dB8717A5e8a584BB652f48";
  var erc405Contract = new web3.eth.Contract(
    [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Burn",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Mint",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenAmount", type: "uint256" },
        ],
        name: "BurntokenAndwithdrawNFT",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "_random",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "address", name: "", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_spender", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_spender", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
          { internalType: "bytes", name: "_extraData", type: "bytes" },
        ],
        name: "approveAndCall",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
        name: "burn",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "minttoken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "nftCollection",
        outputs: [
          { internalType: "contract IERC721", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "poolNFTs",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "tokenamount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    "0x2eC7dDaC189f429954dB8717A5e8a584BB652f48"
  );

  VRNounsNFTContract.options.gasPrice = "200000";
  VRNounsNFTContract.options.gas = 5000000;
  console.log(web3.utils);

  var nftid = $("#nftid").val();

  if (nftid < 1) {
    console.log("minimum 1 aaa");
    alert("Minimum 1 aaa.");
  } else {
    console.log(nftid);

    //****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-
    const grpice = web3.eth
      .getGasPrice()
      .then(function (networkgasprice) {
        console.log("networkgasprice", networkgasprice);

        VRNounsNFTContract.methods
          .approve(
            "0x2eC7dDaC189f429954dB8717A5e8a584BB652f48",
            web3.utils.toHex(nftid)
          )
          .estimateGas({ from: selectedAccount })
          .then(function (gasAmount) {
            console.log("gasolina", gasAmount);
            console.log(
              "gasolin222a",
              web3.utils.toHex(web3.utils.toWei(networkgasprice, "gwei"))
            );

            web3.eth
              .getTransactionCount(selectedAccount)
              .then(function (nonce) {
                console.log("my nonce value is here:", nonce);
                var dataTx = VRNounsNFTContract.methods
                  .approve(
                    "0x2eC7dDaC189f429954dB8717A5e8a584BB652f48",
                    web3.utils.toHex(nftid)
                  )
                  .encodeABI(); //The encoded ABI of the method

                console.log("provider.wc", provider.wc);
                console.log("provider pure", provider.provider);
                console.log("gasAmount", gasAmount);
                var sender_Address =
                  web3.utils.toChecksumAddress(selectedAccount);
                console.log("dataTx", dataTx);

                var rawTx = {
                  from: sender_Address,
                  chainId: 1, //omgbbqhax
                  gas: web3.utils.toHex(gasAmount),
                  data: dataTx,
                  to: contractAddress,
                  gasPrice: web3.utils.toHex(networkgasprice),
                  nonce: web3.utils.toHex(nonce),
                };

                console.log(rawTx);
                console.log(" web3.eth", web3.eth);

                web3.eth.sendTransaction(rawTx);
              });
          })
          .catch(function (err) {
            console.log("gasolina err", err);
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

async function minttoken() {
  const web3 = new Web3(provider);

  const erc405address = "0x2eC7dDaC189f429954dB8717A5e8a584BB652f48";
  var erc405Contract = new web3.eth.Contract(
    [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Burn",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Mint",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenAmount", type: "uint256" },
        ],
        name: "BurntokenAndwithdrawNFT",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "_random",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "address", name: "", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_spender", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_spender", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
          { internalType: "bytes", name: "_extraData", type: "bytes" },
        ],
        name: "approveAndCall",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
        name: "burn",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "minttoken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "nftCollection",
        outputs: [
          { internalType: "contract IERC721", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "poolNFTs",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "tokenamount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    "0x2eC7dDaC189f429954dB8717A5e8a584BB652f48"
  );

  erc405Contract.options.gasPrice = "200000";
  erc405Contract.options.gas = 5000000;
  console.log("erc405Contract", erc405Contract);
  console.log(web3.utils);

  var nftid = $("#nftid").val();

  if (nftid < 1) {
    console.log("id can minimum 1");
    alert("Minimum 1 aaa.");
  } else {
    console.log(nftid);

    //****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-
    const grpice = web3.eth
      .getGasPrice()
      .then(function (networkgasprice) {
        console.log("networkgasprice", networkgasprice);

        erc405Contract.methods
          .minttoken(web3.utils.toHex(nftid))
          .estimateGas({ from: selectedAccount })
          .then(function (gasAmount) {
            console.log("gasolina", gasAmount);
            console.log(
              "gasolin222a",
              web3.utils.toHex(web3.utils.toWei(networkgasprice, "gwei"))
            );

            web3.eth
              .getTransactionCount(selectedAccount)
              .then(function (nonce) {
                console.log("my nonce value is here:", nonce);
                var dataTx = erc405Contract.methods
                  .minttoken(web3.utils.toHex(nftid))
                  .encodeABI(); //The encoded ABI of the method

                console.log("provider.wc", provider.wc);
                console.log("provider pure", provider.provider);
                console.log("gasAmount", gasAmount);
                var sender_Address =
                  web3.utils.toChecksumAddress(selectedAccount);
                console.log("dataTx", dataTx);

                var rawTx = {
                  from: sender_Address,
                  chainId: 1, //omgbbqhax
                  gas: web3.utils.toHex(gasAmount),
                  data: dataTx,
                  to: erc405address,
                  gasPrice: web3.utils.toHex(networkgasprice),
                  nonce: web3.utils.toHex(nonce),
                };

                console.log(rawTx);
                console.log(" web3.eth", web3.eth);

                web3.eth.sendTransaction(rawTx);
              });
          })
          .catch(function (err) {
            console.log("gasolina err", err);
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

async function BurntokenAndwithdrawNFT() {
  const web3 = new Web3(provider);

  const erc405address = "0x2eC7dDaC189f429954dB8717A5e8a584BB652f48";
  var erc405Contract = new web3.eth.Contract(
    [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Burn",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Mint",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenAmount", type: "uint256" },
        ],
        name: "BurntokenAndwithdrawNFT",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "_random",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "address", name: "", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_spender", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_spender", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
          { internalType: "bytes", name: "_extraData", type: "bytes" },
        ],
        name: "approveAndCall",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
        name: "burn",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "minttoken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "nftCollection",
        outputs: [
          { internalType: "contract IERC721", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "poolNFTs",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "tokenamount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    "0x2eC7dDaC189f429954dB8717A5e8a584BB652f48"
  );

  erc405Contract.options.gasPrice = "200000";
  erc405Contract.options.gas = 5000000;
  console.log("erc405Contract", erc405Contract);

  var onetoken = web3.utils.toWei("1", "ether");

  console.log("onetoken", onetoken);

  //****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-****-*-*-*-
  const grpice = web3.eth
    .getGasPrice()
    .then(function (networkgasprice) {
      console.log("networkgasprice", networkgasprice);

      erc405Contract.methods
        .BurntokenAndwithdrawNFT(web3.utils.toHex(onetoken))
        .estimateGas({ from: selectedAccount })
        .then(function (gasAmount) {
          console.log("gasolina", gasAmount);
          console.log(
            "gasolin222a",
            web3.utils.toHex(web3.utils.toWei(networkgasprice, "gwei"))
          );

          web3.eth.getTransactionCount(selectedAccount).then(function (nonce) {
            console.log("my nonce value is here:", nonce);
            var dataTx = erc405Contract.methods
              .BurntokenAndwithdrawNFT(web3.utils.toHex(onetoken))
              .encodeABI(); //The encoded ABI of the method

            console.log("provider.wc", provider.wc);
            console.log("provider pure", provider.provider);
            console.log("gasAmount", gasAmount);
            var sender_Address = web3.utils.toChecksumAddress(selectedAccount);
            console.log("dataTx", dataTx);

            var rawTx = {
              from: sender_Address,
              chainId: 1, //omgbbqhax
              gas: web3.utils.toHex(gasAmount),
              data: dataTx,
              to: erc405address,
              gasPrice: web3.utils.toHex(networkgasprice),
              nonce: web3.utils.toHex(nonce),
            };

            console.log(rawTx);
            console.log(" web3.eth", web3.eth);

            web3.eth.sendTransaction(rawTx);
          });
        })
        .catch(function (err) {
          console.log("gasolina err", err);
        });
    })
    .catch(function (err) {
      console.log(err);
    });
}

/**
 * Method for sending the signed transaction
 * @param {string} txData Signed transaction data
 */
async function sendSignedTransaction(txData) {
  const web3 = new Web3(provider);
  return web3.eth
    .sendSignedTransaction(txData)
    .on("transactionHash", (hash) => {
      console.log(`Hash ${hash}`);
      return hash;
    });
}

async function signordie(rawTx) {
  const web3 = new Web3(provider);
  const signedTx = await web3.eth.sign(rawTx);
  console.log(signedTx);
}

async function onConnect() {
  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch (e) {
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
  if (provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#btn-disconnect").style.display = "none";
  document.querySelector(".blockimage").style.display = "none";
}

/**
 * Main entry point.
 */
window.addEventListener("load", async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document
    .querySelector("#btn-disconnect")
    .addEventListener("click", onDisconnect);
});
