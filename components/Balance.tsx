import * as React from "react";

const oneHundredMillion = 1e8;

export default function Balance({ balanceObject }) {
  if (!balanceObject) {
    return null;
  }
  if (!balanceObject.balance) {
    return null;
  }
  let rvnBalance = 0;

  const confirmedAssets = balanceObject.balance;
  console.log("Confirmed assets", confirmedAssets);

  return (
    <div>
      <h3>Balance</h3>
      <ListAssets confirmedAssets={confirmedAssets} />
    </div>
  );
}

function ListAssets({ confirmedAssets }) {
  if (!confirmedAssets) {
    return null;
  }
  return (
    <table>
      <tbody>
        {confirmedAssets.map((asset) => {
          console.log(asset);
          const amount = asset.balance / 1e8;

          const searchParams = new URLSearchParams("");
          searchParams.append("assetName", asset.assetName);

          const imageURL =
            "https://rebel-balance-front.herokuapp.com/thumbnail?" +
            searchParams.toString();
          return (
            <tr key={asset.assetName}>
              <td>
                <img
                  className="asset__thumbnail"
                  src={imageURL}
                  onError={(event) => {
                    //Image could not load, lets hide it
                    const dom = event.target as HTMLInputElement;
                    dom.style.display = "none";
                  }}
                />
              </td>
              <td>{asset.assetName}</td>
              <td>{amount.toLocaleString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
