import React from "react";
import ReactDOM from "react-dom";
import { SetWIF } from "./views/SetWIF";
import { Sign } from "./views/Sign";
import Navigator from "./components//Navigator";
import ROUTES from "./Routes";
import Help from "./views/Help";

declare var chrome: any;

function App() {
  const [route, setRoute] = React.useState(ROUTES.INITIALIZING);
  const [wif, setWIF] = React.useState(null);

  /* at startup read the saved value privateKeyWIF */
  React.useEffect(() => {
    chrome.storage.sync.get("privateKeyWIF", ({ privateKeyWIF }) => {
      setWIF(privateKeyWIF);
      setRoute(ROUTES.SIGN);
    });
  }, []);

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
      <h1 className="heading">Ravencoin</h1>
      <img className="logo" src="./ravencoin-rvn-logo.png"></img>
      <CurrentView />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
