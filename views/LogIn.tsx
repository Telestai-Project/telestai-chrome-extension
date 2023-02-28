import axios from "axios";
import React from "react";
declare var chrome: any;

import useBalance from "../useBalance";
import * as cryptoStuff from "../utils/cryptoStuff";

interface IAsset {
  assetName: string;
  balance: number;
}
/*
  We gave this component the name LogIn because we already have a "Sign" view, where you sign messages.
  Would be confusing to have Sign and SignIn
*/
export function LogIn({ wif, orderRef, onCancel }) {
  let address = cryptoStuff.getAddress(wif);
  const [addresses] = React.useState([address]);
  const balance = useBalance(addresses);
  const [message, setMessage] = React.useState("");
  const [selectedAssetName, setSelectedAssetName] = React.useState("");

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

  const assets = Object.values(balance)[0] as IAsset[];
  const uniqueAssets = assets.filter((asset) => {
    const a = asset.assetName.indexOf("#") > -1;
    const b = asset.balance === 1 * 1e8;

    return a && b;
  });

  //Validation, balance has been loaded (is not null) but we have no unique assets, CANCEL
  if (balance !== null && uniqueAssets.length === 0) {
    onCancel();
  }

  //Default set selected asset name to the firest unique asset
  if (!selectedAssetName && uniqueAssets.length > 0) {
    setSelectedAssetName(uniqueAssets[0].assetName);
  }

  const logIn = () => {
    if (selectedAssetName !== null) {
      //Send address and
      const URL = "https://idp.ravenrebels.com/authenticate";
      const obj = {
        nft: selectedAssetName,
        signature: signature,
        address,
        orderRef,
      };
      axios.post(URL, obj);
      console.log("Will post", obj, "to", URL);
    }

    return (
      <div>
        {JSON.stringify(uniqueAssets)} {signature}
      </div>
    );
  };
  return (
    <div>
      <h2>Do you want to sign in?</h2>

      <div style={{ minWidth: "400px", marginBottom: "20px" }}>
        <h3>Message</h3> {message}
      </div>

      <div className="login__select">
        <select
          value={selectedAssetName}
          onChange={(event) => {
            const value = event.target.value;
            setSelectedAssetName(value);
          }}
        >
          {uniqueAssets.map((asset) => {
            return <option>{asset.assetName}</option>;
          })}
        </select>
      </div>
      <button className="button" onClick={logIn}>
        Yes
      </button>
      <button
        className="button"
        onClick={onCancel}
        style={{ marginLeft: "20px" }}
      >
        No, cancel
      </button>
    </div>
  );
}

function Internal() {
  return null;
}
