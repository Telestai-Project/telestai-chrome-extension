import * as React from "react";

const oneHundredMillion = 100 * 1000 * 1000;

export default function Balance({ balanceObject }) {
  if (!balanceObject) {
    return null;
  }

  console.log(balanceObject);
  let rvnBalance = 0;

  const addresses = Object.keys(balanceObject.balance);

  addresses.map((address) => {
    const b = rvnBalance + balanceObject.balance[address].balance.confirmed;

    rvnBalance += b / oneHundredMillion;
  });

  return (
    <div>
      <h1 className="text-xl dark:text-white">Balance</h1>
      {rvnBalance}
    </div>
  );
}
