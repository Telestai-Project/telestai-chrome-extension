import React from "react";
import ReactDOM from "react-dom";
import { SetWIF } from "./views/SetWIF";
import { Sign } from "./views/Sign";
import Navigator from "./components//Navigator";
import Routes from "./Routes";
import Help from "./views/Help";
function App() {
  const [route, setRoute] = React.useState(Routes.SIGN);

  const CurrentView = () => {
    if (route === Routes.SIGN) {
      return <Sign />;
    } else if (route === Routes.SET_WIF) {
      return <SetWIF />;
    } else if (route === Routes.HELP) {
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
