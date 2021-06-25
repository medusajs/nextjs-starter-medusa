import React, { useContext } from "react";
import { PuffLoader } from "react-spinners";
import styles from "../../styles/CheckoutSummery.module.css";
import itemStyles from "../../styles/CartView.module.css";
import Link from "next/link";
import { formatPrice } from "../../utils/helperFunctions";
import { sum, quantity } from "../../utils/helperFunctions";
import DisplayContext from "../../context/display-context";

const CheckoutSummery = ({ cart }) => {
  const { orderSummery, updateOrderSummeryDisplay } =
    useContext(DisplayContext);
  return cart ? (
    <div className={`${styles.container} ${orderSummery ? styles.active : ""}`}>
      <div className={itemStyles.top}>
        <p>
          <strong>Order Summery</strong>
        </p>
        <p>
          {cart.items.length > 0 ? cart.items.map(quantity).reduce(sum) : 0}{" "}
          {cart.items.length > 0 && cart.items.map(quantity).reduce(sum) === 1
            ? "item"
            : "items"}
        </p>
        <button
          className={styles.closeBtn}
          onClick={() => updateOrderSummeryDisplay()}
        >
          X
        </button>
      </div>
      <div className={itemStyles.overview}>
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
              <div key={i.id} className={itemStyles.product}>
                <figure>
                  <Link
                    href={{
                      pathname: `/product/[id]`,
                      query: { id: i.variant.product.id },
                    }}
                    passHref
                  >
                    <a>
                      {/* Replace with a product thumbnail/image */}
                      <div className={itemStyles.placeholder} />
                    </a>
                  </Link>
                </figure>
                <div className={itemStyles.controls}>
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
                      <p className={itemStyles.size}>Size: {i.variant.title}</p>
                      <p className={itemStyles.size}>
                        Price:{" "}
                        {formatPrice(i.unit_price, cart.region.currency_code)}
                      </p>
                      <p className={itemStyles.size}>Quantity: {i.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className={styles.breakdown}>
        <p>Subtotal (incl. taxes)</p>
        <span>
          {cart.region
            ? formatPrice(cart.subtotal, cart.region.currency_code)
            : 0}
        </span>
      </div>
      <div className={styles.breakdown}>
        <p>Shipping</p>
        <span>
          {cart.region
            ? formatPrice(cart.shipping_total, cart.region.currency_code)
            : 0}
        </span>
      </div>
      <div className={styles.total}>
        <p>Total</p>
        <span>
          {cart.region ? formatPrice(cart.total, cart.region.currency_code) : 0}
        </span>
      </div>
    </div>
  ) : (
    <div className={styles.spinnerContainer}>
      <PuffLoader />
    </div>
  );
};

export default CheckoutSummery;
