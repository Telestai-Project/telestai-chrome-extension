import axios from "axios";
import React from "react";
declare var chrome: any;

import useBalance from "../useBalance";

import * as cryptoStuff from "../utils/cryptoStuff";

export function LogIn({ wif, orderRef, onCancel }) {
  let address = cryptoStuff.getAddress(wif);
  const [addresses] = React.useState([address]);
  const balance = useBalance(addresses);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!orderRef) {
      return;
    }
    //Get info from IDP about this order
    const URL = "https://idp.ravenrebels.com/orders/" + orderRef;
    axios.get(URL).then((axiosResponse) => {
      const data = axiosResponse.data;
      const m = atob(data.userVisibleData);
      setMessage(m);
    });
  }, [orderRef]);

  if (!message) {
    return null;
  }
  const signature = cryptoStuff.signMessage(wif, message).toString("base64");

  if (!balance || Object.keys(balance).length === 0) {
    return null;
  }

  const assets: any = Object.values(balance)[0];

  const firstUniqueAssset = assets.find((asset) => {
    if (asset.balance === 1 * 1e8) {
      return true;
    }
  });

  const logIn = () => {
    if (firstUniqueAssset !== null) {
      //Send address and
      const URL = "https://idp.ravenrebels.com/authenticate";
      const obj = {
        nft: firstUniqueAssset.assetName,
        signature: signature,
        orderRef,
      };
      axios.post(URL, obj);
      console.log("Will post", obj, "to", URL);
    }

    return (
      <div>
        {JSON.stringify(firstUniqueAssset)} {signature}
      </div>
    );
  };
  return (
    <div>
      <h2>Do you want to sign in?</h2>

      <h2>{firstUniqueAssset.assetName}</h2>

      <div style={{ minWidth: "400px", marginBottom: "20px" }}>
        <h3>Message</h3> {message}
      </div>

      <button className="button" onClick={logIn}>
        Yes
      </button>
      <button className="button" onClick={onCancel} style={{ marginLeft: "20px" }}>
        No, cancel
      </button>
    </div>
  );
}
