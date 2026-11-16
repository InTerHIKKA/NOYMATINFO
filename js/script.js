// Переключение вкладок RSA / AES
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    if (tabName === 'rsa') {
        tabs[0].classList.add('active');
        document.getElementById('rsaTab').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('aesTab').classList.add('active');
    }
}

// ----------------- RSA ФУНКЦИИ -----------------
function powerMod(base, exp, mod) {
    let res = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    let m = BigInt(mod);

    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % m;
        base = (base * base) % m;
        exp = exp / 2n;
    }
    return res;
}

function gcd(a, b) {
    while (b !== 0n) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modInverse(e, phi) {
    let m0 = phi;
    let y = 0n, x = 1n;
    if (phi === 1n) return 0n;

    while (e > 1n) {
        let q = e / phi;
        let t = phi;
        phi = e % phi;
        e = t;
        t = y;
        y = x - q * y;
        x = t;
    }
    if (x < 0n) x += m0;
    return x;
}

function getRSAKeys() {
    const pStr = document.getElementById('pVal').value.trim();
    const qStr = document.getElementById('qVal').value.trim();

    if (!pStr || !qStr) throw new Error('Введите числа p и q!');

    const p = BigInt(pStr);
    const q = BigInt(qStr);
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    if (phi <= 0n) throw new Error('Некорректные числа p и q!');

    let e = 65537n;
    if (e >= phi || gcd(e, phi) !== 1n) {
        e = 3n;
        while (e < phi) {
            if (gcd(e, phi) === 1n) break;
            e += 2n;
        }
    }
    const d = modInverse(e, phi);
    return { p, q, n, phi, e, d };
}

function encryptRSA() {
    const text = document.getElementById('plainTextRSA').value;
    const outputBox = document.getElementById('outputBoxRSA');

    if (!text) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Введите слово!';
        return;
    }

    try {
        const keys = getRSAKeys();
        let cipherArr = [];
        for (let i = 0; i < text.length; i++) {
            let charCode = BigInt(text.charCodeAt(i));
            if (charCode >= keys.n) {
                outputBox.style.color = '#e74c3c';
                outputBox.innerText = `Символ "${text[i]}" больше n. Увеличьте p и q!`;
                return;
            }
            let encryptedChar = powerMod(charCode, keys.e, keys.n);
            cipherArr.push(encryptedChar.toString());
        }

        outputBox.style.color = '#2ecc71';
        outputBox.innerText = cipherArr.join(', ');
        document.getElementById('cipherInputRSA').value = cipherArr.join(', ');
    } catch (err) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Ошибка: ' + err.message;
    }
}

function decryptRSA() {
    const cipherText = document.getElementById('cipherInputRSA').value;
    const outputBox = document.getElementById('outputBoxRSA');

    if (!cipherText) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Введите числа через запятую!';
        return;
    }

    try {
        const keys = getRSAKeys();
        const cipherArr = cipherText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        let decryptedText = '';

        for (let numStr of cipherArr) {
            let cipherCode = BigInt(numStr);
            let decryptedCode = powerMod(cipherCode, keys.d, keys.n);
            decryptedText += String.fromCharCode(Number(decryptedCode));
        }

        outputBox.style.color = '#3498db';
        outputBox.innerText = decryptedText;
    } catch (err) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Ошибка: ' + err.message;
    }
}

// ----------------- AES ФУНКЦИИ -----------------
function encryptAES() {
    const key = document.getElementById('aesKey').value.trim();
    const text = document.getElementById('plainTextAES').value;
    const outputBox = document.getElementById('outputBoxAES');

    if (!key) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Введите секретный ключ!';
        return;
    }
    if (!text) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Введите слово для шифрования!';
        return;
    }

    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    outputBox.style.color = '#2ecc71';
    outputBox.innerText = encrypted;
    document.getElementById('cipherInputAES').value = encrypted;
}

function decryptAES() {
    const key = document.getElementById('aesKey').value.trim();
    const cipherText = document.getElementById('cipherInputAES').value.trim();
    const outputBox = document.getElementById('outputBoxAES');

    if (!key) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Введите секретный ключ!';
        return;
    }
    if (!cipherText) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Введите зашифрованную строку!';
        return;
    }

    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (!originalText) {
            outputBox.style.color = '#e74c3c';
            outputBox.innerText = 'Неверный ключ или поврежденный текст!';
            return;
        }

        outputBox.style.color = '#3498db';
        outputBox.innerText = originalText;
    } catch (err) {
        outputBox.style.color = '#e74c3c';
        outputBox.innerText = 'Ошибка расшифровки!';
    }
}
