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
    <div className="balance glassy">
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
          if (asset.balance === 0) {
            return null;
          }
          const amount = asset.balance / 1e8;

          const searchParams = new URLSearchParams("");
          searchParams.append("assetName", asset.assetName);

          const imageURL =
            "https://rebel-balance-front.herokuapp.com/thumbnail?" +
            searchParams.toString();
          return (
            <tr key={asset.assetName}>
              <td>
                <button
                  className="button--no-style"
                  onClick={() => {
                    navigator.clipboard.writeText(asset.assetName);
                  }}
                >
                  <i className="fa fa-copy"></i>
                </button>
              </td>

              <td>
                {asset.assetName}
                <br />
                <small>{amount.toLocaleString()}</small>
              </td>
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
