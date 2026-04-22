const isPrime = n => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
    return true;
};
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const power = (b, e, m) => {
    let r = 1n; b = BigInt(b) % BigInt(m); e = BigInt(e);
    while (e > 0n) { if (e % 2n === 1n) r = (r * b) % BigInt(m); b = (b * b) % BigInt(m); e /= 2n; }
    return r;
};
function modInverse(e, phi) {
    let m0 = phi, t, q, x0 = 0n, x1 = 1n;
    if (phi === 1n) return 0n;
    while (e > 1n) { q = e / phi; t = phi; phi = e % phi; e = t; t = x0; x0 = x1 - q * x0; x1 = t; }
    return x1 < 0n ? x1 + m0 : x1;
}

function getKeys() {
    const p = parseInt(document.getElementById('p_val').value);
    const q = parseInt(document.getElementById('q_val').value);
    if (!isPrime(p) || !isPrime(q)) throw new Error("p и q должны быть простыми!");
    
    const n = BigInt(p * q);
    const phi = BigInt((p - 1) * (q - 1));
    let e = 3n;
    while (gcd(Number(e), Number(phi)) !== 1) e += 2n;
    const d = modInverse(e, phi);
    return { e, d, n };
}

function encryptRSA() {
    try {
        const { e, n } = getKeys();
        const text = document.getElementById('word_to_encrypt').value;
        if (!text) return alert("Введите текст");

        const encrypted = Array.from(text).map(char => power(char.charCodeAt(0), e, n));
       document.getElementById('result').innerHTML = `<b>Result:</b><br>${encrypted.join(', ')}`;
    } catch (err) {
    document.getElementById('result').innerHTML = `<span style="color: #ff6b6b;">Ошибка: ${err.message}</span>`;
    }
}

function decryptRSA() {
    try {
        const { d, n } = getKeys();
        const input = document.getElementById('numbers_to_decrypt').value;
        if (!input) {
            alert("Введите числа через запятую");
            return;
        }
        const numbersArray = input.split(',').map(num => BigInt(num.trim()));
        
        const decrypted = numbersArray.map(num => String.fromCharCode(Number(power(num, d, n)))).join('');
        
        document.getElementById('result').innerHTML = `<b>Decrypted:</b><br>${decrypted}`;
    } catch (err) {
        document.getElementById('result').innerHTML = `<span style="color: #ff6b6b;">Error: ${err.message}</span>`;
    }
}
