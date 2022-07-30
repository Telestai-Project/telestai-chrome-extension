import * as React from "react";

export default function Help() {
  return (
    <div className="help">
      <h1>Welcome</h1>
      <p>
        The purpose of this extension is to let you sign messages with a
        Ravencoin address.
      </p>
      <h2>Getting started</h2>
      <p>
        To get started you need a private key for a Ravencoin address in WIF
        format (wallet import format). WIF turns your private key into pure
        text.
      </p>
      <h2>Brought to you by Raven Rebels</h2>
      <p>
        This tool is brought to you by Raven Rebels. A developer community
        project based in Sweden.
        <ul>
          <li>
            <a target="_blank" href="https://twitter.com/ravenrebels">
              {" "}
              Twitter
            </a>
          </li>
          <li>
            <a target="_blank" href="https://www.youtube.com/c/ravenrebels">
              Youtube
            </a>
          </li>
          <li>
            <a target="_blank" href="https://www.ravenrebels.com">
              Home page
            </a>
          </li>
        </ul>
      </p>
    </div>
  );
}
