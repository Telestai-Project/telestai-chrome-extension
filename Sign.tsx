import React from "react";
declare var chrome: any;
const cryptoStuff = require("./cryptoStuff");
import useBalance from "./useBalance";
import Balance from "./Balance";
export function Sign() {
  const [triggerDate, setTriggerDate] = React.useState(new Date());
  const [address, setAddress] = React.useState("");
  const [addresses] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [wif, setWIF] = React.useState("");

  if (address && addresses.length === 0) {
    addresses.push(address);
    setTriggerDate(new Date());
  }

  const balance = useBalance(addresses, triggerDate);
  React.useEffect(() => {
    chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF }) => {
      const address = cryptoStuff.getAddress(privateKeyWIF);
      setWIF(privateKeyWIF);
      setAddress(address);
    });
  }, []);

  return (
    <div>
      <form>
        <div className="mb-6">
          <Balance balanceObject={balance} />
          <button
            onClick={() => setTriggerDate(new Date())}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Update
          </button>

          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            id="address"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            disabled
            value={address}
          />

          <a
            target="_blank"
            href={`https://api.ravencoin.org/address/${address}`}
          >
            Explore tokens
          </a>
        </div>

        {/* MESSAGE */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Message to sign
          </label>

          <textarea
            onChange={(event) => {
              const m = event.target.value;
              setMessage(m);
            }}
            id="message"
            rows={4}
            value={message}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          ></textarea>
        </div>

        {/* SIGNATURE */}
        <div className="mb-6">
          <label>Signature</label>
          <textarea
            value={signature}
            id="signature"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          ></textarea>
        </div>

        {/* SIGN BUTTON */}
        <div className="mb-6">
          <button
            onClick={() => {
              const signature = cryptoStuff
                .signMessage(wif, message)
                .toString("base64");
              setSignature(signature);
            }}
            type="button"
            id="signButton"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign
          </button>
        </div>
      </form>
    </div>
  );
}
