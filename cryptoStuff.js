const bitcoinMessage = require("bitcoinjs-message");

const CoinKey = require("coinkey");
const coininfo = require("coininfo"); //coininfo gives us meta data about a bunch of crypto currencies, including Ravencoin

const frmt = coininfo.ravencoin.main.toBitcoinJS();
const RAVENCOIN_NETWORK = {
  messagePrefix: "\x16Raven Signed Message:\n",
  bip32: {
    public: frmt.bip32.public,
    private: frmt.bip32.private,
  },
  pubKeyHash: frmt.pubKeyHash,
  scriptHash: frmt.scriptHash,
  wif: frmt.wif,
};

function getAddress(privateKeyWIF) {
  const coinkey = CoinKey.fromWif(privateKeyWIF);
  coinkey.versions = coininfo("RVN").versions;

  return coinkey.publicAddress;
}
function signMessage(privateKeyWIF, message) {
  //Import private key as WIF and set coinkey to use MAIN-net for Ravencoin
  const coinkey = CoinKey.fromWif(privateKeyWIF);
  coinkey.versions = coininfo("RVN").versions;

  const privateKey = coinkey.privateKey;
  /*
  export function sign(
    message: string | Buffer,
    privateKey: Buffer | Signer,
    compressed?: boolean,
    messagePrefix?: string,
    sigOptions?: SignatureOptions
    ): Buffer;
    */
  var signature = bitcoinMessage.sign(
    message,
    privateKey,
    coinkey.compressed,
    RAVENCOIN_NETWORK.messagePrefix
  );

  return signature;
}

module.exports = {
  signMessage,
  getAddress,
};
