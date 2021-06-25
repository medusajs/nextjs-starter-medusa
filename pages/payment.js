import React, { useContext, useEffect, useState } from "react";
import StoreContext from "../context/store-context";
import itemStyles from "../styles/CartView.module.css";
import styles from "../styles/Payment.module.css";
import Link from "next/link";
import { formatPrice } from "../utils/helperFunctions";

const style = {
  height: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

export const Payment = () => {
  const [order, setOrder] = useState();
  const { cart, completeCart, createCart } = useContext(StoreContext);

  useEffect(() => {
    if (cart.items.length > 0) {
      completeCart().then((order) => {
        setOrder(order);
        createCart();
      });
    }
  }, []);

  useEffect(() => {
    console.log(order);
  }, [order]);

  return !order ? (
    <div style={style}>
      <p>Hang on while we validate your payment...</p>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order Summery</h1>
        <p>Thank you for your order!</p>
      </div>
      {order.items
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
                      Price: {formatPrice(i.unit_price, order.currency_code)}
                    </p>
                    <p className={itemStyles.size}>Quantity: {i.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <div className="my-1">
        <div className="flex-row justify-between">
          <div>Subtotal</div>
          <div>{formatPrice(order.subtotal, order.region.currency_code)}</div>
        </div>
        <div className="flex-row justify-between p-y1">
          <div>Shipping</div>
          <div>
            {formatPrice(order.shipping_total, order.region.currency_code)}
          </div>
        </div>
        <div className="flex-row justify-between total p-y1">
          <div>Total</div>
          <div>{formatPrice(order.total, order.region.currency_code)}</div>
        </div>
      </div>
      <div>
        <p>An order comfirmation will be sent to you at {order.email}</p>
      </div>
    </div>
  );
};

export default Payment;
