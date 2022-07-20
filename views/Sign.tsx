import React from "react";
declare var chrome: any;
const cryptoStuff = require("../utils/cryptoStuff");
import useBalance from "../useBalance";
import Balance from "../components/Balance";
import Spacer from "../components/Spacer";

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

  function copyAddress() {
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(address);

    /* Alert the copied text */
    alert("Copied the text: " + address);
  }
  function copySignature() {
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(signature);

    /* Alert the copied text */
    const message = "Copied signature to clipboard";
    alert(message);
  }
  return (
    <div>
      <div className="mb-6">
        <Balance balanceObject={balance} />

        <Spacer />
        <div className="sign--container">
          <label className="sign--adddress-label">
            Address{" "}
            <button className="button--no-style" onClick={copyAddress}>
              <i className="fa fa-copy"></i>
            </button>
          </label>
          <Spacer small />
          <small>{address}</small>
        </div>
      </div>
      <Spacer />
      <Spacer />

      {/* MESSAGE */}
      <div className="message--container">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Message to sign
        </label>
        <Spacer small />
        <textarea
          className="message--textarea"
          onChange={(event) => {
            const m = event.target.value;
            setMessage(m);

            const signature = cryptoStuff
              .signMessage(wif, message)
              .toString("base64");
            setSignature(signature);
          }}
          id="message"
          rows={4}
          value={message}
        ></textarea>
      </div>
      <Spacer />
      <Spacer />
      {/* SIGNATURE */}
      <div className="signature--container">
        <label>Signature</label>{" "}
        <button className="button--no-style" onClick={copySignature}>
          <i className="fa fa-copy"></i>
        </button>
        <Spacer small />
        <textarea
          disabled
          value={signature}
          id="signature"
          className="signature__textarea"
          rows={4}
        ></textarea>
      </div>
    </div>
  );
}
