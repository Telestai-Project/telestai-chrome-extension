import * as React from "react";
import Routes from "../Routes";

interface IProps {
  setRoute: any;
  currentRoute: string;
}
export default function Navigator(props: IProps) {
  function Item({ itemRoute, label }) {
    let classNames = "navigator--item-link";

    if (itemRoute === props.currentRoute) {
      classNames += " navigator--item-link--active";
    }
    return (
      <li className="navigator__item">
        <a
          onClick={() => props.setRoute(itemRoute)}
          className={classNames}
          href="#"
        >
          {label}
        </a>
      </li>
    );
  }

  return (
    <div>
      <ul className="navigator glassy">
        <Item itemRoute={Routes.SIGN} label="Home" />
        <Item itemRoute={Routes.SET_WIF} label="Settings" />
        <Item itemRoute={Routes.HELP} label="Help" />
      </ul>
    </div>
  );
}
