import React from "react";
import * as DataHandler from "./DataHandler";

/*
  This hooks i responsible for fetching balances for *addresses*
  It does so in regards to *triggerDate* 


  We might have MANY addresses (endless)
  To avoid getting timeout (30 seconds) from backend we split up the work
  we cache by "triggerDate", if triggerDate change we fetch balance for all addresses.
  if triggerDate has not changes, we only fetch balance for un-cached addresses

  If addresses is empty, that happens after mnemonic change/reset, we should clear the balance
 
*/
let cache = {};
let cacheTriggerDate = null;
export default function useBalance(addresses, triggerDate) {
  //Empty cache if new trigger date
  if (cacheTriggerDate !== triggerDate) {
    cache = {};
    cacheTriggerDate = triggerDate;
  }

  function addAddressesToCache(addresses) {
    const keys = Object.keys(addresses);

    keys.map((address) => {
      cache[address] = addresses[address];
    });
  }
  const [balance, setBalance] = React.useState({});
  const [pendingUpdate, setPendingUpdate] = React.useState(false);
  const [updatedDate, setUpdatedDate] = React.useState(new Date());
  React.useEffect(() => {
    //First off, filter out addresses not in cache

    const _addresses = addresses.filter((address) => {
      return !cache[address];
    });

    try {
      setPendingUpdate(true);

      const promise = DataHandler.getBalance(_addresses);

      promise.then((results) => {
        //Now all promises are done

        addAddressesToCache(results);
        setBalance(cache);
        setPendingUpdate(false);
        setUpdatedDate(new Date());
      });

      promise.catch((e) => {
        console.dir(e);
        setPendingUpdate(false);
      });
    } catch (e) {
      console.dir(e);
      setPendingUpdate(false);
    }
  }, [addresses, triggerDate]);
  return {
    balance, //The current balance
    pendingUpdate,
    updatedDate,
    triggerDate, //The next time we should fetch balances
  };
}
