import React, { useReducer, useEffect, useRef } from "react";
import medusa from "../services/medusa";

export const defaultStoreContext = {
  adding: false,
  cart: {
    items: [],
  },
  order: {},
  products: [],
  currencyCode: "eur",
  addVariantToCart: () => {},
  createCart: () => {},
  removeLineItem: () => {},
  updateLineItem: () => {},
  setShippingMethod: () => {},
  updateAddress: () => {},
  createPaymentSession: () => {},
  completeCart: () => {},
  retrieveOrder: () => {},
  dispatch: () => {},
};

const StoreContext = React.createContext(defaultStoreContext);
export default StoreContext;

const reducer = (state, action) => {
  switch (action.type) {
    case "setCart":
      return {
        ...state,
        cart: action.payload,
        currencyCode: action.payload.region.currency_code,
      };
    case "setOrder":
      return {
        ...state,
        order: action.payload,
      };
    case "setProducts":
      return {
        ...state,
        products: action.payload,
      };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultStoreContext);
  const stateCartId = useRef();

  useEffect(() => {
    stateCartId.current = state.cart.id;
  }, [state.cart]);

  useEffect(() => {
    let cartId;
    if (localStorage) {
      cartId = localStorage.getItem("cart_id");
    }

    if (cartId) {
      medusa.cart.retrieve(cartId).then(({ data }) => {
        dispatch({ type: "setCart", payload: data.cart });
      });
    } else {
      medusa.cart.create(cartId).then(({ data }) => {
        dispatch({ type: "setCart", payload: data.cart });
        if (localStorage) {
          localStorage.setItem("cart_id", data.cart.id);
        }
      });
    }

    medusa.products.list().then(({ data }) => {
      dispatch({ type: "setProducts", payload: data.products });
    });
  }, []);

  const createCart = () => {
    if (localStorage) {
      localStorage.removeItem("cart_id");
    }
    medusa.cart.create().then(({ data }) => {
      dispatch({ type: "setCart", payload: data.cart });
    });
  };

  const addVariantToCart = async ({ variantId, quantity }) => {
    medusa.cart.lineItems
      .create(state.cart.id, {
        variant_id: variantId,
        quantity: quantity,
      })
      .then(({ data }) => {
        dispatch({ type: "setCart", payload: data.cart });
      });
  };

  const removeLineItem = async (lineId) => {
    medusa.cart.lineItems.delete(state.cart.id, lineId).then(({ data }) => {
      dispatch({ type: "setCart", payload: data.cart });
    });
  };

  const updateLineItem = async ({ lineId, quantity }) => {
    medusa.cart.lineItems
      .update(state.cart.id, lineId, { quantity: quantity })
      .then(({ data }) => {
        dispatch({ type: "setCart", payload: data.cart });
      });
  };

  const getShippingOptions = async () => {
    const data = await medusa.shippingOptions
      .list(state.cart.id)
      .then(({ data }) => data);

    if (data) {
      return data.shipping_options;
    } else {
      return undefined;
    }
  };

  const setShippingMethod = (id) => {
    medusa.cart
      .setShippingMethod(state.cart.id, {
        option_id: id,
      })
      .then(({ data }) => {
        dispatch({ type: "setCart", payload: data.cart });
      });
  };

  const createPaymentSession = () => {
    medusa.cart.createPaymentSessions(state.cart.id).then(({ data }) => {
      dispatch({ type: "setCart", payload: data.cart });
    });
  };

  const completeCart = async () => {
    const data = await medusa.cart
      .completeCart(state.cart.id)
      .then(({ data }) => data);

    if (data) {
      return data.data;
    } else {
      return undefined;
    }
  };

  const retrieveOrder = async (orderId) => {
    const data = await medusa.orders.retrieve(orderId).then(({ data }) => data);

    if (data) {
      return data.order;
    } else {
      return undefined;
    }
  };

  const updateAddress = async (address, email) => {
    medusa.cart
      .update(state.cart.id, {
        shipping_address: address,
        billing_address: address,
        email: email,
      })
      .then(({ data }) => {
        dispatch({ type: "setCart", payload: data.cart });
      });
  };

  return (
    <StoreContext.Provider
      value={{
        ...state,
        addVariantToCart,
        createCart,
        removeLineItem,
        updateLineItem,
        getShippingOptions,
        setShippingMethod,
        createPaymentSession,
        updateAddress,
        completeCart,
        retrieveOrder,
        dispatch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
