import * as React from "react";

interface IProps {
  small?: boolean;
}
export default function Spacer(props: IProps) {
  let styles = {
    marginBottom: "20px",
    marginTop: "10px",
  };
  if (props.small) {
    styles = {
      marginBottom: "10px",
      marginTop: "5px",
    };
  }

  return <div style={styles}></div>;
}
