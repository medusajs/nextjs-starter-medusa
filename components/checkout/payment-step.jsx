import React, { useEffect, useContext } from "react";
import { Elements } from "@stripe/react-stripe-js";
import StoreContext from "../../context/store-context";
import InjectableCard from "./injectable-card";
import getStripe from "../../utils/stripe";

const PaymentStep = () => {
  const { createPaymentSession } = useContext(StoreContext);

  useEffect(() => {
    createPaymentSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ flexGrow: "1" }}>
      <Elements stripe={getStripe()}>
        <h2>Payment</h2>
        <InjectableCard />
      </Elements>
    </div>
  );
};

export default PaymentStep;
