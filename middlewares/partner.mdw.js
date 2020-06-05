const createError = require('http-errors');
const config = require('../config/default.json');
const moment = require('moment');
const openpgp = require('openpgp');
const crypto = require('crypto');

//cac key cua ngan hang phan van hau
const pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org      

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
3q1A
=/0ZM
-----END PGP PUBLIC KEY BLOCK-----`;
const privkey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org

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
bYr+EdyxjzPTPmuiUqwCIMwH2t6tQA==
=KWRc
-----END PGP PRIVATE KEY BLOCK-----`; //encrypted private key



module.exports = {

    partnerCode: (req, res, next) => {
        const partnerCode = req.headers['x-partner-code'];
        //so sanh partnerCode
        if (partnerCode === config.partner.partnerCodePGP ||
            partnerCode === config.partner.partnerCodeRSA ||
            partnerCode === config.partner.testCode) {
            console.log('partnerCode: passed');
            next();

        } else {
            res.send('Invalid partnerCode or partnerCode not found');
            throw createError(401, 'Invalid partnerCode or partnerCode not found');
        }
    },
    partnerTime: (req, res, next) => {

        const partnerTime = req.headers['x-partner-time'];
        const now = moment().unix();
        //kiem tra goi tin da qua han hay chua, chi chap nhan goi tin da gui duoi 60s
        if ((now - partnerTime) <= 60) {
            console.log('partnerTime: passed');
            next();
        } else {

            res.send('Invalid time');
            throw createError(401, 'Invalid time');
        }
    },
    partnerSig: (req, res, next) => {

        const partnerSig = req.headers['x-partner-sig']; //lay partnerSig do nganHangB hashmd5 ra
        const partnerTime = +req.headers['x-partner-time']; //lay time gui goi tin, '+' de parse sang number type
        //obj chua body: la UserID(user-account/infor) hoac la UserID,Number,Money(account-number/add)
        const obj = {
            Body: req.body,
            Time: partnerTime
        };
        console.log(obj);
        //hash obj chua req.body va time
        //const hash = CryptoJS.MD5(JSON.stringify(obj), config.partner.SecretKey).toString();
        const hash = crypto.createHmac('md5', config.partner.SecretKey).update(JSON.stringify(obj)).digest('hex');

        if (partnerSig === hash) {
            console.log('partnerSig: passed')
            next();
        } else {

            res.send('Invalid signature');
            throw createError(401, 'Invalid signature');
        }

    },
    partnerAsymmetricSig: (req, res, next) => {
        const code = req.headers['x-partner-code'];
        // put keys in backtick (``) to avoid errors caused by spaces or tab
        //public key cua ngan hang doi tac
        var NganHangBPublicKey;
        if (code === config.partner.testCode) { //neu la ngan hang dung PGP
            NganHangBPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org

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
=xag1
-----END PGP PUBLIC KEY BLOCK-----`;

        } else if (code === config.partner.partnerCodeRSA) { //neu la ngan hang dung RSA
            NganHangBPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXsiMbQEEAMXVRfgK2mrgkjS+aRuvzJ6yamOkmubfNmVFhHtD0Fa4K7dUu+6J
ER1ASRBheCC0dnO8wWFYeRim7VDzq4PM4VkJDbv3W+I4pKHAEqsYsoFWaO+PpwS+
7zORZcF3wuemA55DFvmEjbYXvc3wBRh9dKBlFwqsuZiIkOawnvB5b3wjABEBAAHN
IVh1YW4gTmdoaWVtIDx4dWFuZ2hqZW1AZ21haWwuY29tPsKtBBMBCgAXBQJeyIxt
AhsvAwsJBwMVCggCHgECF4AACgkQ+g79YOVsCy+0oQP+MXFIYyoMx9JNQONwdmd8
txKcjgBFfThAd5qQ/DqYbfVg4xkqP+JPimFc5r0Gphv3ptRq6PDwHQS/tPSwvpgG
8+lij7cDQqDugbDkFG5LFY3zUTTGMOWFtTi07gqE1FGRpmRjOWR5XBBGz0IrNL8t
orT7bdETusMF9NxOuIjX6DTOjQReyIxtAQQAtKqIuaPql8eXdG4frED7xTJhsSGj
Mmr6uiG+2yJygTOPaM49/Wl1e46QmIUw0Ev1Cs/y8G5uKj3EAiCm7nasfxOw4I3c
dhDi8v7O/BGqK26h8Rhn7J4riTeSQ33qG0/6C8IZ6yY9nEOpBDgrcsT32emUiVd5
BAQVGzGQBpSTtOsAEQEAAcLAgwQYAQoADwUCXsiMbQUJDwmcAAIbLgCoCRD6Dv1g
5WwLL50gBBkBCgAGBQJeyIxtAAoJEJAWiBuoaW8cqjYD/j/7OMrwuqBhtaJmrRlH
1aRrafF8d4XwFcs5Y/1cwhiiWLdRoDVc9QOIiq3rLnqV4CAp1omFc4MLz5XxKyPK
N18LlzRGNdHR7qyaNFg6s8hGyn6D97x6cgY9AYEQFbvek52GDKeJDYdp61QxTZ4M
FzyA+pdU567jTyCKkbBkuajb8KAD/R+/diVFSUBErMNloIf2nYMKNvuNoo/RAvvz
PTmiEJr974FtKEFJwdb5WGAPI75BwlZckauR3kSKJyBJYzSi3smiV56Ht14MUsdy
RQC60sArqVbUV7r+Jr4f2Hfmgyn3juVmTBzlonbe1iKR7SkZvoHDHeMLuoBIysNk
c97Jj2IIzo0EXsiMbQEEANa4W5Gw5jS6pN7bBu1XTJkg/8xXkFxJciGw9m6oO5kF
XGbdxKb1KODzWpRpwHZu7rBeOfsEglJ6sqiwxos3GHL8D16+SkrZGtZs5ZSqn5mF
gL6QMmgNnbEEP22M/bAK87a1Y2EHMabCJ4scGphwsWO+9snTlvO7igxxCp0AN4jV
ABEBAAHCwIMEGAEKAA8FAl7IjG0FCQ8JnAACGy4AqAkQ+g79YOVsCy+dIAQZAQoA
BgUCXsiMbQAKCRDbb5Kf4RabYA/7A/4vF/n1IdPGhaHVDJNWY5U+ZNvEUDHPRksN
tlHCSvLA/Xe7abfGSPQy6B3HaJyPNj9tfWgiRv65nuw9a1TvqgTRRPH785nISIvT
fY48Cb+fXV5oW6aOYu53Xetz0r+6XbzMd2WyPKD4t6htaSXIrFrUaDGKSA5UdDaC
gmsnnyoUpUbVA/0bAhYchn00PaR9A60r0Tu+vdKW/Eh3cqwrYbtwm3WE5pipOuvd
ZNdWTnvOiG7+wdM3DbR/ANOP9zIZ5GcpOF0zGlrUjxV38nOiS6xdPA1es63drLq6
fs3cH8Lv0BwTkiAjcJXlpRi8vKPnoZTbtoV5Czt/eNjzrlrgEe44T+A6Ww==
=2KAC
-----END PGP PUBLIC KEY BLOCK-----`;
        } else if (code === config.partner.partnerCodePGP) {
            NganHangBPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
FxzP2+m6kXwJBnolqhvtIYW1rw==
=qdcE
-----END PGP PUBLIC KEY BLOCK-----`;
        }
        //gan public key de qua route lay dung
        req.NganHangBPublicKey = NganHangBPublicKey;

        const passphrase = `mrhauphan`; //what the privKey is encrypted with

        const NganHangBMessage = req.body.message; //body gui den chua encryptedMessage, nganHangA lay ve decrypt message
        const encryptDecryptFunction = async() => {
            const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]
            await privKeyObj.decrypt(passphrase)


            const options = {
                message: await openpgp.message.readArmored(NganHangBMessage), // parse armored message
                publicKeys: (await openpgp.key.readArmored(NganHangBPublicKey)).keys, // for verification (optional)
                privateKeys: [privKeyObj] // for decryption
            };

            openpgp.decrypt(options).then(plaintext => { //decrypt message thanh cong, tra ra dt gom {UserID..Number..Money}
                dt = JSON.parse(plaintext.data);
                console.log(dt);
                req.Data = dt; //gan req.Data = dt de qua route account-number/add goi ra UserID va Money de cong tien
                if (plaintext.signatures[0].valid) {
                    console.log("partnerAsymmetricSig: passed");
                    next();
                } else {
                    res.send('Invalid  asymmetric signature');
                    throw createError(401, 'Invalid asymmetric signature');
                }
            });
        }
        encryptDecryptFunction();

    }
}