import React, { useContext } from "react";
import NavBar from "./navBar";
import Blur from "./blur";
import CartView from "../cartView/cartView";
import DisplayContext from "../../context/display-context";
import styles from "../../styles/Layout.module.css";

const Layout = ({ children }) => {
  const { cartView } = useContext(DisplayContext);

  return (
    <div className={cartView ? styles.noscroll : null}>
      <CartView />
      <Blur />
      <NavBar isMain={true} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
