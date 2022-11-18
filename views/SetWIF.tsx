import * as React from "react";
import * as RavencoinKey from "@ravenrebels/ravencoin-key";
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

  React.useEffect(() => {
    chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF }) => {
      const address = RavencoinKey.getAddressByWIF("rvn", privateKeyWIF);
      setAddress(address);
      setWIF(privateKeyWIF);
    });
  }, []);

  const inputType = plainText === true ? "text" : "password";
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
        <label>
          Show plain text
          <input
            checked={plainText}
            type="checkbox"
            name="plainText"
            onChange={(event) => {
              setPlainText(event.target.checked);
            }}
          />
        </label>
        <input
          type={inputType}
          id="privateKeyWIF"
          className="set-wif__input"
          placeholder=""
          required
          onChange={(event) => {
            const v = event.target.value;
            setValue(v);
          }}
          value={value === null ? wif : value}
        />
      </div>
      <Spacer small />
      <Valid wif={value} />
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
        Save
      </button>
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
