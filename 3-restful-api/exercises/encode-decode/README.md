# Encoding and decoding image data with node.js

Two examples of encoding and decoding image data are provided.

1. img2hex.js
2. img2base64.js

test-pattern.jpeg image file provided for testing. Upon testing, the test file will be encoded and decoded. The output of the decoded file will be saved within the root directory.
## Encoding Data ##

1. Require file system access
```
fs = require('fs');
```
2. Read file
```
fileReadBuffer = fs.readFileSync(FILE_SOURCE);
```
3. Encode file to string
```
fileEncode = new Buffer(fileReadBuffer).toString(ENCODE_TYPE);
```

## Decode Data ##

1. Configure buffer reader with encoded type (i.e. base64 or hex)
```
fileDecode = new Buffer(fileReadBuffer, ENCODE_TYPE);
```
2. Save file
```
fs.writeFileSync('FILE_NAME', fileDecode);
```