import * as RavencoinKey from "@ravenrebels/ravencoin-key";
import * as RavencoinMessage from "@ravenrebels/ravencoin-message";

export function getAddress(privateKeyWIF) {
  if (!privateKeyWIF) {
    return null;
  }

  const network = "rvn";
  const addressObject = RavencoinKey.getAddressByWIF(network, privateKeyWIF);
  return addressObject.address;
}
export function signMessage(privateKeyWIF, message) {
  const network = "rvn";
  const addressObject = RavencoinKey.getAddressByWIF(network, privateKeyWIF);
  const privateKey = Buffer.from(addressObject.privateKey, "hex");
  return RavencoinMessage.sign(message, privateKey);
}
