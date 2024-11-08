import * as TelestaiKey from "@telestai-project/telestai-key";
import * as TelestaiMessage from "@telestai-project/telestai-message";

export function getAddress(privateKeyWIF) {
  if (!privateKeyWIF) {
    return null;
  }

  const network = "tls";
  const addressObject = TelestaiKey.getAddressByWIF(network, privateKeyWIF);
  return addressObject.address;
}
export function signMessage(privateKeyWIF, message) {
  const network = "tls";
  const addressObject = TelestaiKey.getAddressByWIF(network, privateKeyWIF);
  const privateKey = Buffer.from(addressObject.privateKey, "hex");
  return TelestaiMessage.sign(message, privateKey);
}
