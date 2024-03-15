import React from "react";
import Header from "../Header";
import styles from "./style.module.scss";
export default function Layout({ children }) {
  return (
    <div id="layout-main">
      <Header />
      <div id={styles["body-main"]}>{children}</div>
    </div>
  );
}
