import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import DisplayContext from "../../context/display-context";
import StoreContext from "../../context/store-context";
import { quantity, sum } from "../../utils/helper-functions";
import { BiShoppingBag } from "react-icons/bi";
import styles from "../../styles/NavBar.module.css";
import { useRouter } from "next/router";

export const NavBar = () => {
  const { updateCartViewDisplay } = useContext(DisplayContext);
  const { cart } = useContext(StoreContext);
  const [isCheckout, setIsCheckout] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/checkout" || router.pathname === "/payment") {
      setIsCheckout(true);
    } else {
      setIsCheckout(false);
    }
  }, [router.pathname]);

  return (
    <div className={styles.container}>
      <Link href="/">
        <a>
          <h1 className={styles.logo}>medusa</h1>
        </a>
      </Link>
      {!isCheckout ? (
        <button className={styles.btn} onClick={() => updateCartViewDisplay()}>
          <BiShoppingBag />{" "}
          <span>
            {cart.items.length > 0 ? cart.items.map(quantity).reduce(sum) : 0}
          </span>
        </button>
      ) : null}
    </div>
  );
};

export default NavBar;
