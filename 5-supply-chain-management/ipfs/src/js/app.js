App = {
  web3Provider: null,
  contracts: {},
  currentColor: null,

  init: function() {

    $.getJSON("/get_images").then(function (files) {
      files.forEach(function(file) { 
        App.addDocument("", file)
      })       
    })

    // document.querySelector('#loading-gif').setAttribute('style', 'visibility: hidden;')

    return App.initWeb3()
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
      web3 = new Web3(App.web3Provider)
    }

    return App.initContract()
  },

  initContract: function() {
    $.getJSON('Gallery.json', function(data) {
      var galleryArtficact = data
      App.contracts.GalleryContract = TruffleContract(galleryArtficact)
      App.contracts.GalleryContract.setProvider(App.web3Provider)
    })

    return App.loadOwnedDocuments()
  },

  loadOwnedDocuments: function () { 
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      var contractInstance;

      App.contracts.GalleryContract.deployed().then(function(instance) {
        contractInstance = instance;
        return contractInstance.tokensOf(account)
      }).then((result) => { 
        result.forEach((token) => { 
          App.addOwnedDocument(token)
        })
      }).catch(function(err) {
        console.log(err.message);
      });
    });

    return App.bindEvents()
  },

  bindEvents: function() {
    $(document).on('click', '.document-div', App.documentClicked)
    $(document).on('click', '.owned-document-div', App.ownedDocumentClicked)
  },

  documentClicked: function() {
    let imageUrl = $(this).context.childNodes[0].src
    let name = $(this).context.childNodes[1].innerText

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];
      App.contracts.GalleryContract.deployed().then(function(instance) {
        galleryInstance = instance;
        $.getJSON("/upload_to_ipfs", {
          name: name,
          imageUrl: imageUrl
        }, function(data) {
          galleryInstance.mint(data.ipfsHash, {
            from: account,
            value: new web3.BigNumber(web3.toWei(.001, "ether"))
          })
        })
      }).then(function(result) {}).catch(function(err) {
        console.log(err.message)
      })
    })
  },

  ownedDocumentClicked: function () { 
    let tokenId = $(this).context.childNodes[0].innerText
    let ipfsHash;
    App.contracts.GalleryContract.deployed().then(function(instance) {
      contractInstance = instance;
      return contractInstance.getIpfsHash(tokenId)
    }).then((result) => { 
      App.addIPFSHash(tokenId, result)
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  addDocument: function(name, imageUrl) {
    let container = document.createElement('div')
    let imgElement = document.createElement('img')
    let pElement = document.createElement('p')

    container.setAttribute('style', 'display:inline-block')
    container.setAttribute('class', 'document-div')

    imgElement.setAttribute('src', imageUrl)
    pElement.innerText = name

    container.appendChild(imgElement)
    container.appendChild(pElement)

    document.querySelector('#gallery').appendChild(container)
  },

  addOwnedDocument: function(token) {
    let container = document.createElement('div')
    let pElement = document.createElement('p')

    pElement.innerText = token.toString()

    container.setAttribute('id', token)
    container.setAttribute('class', 'owned-document-div')

    container.appendChild(pElement)

    document.querySelector('#ownedDocuments').appendChild(container)
  }, 

  addIPFSHash: function(token, ipfsHash) {
    let tokenElement = document.getElementById(token.toString())
    let hrefElement = document.createElement('a')

    hrefElement.setAttribute('href', "https://ipfs.io/ipfs/" + ipfsHash)
    hrefElement.innerText = token + " : " + ipfsHash.toString()
    tokenElement.parentElement.appendChild(hrefElement)
  }
}

$(function() {
  $(window).load(function() {
    App.init()
  })
})