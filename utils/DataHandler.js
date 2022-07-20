import axios from "axios";
import chunk from "lodash.chunk";

export async function fetchMetaDataForAsset(assetName) {
  return fetchMetaDataForAssetLive(assetName);
}

export async function fetchMetaDataForAssetLive(assetName) {
  const promise = new Promise((resolve, reject) => {
    const encodedAssetName = encodeURIComponent(assetName);
    const promise = axios.get(
      "https://agile-journey-76489.herokuapp.com/assetmetadata/" +
        encodedAssetName
    );

    promise.catch((e) => {
      reject(e);
    });

    promise.then((result) => {
      console.info("Resolve meta data for", assetName, result.data);
      resolve(result.data);
    });
  });

  return promise;
}

export async function getBalance(_addresses) {
  const promise = new Promise((resolve, reject) => {
    try {
      const url = "https://agile-journey-76489.herokuapp.com/addresses/";
      // const url = "http://localhost:3000/addresses";

      let chunks = [_addresses];
      //If loads of addresses, chunk em up
      if (_addresses.length > 50) {
        chunks = chunk(_addresses, 10);
      }

      const listOfPromises = chunks.map((c) => {
        const promise = axios.post(url, c);
        return promise;
      });

      const p = Promise.all(listOfPromises);
      p.catch((e) => {
        reject(e);
      });
      p.then((results) => {
        const value = {};
        //Now all promises are done
        results.map((response) => {
          const keys = Object.keys(response.data);

          keys.map((address) => {
            value[address] = response.data[address];
          });
        });

        resolve(value);
      });
    } catch (e) {
      reject(e);
    }
  });

  return promise;
}
