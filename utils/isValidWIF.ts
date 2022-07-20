import * as cryptoStuff from "../utils/cryptoStuff";

export default function isValidWIF(wif) {
  let address = null;
  try {
    cryptoStuff.getAddress(wif);

    return true;
  } catch (e) {}
  return false;
}
