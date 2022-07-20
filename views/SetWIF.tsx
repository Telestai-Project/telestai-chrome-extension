import * as React from "react";
import * as RavencoinKey from "@ravenrebels/ravencoin-key";

import Spacer from "../components/Spacer";
declare var chrome: any;
export function SetWIF() {
  const [address, setAddress] = React.useState("");
  const [wif, setWIF] = React.useState("");
  React.useEffect(() => {
    chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF }) => {
      const address = RavencoinKey.getAddressByWIF("rvn", privateKeyWIF);
      setAddress(address);
      setWIF(privateKeyWIF);
    });
  }, []);

  return (
    <div>
      <div className="set-wif__container">
        <label
          htmlFor="privateKeyWIF"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Private key in Wallet Import Format
        </label>
        <Spacer small />
        <input
          type="password"
          id="privateKeyWIF"
          className="set-wif__input"
          placeholder=""
          required
          onChange={(event) => {
            const value = event.target.value;
            setWIF(value);
          }}
          value={wif}
        />
      </div>
      <Spacer small />
      <button
        className="button"
        onClick={() => {
          chrome.storage.sync.set({ privateKeyWIF: wif });
        }}
        type="button"
        id="saveButton"
      >
        Save
      </button>
    </div>
  );
}
