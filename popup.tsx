import React from "react";
import ReactDOM from "react-dom";
import { SetWIF } from "./SetWIF";
import { Sign } from "./Sign";

const Routes = {
  SIGN: "SIGN",
  SET_WIF: "SET_WIF",
  BALANCE: "BALANCE",
};

function App() {
  const [route, setRoute] = React.useState(Routes.SIGN);

  const CurrentView = () => {
    if (route === Routes.SIGN) {
      return <Sign />;
    } else if (route === Routes.SET_WIF) {
      return <SetWIF />;
    }
    return null;
  };

  return (
    <div>
      <h1 className="text-lg">Ravencoin sign message</h1>
      <label
        htmlFor="advanced"
        className="flex relative items-center mb-4 cursor-pointer"
      >
        <input
          type="checkbox"
          id="advanced"
          className="sr-only"
          onChange={(e) => {
            if (e.currentTarget.checked) {
              setRoute(Routes.SET_WIF);
            } else {
              setRoute(Routes.SIGN);
            }
          }}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Advanced
        </span>
      </label>
      <CurrentView />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
