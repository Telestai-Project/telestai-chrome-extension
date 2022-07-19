import * as React from "react";
import * as RavencoinKey from "@ravenrebels/ravencoin-key";
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
      <div className="mb-6">
        <label
          htmlFor="privateKeyWIF"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Private key in Wallet Import Format
        </label>
        <input
          type="password"
          id="privateKeyWIF"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          required
          onChange={(event) => {
            const value = event.target.value;
            setWIF(value);
          }}
          value={wif}
        />
      </div>

      <button
        onClick={() => {
          chrome.storage.sync.set({ privateKeyWIF: wif });
        }}
        type="button"
        id="saveButton"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Save
      </button>
    </div>
  );
}
