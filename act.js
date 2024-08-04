// Given
const n = 3233;
const d = 2753;

// Encrypted message
const encryptedMessage = [2558, 1387, 1519, 2558, 2041, 3061, 3061, 1519, 3023, 47, 1211, 1387, 908, 2100, 615, 0, 47, 1211, 1519, 615, 2369, 1387, 1519, 908, 2100, 0, 1519, 0, 3061, 824, 2549, 908, 2041, 615, 2369, 1730];

//Decryption function
function rsaDecrypt(c, d, n) {
    return BigInt(c) ** BigInt(d) % BigInt(n);
}

// Corresponding letter
function numberToLetter(num) {
    if (num < 10) {
        return String.fromCharCode(65 + num); // A=0, B=1, C=2, ..., J=9
    } else if (num >= 10 && num < 26) {
        return String.fromCharCode(65 + num);
    } else if (num == 26) {
        return ' '; // para sa space
    }
    return ''; // Undefined mapping
}

// Decrypt the message
let decryptedMessage = encryptedMessage.map(num => {
    let decryptedNum = rsaDecrypt(num, d, n);
    return decryptedNum;
});

// Convert the decrypted numbers to letters

let hor = decryptedMessage.map(num => num).join(',');
let message = decryptedMessage.map(num => numberToLetter(Number(num))).join('');

console.log(hor);
console.log("Decrypted message:", message);
