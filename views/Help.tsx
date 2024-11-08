import * as React from "react";

export default function Help() {
  return (
    <div className="help">
      <h2>Welcome</h2>
      <p>
        The purpose of this extension is to let you sign messages with a
        Telestai address.
      </p>
      <h3>Getting started</h3>
      <p>
        To get started you need a private key for a Telestai address in WIF
        format (wallet import format). WIF turns your private key into pure
        text.
      </p>
      {/* <h3>Full version</h3> */}
      {/* <p>
        Visit{" "}
        <a target="_blank" href="https://authenticator.ravenrebels.com">
          Telestai Authenticator
        </a>{" "}
        for a full wallet viewer.
      </p> */}
    </div>
  );
}
