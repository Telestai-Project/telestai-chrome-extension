import axios from "axios";
import React from "react";

export default function useBalance(addresses) {
  const [balance, setBalance] = React.useState(null);

  if (!addresses || addresses.length === 0) {
    return {};
  }

  React.useEffect(() => {
    async function fetchBalance() {
      try {
        const balances = await Promise.all(
          addresses.map(async (address) => {
            const response = await axios.get(`https://blockbook.telestai.io/api/v2/address/${address}`);
            const txData = response.data;
            return { [address]: txData.balance };
          })
        );

        const combinedBalances = balances.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setBalance(combinedBalances);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }

    fetchBalance();

    const interval = setInterval(fetchBalance, 60 * 1000);

    return () => clearInterval(interval);
  }, [addresses]);

  return balance;
}
