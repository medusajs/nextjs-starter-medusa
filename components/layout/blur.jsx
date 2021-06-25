import React, { useContext } from "react";
import DisplayContext from "../../context/display-context";
import styles from "../../styles/Blur.module.css";

const Blur = () => {
  const { cartView, orderSummery, updateCartViewDisplay } =
    useContext(DisplayContext);
  return (
    <div
      className={`${styles.blur} ${
        cartView || orderSummery ? styles.active : null
      }`}
      onClick={() => updateCartViewDisplay()}
      onKeyDown={() => updateCartViewDisplay()}
      role="button"
      tabIndex="-1"
      aria-label="Close cart view"
    />
  );
};

export default Blur;
