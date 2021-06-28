import React, { useContext } from "react";
import DisplayContext from "../../context/display-context";
import StoreContext from "../../context/store-context";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/CartView.module.css";
import { quantity, sum, formatPrice } from "../../utils/helper-functions";

const CartView = () => {
  const { cartView, updateCartViewDisplay, updateCheckoutStep } =
    useContext(DisplayContext);
  const { cart, currencyCode, updateLineItem, removeLineItem } =
    useContext(StoreContext);
  const router = useRouter();

  return (
    <div className={`${styles.container} ${cartView ? styles.active : null}`}>
      <div className={styles.top}>
        <p>Bag</p>
        <p>
          {cart.items.length > 0 ? cart.items.map(quantity).reduce(sum) : 0}{" "}
          {cart.items.length > 0 && cart.items.map(quantity).reduce(sum) === 1
            ? "item"
            : "items"}
        </p>
        <button
          className={styles.closebtn}
          onClick={() => updateCartViewDisplay()}
        >
          X
        </button>
      </div>
      <div className={styles.overview}>
        {cart.items
          .sort((a, b) => {
            const createdAtA = new Date(a.created_at),
              createdAtB = new Date(b.created_at);

            if (createdAtA < createdAtB) return -1;
            if (createdAtA > createdAtB) return 1;
            return 0;
          })
          .map((i) => {
            return (
              <div key={i.id} className={styles.product}>
                <figure onClick={() => updateCartViewDisplay()}>
                  <Link
                    href={{
                      pathname: `/product/[id]`,
                      query: { id: i.variant.product.id },
                    }}
                    passHref
                  >
                    <a>
                      {/* Replace with a product thumbnail/image */}
                      <div className={styles.placeholder} />
                    </a>
                  </Link>
                </figure>
                <div className={styles.controls}>
                  <div>
                    <div>
                      <Link
                        href={{
                          pathname: `/product/[id]`,
                          query: { id: i.variant.product.id },
                        }}
                        passHref
                      >
                        <a>{i.title}</a>
                      </Link>
                      <p className={styles.size}>Size: {i.variant.title}</p>
                      <p className={styles.size}>
                        Price:{" "}
                        {formatPrice(i.unit_price, cart.region.currency_code)}
                      </p>
                    </div>
                    <div>
                      <div className={styles.mid}>
                        <div className={styles.selector}>
                          <button
                            className={styles.qtybtn}
                            onClick={() =>
                              updateLineItem({
                                lineId: i.id,
                                quantity: i.quantity - 1,
                              })
                            }
                          >
                            {"–"}
                          </button>
                          <p className={styles.ticker}>{i.quantity}</p>
                          <button
                            className={styles.qtybtn}
                            onClick={() =>
                              updateLineItem({
                                lineId: i.id,
                                quantity: i.quantity + 1,
                              })
                            }
                          >
                            {"+"}
                          </button>
                        </div>
                      </div>
                      <p>{}</p>
                    </div>
                  </div>
                  <button
                    className={styles.remove}
                    onClick={() => removeLineItem(i.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <div className={styles.subtotal}>
        <p>Subtotal (incl. taxes)</p>
        <span>
          {cart.region ? formatPrice(cart.subtotal, currencyCode) : 0}
        </span>
      </div>
      <div className={styles.bottom}>
        <button
          className={styles.checkoutbtn}
          onClick={() => {
            updateCheckoutStep(1);
            updateCartViewDisplay();
            router.push("/checkout");
          }}
          disabled={cart.items.length < 1 ? true : ""}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartView;
