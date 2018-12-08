

let timeouts = [];
let addressRequest = [];
let whiteList = [];
let verificationTimeWall = 5*60*1000;
let whiteListTimeWall = 30*60*1000;

function addWhiteList(address){
    whiteList.push(address)
    timeouts[address] = setTimeout(function(){ removeWhiteList(address) }, whiteListTimeWall );
}

function isWhiteList(address){
    for (var i in whiteList) {
        if(whiteList[i] === address){
            console.log('Address ',address,'found in white list');
            // remove from array by index
            return true;
        }
    }
    return false;
}
function removeWhiteList(address){
    //Remove the element.
    for (var i in whiteList) {
        if(whiteList[i] === address){
            console.log('Removed address',address,'from white list');
            // remove from array by index
            whiteList.splice(i, 1);
        }
    }
}
function validateBlockchainID(address){
    // check if active
    return checkStatus(address).then(response =>
        {
            if(!response){
                // time stamp
                let timeStamp = new Date().getTime().toString().slice(0,-3);
                // object
                let obj = {};
                // Configure object properties
                obj.address = address;
                obj.requestTimeStamp = timeStamp;
                obj.message = address+':'+timeStamp+':'+'starRegistry';
                obj.validationWindow = verificationTimeWall / 1000;

                //add the element.
                addressRequest.push(obj);
                timeouts[address] = setTimeout(function(){ removeValidation(address) }, verificationTimeWall );
                return obj;
            } else {
                return response;
            }
    }); 
}

function removeValidation(address){
    //Remove the element.
    for (var i in addressRequest) {
        let data = addressRequest[i];
        if(data.address === address){
            console.log('Removed address',address,'from queue');
            // remove from array by index
            addressRequest.splice(i, 1);
        }
    }
}

function checkStatus(address){
    return new Promise(function (resolve, reject) {
        for (var i in addressRequest) {
            let data = addressRequest[i];
            if(data.address === address){
                timeElapse = (new Date().getTime().toString().slice(0,-3)) - data.requestTimeStamp;
                timeLeft = (verificationTimeWall/1000) - timeElapse;
                data.validationWindow = timeLeft;
                resolve(data);
            }
        }
        resolve(false);
    })
}

module.exports = {
    validateBlockchainID : validateBlockchainID,
    removeValidation : removeValidation,
    addWhiteList : addWhiteList,
    isWhiteList : isWhiteList,
    removeWhiteList : removeWhiteList,
    checkStatus : checkStatus
}
