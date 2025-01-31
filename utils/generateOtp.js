// const crypto = require('crypto');

// function generateOtp() {
//     return crypto.randomBytes(3).toString('hex');
// }

function generateOtp(length) {
    var text = "";
    var possible = "123456789";
    for (var i = 0; i < length; i++) {
        var sup = Math.floor(Math.random() * possible.length);
        text += i > 0 && sup == i ? "0" : possible.charAt(sup);
    }
    return Number(text);
};

module.exports = generateOtp;
