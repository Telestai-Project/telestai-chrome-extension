import { createRoot } from "react-dom/client";
import React from "react";

import { SetWIF } from "./views/SetWIF";
import { Sign } from "./views/Sign";
import Navigator from "./components//Navigator";
import ROUTES from "./routes";
import Help from "./views/Help";

import { LogIn } from "./views/LogIn";

declare var chrome: any;

function App() {
  const [route, setRoute] = React.useState(ROUTES.INITIALIZING);
  const [wif, setWIF] = React.useState(null);

  const [isRavenRebels, setIsRavenRebels] = React.useState(false);
  const [orderRef, setOrderRef] = React.useState<null | string>(null);

  const [
    userHasToldIsNotToUseInstantSignIn,
    setUserHasToldIsNotToUseInstantSignIn,
  ] = React.useState(false);

  /* at startup read the saved value privateKeyWIF */
  React.useEffect(() => {
    chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF }) => {
      setWIF(privateKeyWIF);
      setRoute(ROUTES.SIGN);
    });
  }, []);

  /* Check if we can have instant sign in / log on / log in */
  const checkForOrderRef = async () => {
    if (userHasToldIsNotToUseInstantSignIn === true) {
      return null;
    }
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    if (!tab) {
      return null;
    }
    const response = await chrome.tabs.sendMessage(tab.id, {
      popup: { status: "alive" },
    });
    if (response && response.url) {
      const URL = response.url;
      const index = URL.indexOf("?");
      const search = URL.substring(index);
      const params = new URLSearchParams(search);

      setOrderRef(params.get("orderRef"));
      setIsRavenRebels(true);
    }
  };

  React.useEffect(() => {
    //Tell the world we are opened
    checkForOrderRef();
    const interval = setInterval(checkForOrderRef, 2 * 1000);

    return () => {
      clearInterval(interval); //clean up interval when componet is un-mounted
    };
  }, []);

  if (
    isRavenRebels &&
    wif &&
    orderRef &&
    userHasToldIsNotToUseInstantSignIn === false
  ) {
    const cancel = () => {
      setUserHasToldIsNotToUseInstantSignIn(true);
      setOrderRef(null);
    };
    return <LogIn orderRef={orderRef} wif={wif} onCancel={cancel} />;
  }
  const CurrentView = () => {
    if (route === ROUTES.SIGN) {
      return <Sign setRoute={setRoute} wif={wif} setWIF={setWIF} />;
    } else if (route === ROUTES.SET_WIF) {
      return (
        <SetWIF
          setWIF={setWIF}
          wif={wif}
          onSuccess={() => {
            setRoute(ROUTES.SIGN);
          }}
        />
      );
    } else if (route === ROUTES.HELP) {
      return <Help />;
    }
    return null;
  };

  return (
    <div>
      <Navigator setRoute={setRoute} currentRoute={route} />
      <h1 className="heading">Telestai</h1>
      <img className="logo" src="./telestai128.png"></img>
      <CurrentView />
    </div>
  );
}
// After

const container =
  document.getElementById("app") || document.createDocumentFragment();
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
