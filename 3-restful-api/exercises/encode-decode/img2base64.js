/*-----------------------------------
|     Base64 encode/decode example  |
-----------------------------------*/

// Require file system access
fs = require('fs');
// Read file buffer  
imgReadBuffer = fs.readFileSync('test-pattern.jpeg');
// Encode image buffer to Base64
imgBase64Encode = new Buffer(imgReadBuffer).toString('base64');

// Output encoded data to console
console.log(imgBase64Encode);

// Decode base64
var imgBase64Decode = new Buffer(imgBase64Encode, 'base64');
// Save decoded file file system
fs.writeFileSync('decodedBase64Image.jpeg', imgBase64Decode);
 