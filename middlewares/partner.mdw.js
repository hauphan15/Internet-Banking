const createError = require('http-errors');
const config = require('../config/default.json');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const openpgp = require('openpgp');

//cac key cua ngan hang phan van hau
const pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org

xsFNBF62T8EBEADHc3v0Grh4oSbgYXbkl229uE+EJOCiiHR7hFGtdt2woc0V
bb7mmhNvk/YPZTIv02jo6UxIL6uAA5DW7tOYHYCi5GDUisV386M6esGV/Lda
aBiYHNKSx8OjmusgmN/i1UQ7CWP6H+PjbqEWvCWrarDuarv3dhPzHy9Y7Z3c
uDrboWEfJm+k1CzPbLemF5dvhRENi6FevSW7TVgMQ9EoPMDS1IAVDImdA3V3
mEW76sX1dabQiNoc6NWjKf3kt4iuBW+7q4kdO+vv6eVv+8yKLk97e4XRNXpd
sFONCow7e8zp6VtxN9ABAzzEktHu8Oo6TxI1eMdqWsoOrXoyFaZhhdW8Ygoq
7Uc40ygTp0DIVztQv8s/b/zzrZooqe8zAFBFVhRRsNwmbToeUCRVJwBszdf2
2SaNthfT8H0o5LifGVPA0kJ3+uHI9LqShskUYX5KT4MgvfACd59SSaadWK9Q
lfmO2laya2tumeir0eCRWWmCiBQYaz9G4E50cmBAjHcQqPiALwOmv+gsWT7+
MHKj3ff7ALSshrd/YAAjVOIIdH2ch1Kh6xPfb+RFD11QYrHkipqlLw2pBDtV
I4ZdbBv8nbk3uRVZUq1w+Diw2uW3tmemDzKuddlvttnsQ4YFdP+o/6LM67WZ
lafeIhnnc+3oGOvQuq8C60SI9ivd9SoAma0mnQARAQABzSNQaGFuIFZhbiBI
YXUgPG1yLmhhdXBoYW5AZ21haWwuY29tPsLBdgQQAQgAIAUCXrZPwQYLCQcI
AwIEFQgKAgQWAgEAAhkBAhsDAh4BAAoJEAskhjp8NJJ9gTYP/1x+U9c5dqpX
Yq8CURHrUuvlgpZ4uA8LivVqyrump44sNJh+UJEtJD67jXreECfdITS7rY9e
oe5LkH3jkcQ9Is007GqRop+IXoFNwgOvUzYTfXR8bzlMbsL3saAAKchS9/gk
Il9wEiKD/YutezBGwdvren+abe3cJDJylJl7iHw4hJV4xbD9E16lecKqymPk
OCIl5F8F9kUQarTbSgo76gRdx04M0XJKipbPHULSwoWOgqMjcOUwYkFCuXb6
JjsWSkDhWO2k7eyoUsdrqwaM1PNZ1YWpL9B2+tlMZwYn8CelrY+nNa1EjLcI
upJpNWtO3689dSqhoffRjWqj+kDXLb4h99JBNPD0wNJlRk0Ty6KH+NJpmLm3
bBTOCHc3uAAtWcreEIruN1Rn85HL/n1EYkYd52Y04qroLLTEHHoMtmpHaCdJ
nqUruNNRslJUYRgalkTKDgvN8nDAJFHOmmXOmJ36l3zjs64IUpNGltZv83YO
BwRmqdzkB0dPaBsZ+v+cv2Mi44hvub2e7QT6rASXFqgpUZ6s/kogVREcyftM
HMZ/G4fUSE2q1CuoCln38G7hT0EHpSCQkhgZqyRhSKcwbBvwGcGIya2VF3Yr
kmXVo2B1TleWHuEtrKHstd3TFrXliSD1jGyIfG075jdxxdheY9eH00vug3HY
wpgyHzQJv6z5zsFNBF62T8EBEADNpdq0skkWAk4HDxRERkJJYmzHgwCxhtlv
HL1XoRbhRRoC3jWxv1tDM4hGDLAsVq0fBhIbhfJK8ySxDhRgOM6OfVB0Yo/s
kJdj+3K8dJo9dpT74nGc53UueFKADiVrXNlVA1YOUITmgPZIhT8AS3vyCzst
6MM4StlmQaQJ+FI+Xp2CLy4FqwAQYsVIWDn5HyG+JMJ/nK30w4epZ6jFB465
UW9k7bSECYBDTlV84dW8Bz/4dXYPusE6HEb8p1lU3O2AYg2Yagy+jwt4wnEV
BHxwcb5Cu0sPCkpyyqlElTFQg4LGcrJNvpVSceXifOZ9yFm9szhvqSsx6CJL
CJbHFVwngBfEgZbLMRxHFMpuxRwyVk1DHBdzhVUs1cNdCxZ5L+jPjb5SyZye
57uJT7jEjcnSbrqacfsw6XpV3nXypRTAeLFSSnBkDhyVyIC1sUNUL9zfNnIm
CVM5p1h82H/UZF2xS5p25YhNwaoEi3QUCpax/Q+RRreCVYBOB+dGRuRUznWb
+IFP4QBFBYDhUvGT6q5TF23yt5lu9i5yihkxa2c0R33+Ax41YBL7cBiPEMIC
s/TEsX8zBykZvqFf0ATDK+H0zRyFOdaOvUti4KntOnxEk8qlov929Ags8OBg
QgdjgxmZ2NWZwQWcv5tLP6IyAylBz6oFopndYPbTnUl1ac4B6wARAQABwsFf
BBgBCAAJBQJetk/BAhsMAAoJEAskhjp8NJJ9zd8P/ist8qxBR+KQaI8EKf/l
CVv6C5sZAT1fPldnEvj0c0zxImIkXJHhXHsVha5ZguU2k8N6W/cSkjcoXr9R
QLReoeKLmZt2d7+WfUuM8UCl+D5JnIW7xISBE7DOCoaPSNC2A8mP48RjIJG4
ou/sxDl+4q/BNXAA8benRCgHwVWGh/+AjsoN4OhZpsSwh/19dUAbipeBtxlg
yoCdyUXmKCzbhOSeumal0CCD9VWrQAISfGYRjE8Of/+HdcwXmwYTxsAjYnPE
dBSfqfM7PcFcY/JBGydZ278FMEx+/yrDuARaj/stQyPeCBo7DYlCctXt6SiD
XOhRBVj62ytBnLYJm3x+jegrm7ROKPJkP4iZln5q6aebcNK/gQrrb5oF9GnF
rjneaucZLgAt3UH7mLVlsK8zKz4qZkZEHCNHauTgbXi4v8Uvim22Z+y12RwH
EnIxiydEITvgdc+2Uf+8/sPzUsiieeJut0zuiZa6Nk6lvoUT33uZpD0v7mEo
vgQfmyE2dgOX6U6pl6pWXATrI/0T1WKSluCCS7ZcNIoSQG/Xk0DldOP7YWDr
Auq8y9JjqNwD3WPMLB3P0m8A3RVxJ7twJ0r4NOHLuTmqGv6TB84Mf3yBXR80
U+ffMrtVVFe5quZw6G8+kBCq4abjEPRG3gL0XIWFJOUtvoubKjICfSWzkZff
LqP1
=KS+F
-----END PGP PUBLIC KEY BLOCK-----`;
const privkey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org

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
9FyFhSTlLb6LmyoyAn0ls5GX3y6j9Q==
=5e+c
-----END PGP PRIVATE KEY BLOCK-----`; //encrypted private key



