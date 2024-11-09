import * as React from "react";
import * as TelestaiKey from "@telestai-project/telestai-key";
import Spacer from "../components/Spacer";
import isValidWIF from "../utils/isValidWIF";
declare var chrome: any;

/**
 * We handle two cases
 *
 * 1) Fresh start, WIF is not set
 * easy peasy
 * 2) WIF exists, user set WIF before.
 * In this case the default value of the input field should be the "old" WIF.
 * We only set the new value of WIF when the user clicks the save button, not before.
 * During the time the user is interacting with the input field we save the state in "value"
 *
 *
 *
 */
export function SetWIF({ wif, setWIF, onSuccess }) {
  const [address, setAddress] = React.useState("");
  const [value, setValue] = React.useState(wif);
  const [plainText, setPlainText] = React.useState(false);
  const [infoMessage, setInfoMessage] = React.useState("");
  const [mnemonicWords, setMnemonicWords] = React.useState(Array(12).fill(""));

  /*
    A message that will "last" for X seconds
    After X seconds, if the this info message is the last one it is cleared.

  */
  const inform = (message) => {
    const clearInfoMessage = () => {
      setInfoMessage((orgValue) => {
        if (orgValue === message) {
          return "";
        }
        return orgValue;
      });
    };
    setInfoMessage(message);
    setTimeout(clearInfoMessage, 10 * 1000);
  };
  React.useEffect(() => {
    chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF }) => {
      const address = TelestaiKey.getAddressByWIF("tls", privateKeyWIF);
      setAddress(address);
      setWIF(privateKeyWIF);
    });
  }, []);

  const inputType = plainText === true ? "text" : "password";

  const generateNewWIF = () => {
    const mnemonic = TelestaiKey.generateMnemonic();
    setMnemonicWords(mnemonic.split(" "));
    inform("Generated a new mnemonic. Please store it safely.");
  };

  const deriveWIFFromMnemonic = () => {
    const mnemonic = mnemonicWords.join(" ");
    if (TelestaiKey.isMnemonicValid(mnemonic)) {
      const account = 0;
      const position = 0;
      const addressPair = TelestaiKey.getAddressPair("tls", mnemonic, account, position);
      const WIF = addressPair.external.WIF;
      setValue(WIF);
      inform("Derived WIF from the provided mnemonic.");
    } else {
      inform("Invalid mnemonic. Please check and try again.");
    }
  };

  const handleMnemonicChange = (index, value) => {
    const newMnemonicWords = [...mnemonicWords];
    newMnemonicWords[index] = value;
    setMnemonicWords(newMnemonicWords);
  };

  return (
    <div>
      <div className="set-wif__container">
        <label>
          <button
            className="button--no-style"
            onClick={() => setPlainText(!plainText)}
            title="Toggle visibility"
          >
            <i className={plainText ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
          </button>
        </label>
        <button
          style={{ marginLeft: "20px" }}
          className="button"
          onClick={generateNewWIF}
        >
          Generate new Mnemonic
        </button>

        <Spacer />

        <p>
          <em>{infoMessage}</em>
        </p>

        <label
          htmlFor="privateKeyWIF"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Private key in Wallet Import Format
        </label>
        <Spacer small />

        <input
          type={inputType}
          id="privateKeyWIF"
          className="set-wif__input"
          placeholder=""
          required
          onChange={(event) => setValue(event.target.value)}
          value={value === null ? wif : value}
        />

        <Spacer small />

        <label
          htmlFor="mnemonic"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Enter Mnemonic
        </label>
        <Spacer small />

        <div className="mnemonic-input-container">
  {mnemonicWords.map((word, index) => (
    <input
              key={index}
              type="text"
              placeholder={`Word ${index + 1}`}
              className="mnemonic-input"
              value={word}
              onChange={(e) => handleMnemonicChange(index, e.target.value)}
            />
          ))}
        </div>

        <button
          className="button"
          onClick={deriveWIFFromMnemonic}
          style={{ marginTop: "10px" }}
        >
          Derive WIF from Mnemonic
        </button>
      </div>
      <Spacer small />
      <Valid wif={value} />
      {wif !== value && (
        <>
          <button
            className="button"
            onClick={() => {
              chrome.storage.sync.set({ privateKeyWIF: value });
              setWIF(value);
              onSuccess();
            }}
            type="button"
            id="saveButton"
          >
            Save changes
          </button>

          <button className="button set-wif__cancel" onClick={onSuccess}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

function Valid({ wif }) {
  const styles = {
    background: "red",
    color: "white",
  };
  const valid = isValidWIF(wif);

  if (valid === true) {
    return null;
  } else {
    return <div style={styles}>WIF is NOT VALID</div>;
  }
}
