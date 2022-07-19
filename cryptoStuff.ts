import * as RavencoinKey from "@ravenrebels/ravencoin-key";
import * as RavencoinMessage from "@ravenrebels/ravencoin-message";

function getAddress(privateKeyWIF) {
  const network = "rvn";
  const addressObject = RavencoinKey.getAddressByWIF(network, privateKeyWIF);
  return addressObject.address;
}
function signMessage(privateKeyWIF, message) {
  const network = "rvn";
  const addressObject = RavencoinKey.getAddressByWIF(network, privateKeyWIF);
  const privateKey = Buffer.from(addressObject.privateKey, "hex");
  return RavencoinMessage.sign(message, privateKey);
}

module.exports = {
  signMessage,
  getAddress,
};