module.exports = {

    partnerCode: (req, res, next) => {
        const partnerCode = req.headers['x-partner-code'];
        //so sanh partnerCode
        if (partnerCode === config.partner.partnerCodePGP || partnerCode === config.partner.partnerCodeRSA) {
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
        const hash = CryptoJS.MD5(JSON.stringify(obj), config.partner.SecretKey).toString();
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
        if (code === 'xxxBankLovesyyyBank') { //neu la ngan hang dung PGP
            NganHangBPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org

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
=8fhC
-----END PGP PUBLIC KEY BLOCK-----`;

        } else if (code === 'sacombank') { //neu la ngan hang dung RSA
            NganHangBPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXsZIzwEEAN5ZIKhRZ4uG150VgmBQDVItt+FozZIHh3BvnJiyQrzOzTvYd97h
CfxResuEZ+DQpDY7VB/IpSaXmsBF1dzsBUbnHA8PYS60ecnBsrIGU73N07g90U4j
ZYgT63Xv9cGguLnKLZ7HQzwyDdxaphr0uDPOIUtBsXCcUjV4VL3JMYmlABEBAAHN
IVh1YW4gTmdoaWVtIDx4dWFuZ2hqZW1AZ21haWwuY29tPsKtBBMBCgAXBQJexkjP
AhsvAwsJBwMVCggCHgECF4AACgkQLHKoG8GD2VFgjwQAm3dWylKUsggSb9lOKinY
qYl6jfYb0or7Ana13XIkZcKKEtZTpdKiVZ/PaXAr3DJOehIrdUedoi6abIxV7jTo
gWBw30VyQY+sbBNKezHr0CDx2O/0jAs489YZ6W0gR8vdTxbepCZq0P/lRPf9Y7ee
xOx0hoOv4rRDH2MMNnNb7j7OjQRexkjPAQQA2YVGCzbNFCZ5UKwXE6QrVyt8MeN3
7d+RwoWtfjrxoSDZ9zyxathbYNa7uEtjtEJV8G2Oi4cuk4sxp9br5Ev49j0FfyG+
PpMlWWEz5Iewx/dSf+PFw0SBDzXkVaNtRliT8/rC1132S65etvT8sHNGdmrwWKIp
zQpKLuHkxwb5tJEAEQEAAcLAgwQYAQoADwUCXsZIzwUJDwmcAAIbLgCoCRAscqgb
wYPZUZ0gBBkBCgAGBQJexkjPAAoJEKEqKTZRyGt7QacD+QFXe251nT4aJTZr7GaE
7IvWWxsrSh4gb4T3maWSpIftdKMdSf7wHPMbiL6VNlMqbp1QYLiawQeDxvdevBuI
ot/JYG2zwiwJA5Iqzy4/oLbD3CcjdzNNSsq4wAk+V6GdOuQ99y9YOdi4xwmiY64W
df7aH1h8NHzB9X1eRe9GH7vyeWkD/0l3i0LAO6cPEONIoDmfJz2MNpQXP/g01ttT
vG8A89HkrRNopvF0BK+PMPt6EGeWzvoQ9KY7XEMps/h7y8JgACuw09SC7lDINs1I
7wszz2FrHF0vVxVj74pypED+mBksIyKsWMu+iaNGwbSX6NRgMj2Om0/MDgVgB3jU
DRwuHfbNzo0EXsZIzwEEAOre4ot63fE07I8WLRlGWIAAN1lnfghWS/v5fx2QcKiv
SSOYMKl0jv/uhb32RjrUleaHaQOx/t5yedsWLQBQdbKcYS8kLlhFFDcU5AQoi2iE
V6jEUB8nLt6IHPcj6vAAtC2G73S2rNzRyxCSnmafcWpgerm6WsvpcMdafUCNxJZT
ABEBAAHCwIMEGAEKAA8FAl7GSM8FCQ8JnAACGy4AqAkQLHKoG8GD2VGdIAQZAQoA
BgUCXsZIzwAKCRCn+10IM74i3wESBADQzPpevAJ4/+ilfbstKuvQzpzgdS/ER9d3
uAysG58ygJ49iS/T4uWCgeWIeLf5dDLDjWCVK/w3KLNmD7PEKHpJRq0lfgLgdsXb
RloslDbloITzDmGffCQSGy7f1/qxoMxiIS/Uu324f+Gyr1Z3FO96GI1mdaBL0hi5
rQlqN8HZu9wIA/4oE9Bi/MBm46ZxlX6SCtrjMxjJI0QRbfc8quEkiZNOkX69BQEa
nRuIXpiLJUXNfDBgDDSyk6xDcTis7hgYEdcgTiYuQVVml9vY32gks3R2IIZCI4lL
vtN8FWjJgVF46fR2zuRG7XBtYLU6Fo/ZWU+6QrhzfQCWINrQKTwLGQrk/g==
=ts2g
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