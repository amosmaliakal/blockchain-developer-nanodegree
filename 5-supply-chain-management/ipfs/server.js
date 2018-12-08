var express = require('express')
var serveStatic = require('serve-static')
var path = require('path')
var fetch = require('isomorphic-fetch')
var fs = require('fs')
var IPFS = require('ipfs')

var app = express()

var ipfsAPI = require('ipfs-api')
//var ipfsNode = new IPFS()

var ipfsNode = ipfsAPI('localhost', '5001', {protocol: 'http'})

app.use(serveStatic(path.join(__dirname, 'src')))
app.use(serveStatic(path.join(__dirname, 'build/contracts')))
app.use(serveStatic(path.join(__dirname, 'document_types')))

app.use('/get_images', async function(req, res, next) {
  res.send(JSON.stringify(fs.readdirSync("./document_types")));
})

app.use('/upload_to_ipfs', async function(req, res, next) {
  //let's first download the image into a temporary folder 
  fetch(req.query.imageUrl)
    .then(image => {
      let filename = './tmp/' + req.query.name + '.png'
      const fileStream = fs.createWriteStream(filename)
      image.body.pipe(fileStream)

      fileStream.on('finish', function() {
        let uploadImage = {
          path: req.query.name,
          content: fs.createReadStream(filename)
        }

        ipfsNode.files.add(uploadImage, function(err, ipfsFile) {
          if (!err) {
            res.send({
              'ipfsHash': ipfsFile[0].hash
            })

          } else {
            console.log(err)
          }
        })
      })
    })
})

app.listen(3000)