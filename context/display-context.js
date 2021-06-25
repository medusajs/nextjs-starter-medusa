import React, { useReducer } from "react";

export const defaultDisplayContext = {
  cartView: false,
  orderSummery: false,
  checkoutStep: 1,
  updateCartViewDisplay: () => {},
  updateOrderSummeryDisplay: () => {},
  updateCheckoutStep: () => {},
  dispatch: () => {},
};

const DisplayContext = React.createContext(defaultDisplayContext);
export default DisplayContext;

const reducer = (state, action) => {
  switch (action.type) {
    case "updateCartViewDisplay":
      return { ...state, cartView: !state.cartView };
    case "updateOrderSummeryDisplay":
      return { ...state, orderSummery: !state.orderSummery };
    case "updateCheckoutStep":
      return { ...state, checkoutStep: action.payload };
    default:
      return state;
  }
};

export const DisplayProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultDisplayContext);

  const updateCartViewDisplay = () => {
    dispatch({ type: "updateCartViewDisplay" });
  };

  const updateOrderSummeryDisplay = () => {
    dispatch({ type: "updateOrderSummeryDisplay" });
  };

  const updateCheckoutStep = (step) => {
    dispatch({ type: "updateCheckoutStep", payload: step });
  };

  return (
    <DisplayContext.Provider
      value={{
        ...state,
        updateCartViewDisplay,
        updateOrderSummeryDisplay,
        updateCheckoutStep,
        dispatch,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
};
