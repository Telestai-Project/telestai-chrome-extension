import axios from "axios";
import React from "react";

export default function useBalance(addresses) {
  const [balance, setBlalance] = React.useState(null);
  if (!addresses) {
    return {};
  }
  if (addresses.length === 0) {
    return {};
  }

  React.useEffect(() => {
    async function fetchBalance() {
      const URL = "https://rebel-balance-front.herokuapp.com/balance";
      const payload = {
        addresses,
      };
      const asdf = await axios.post(URL, payload);
      setBlalance(asdf.data);
    }

    fetchBalance();

    const interval = setInterval(fetchBalance, 60 * 1000);

    const cleanUp = function () {
      clearInterval(interval);
    };
    return cleanUp;
  }, []);

  return balance;
}
