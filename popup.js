import React from "react";
import ReactDOM from "react-dom";

const asdf = require("./elvis");

const Routes = {
  SIGN: "SIGN",
  SET_WIF: "SET_WIF",
};
function App() {
  const [route, setRoute] = React.useState(Routes.SIGN);

  const CurrentView = () => {
    if (route === Routes.SIGN) {
      return <Sign />;
    } else if (route === Routes.SET_WIF) {
      return <SetWIF />;
    }
    return null;
  };

  return (
    <div>
      <h1 className="text-lg">Ravencoin sign in</h1>
      <label
        htmlFor="advanced"
        className="flex relative items-center mb-4 cursor-pointer"
      >
        <input
          type="checkbox"
          id="advanced"
          className="sr-only"
          onChange={(e) => {
            if (e.currentTarget.checked) {
              setRoute(Routes.SET_WIF);
            } else {
              setRoute(Routes.SIGN);
            }
          }}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Advanced
        </span>
      </label>
      <CurrentView />
    </div>
  );
}

function Sign() {
  const [address, setAddress] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [wif, setWIF] = React.useState("");

  React.useEffect(() => {
    chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF }) => {
      const address = asdf.getAddress(privateKeyWIF);
      setWIF(privateKeyWIF);
      setAddress(address);
    });
  }, []);

  return (
    <div>
      <form>
        <div className="mb-6">
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
            Your message
          </label>

          <textarea
            onChange={(event) => {
              const m = event.target.value;
              setMessage(m);
            }}
            id="message"
            rows="4"
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
              const signature = asdf
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
function SetWIF() {
  const [address, setAddress] = React.useState("");
  const [wif, setWIF] = React.useState("");

  React.useEffect(() => {
    chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF }) => {
      const address = asdf.getAddress(privateKeyWIF);
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
ReactDOM.render(<App />, document.getElementById("app"));
