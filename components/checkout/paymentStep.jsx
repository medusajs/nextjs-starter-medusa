import React, { useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StoreContext from "../../context/store-context";
import InjectableCardForm from "./injectableCardForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || null);

const PaymentStep = () => {
  const { createPaymentSession } = useContext(StoreContext);

  useEffect(() => {
    createPaymentSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ flexGrow: "1" }}>
      <Elements stripe={stripePromise}>
        <h2>Payment</h2>
        <InjectableCardForm />
      </Elements>
    </div>
  );
};

export default PaymentStep;
