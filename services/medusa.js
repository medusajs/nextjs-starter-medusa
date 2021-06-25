import medusaRequest from "./request";

const medusa = {
  newsletter: {
    signup(data) {
      const path = `/newsletter-signup`;
      return medusaRequest("POST", path, data);
    },
  },
  auth: {
    create(email, password) {
      const path = `/store/auth`;
      return medusaRequest("POST", path, {
        email,
        password,
      });
    },

    retrieve() {
      const path = `/store/auth`;
      return medusaRequest("GET", path);
    },

    delete() {
      const path = `/store/auth`;
      return medusaRequest("DELETE", path);
    },

    exists(email) {
      const path = `/store/auth/${email}`;
      return medusaRequest("GET", path);
    },
  },

  customers: {
    create(payload) {
      const path = `/store/customers`;
      return medusaRequest("POST", path, payload);
    },

    retrieve(id) {
      const path = `/store/customers/${id}`;
      return medusaRequest("GET", path);
    },

    listOrders(id) {
      const path = `/store/customers/${id}/orders`;
      return medusaRequest("GET", path);
    },

    update(id, payload) {
      const path = `/store/customers/${id}`;
      return medusaRequest("POST", path, payload);
    },

    resetPassword(data) {
      const path = `/store/customers/password-reset`;
      return medusaRequest("POST", path, data);
    },

    resetPasswordToken(email) {
      const path = `/store/customers/password-token`;
      return medusaRequest("POST", path, { email });
    },

    removeFromWishList(id, payload) {
      const path = `/store/customers/${id}/wishlist`;
      return medusaRequest("DELETE", path, payload);
    },

    addToWishList(id, payload) {
      const path = `/store/customers/${id}/wishlist`;
      return medusaRequest("POST", path, payload);
    },

    paymentMethods: {
      list(id) {
        const path = `/store/customers/${id}/payment-methods`;
        return medusaRequest("GET", path);
      },
    },

    addresses: {
      create(id, address) {
        const path = `/store/customers/${id}/addresses`;
        return medusaRequest("POST", path, { address });
      },

      update(id, addressId, address) {
        const path = `/store/customers/${id}/addresses/${addressId}`;
        return medusaRequest("POST", path, { address });
      },

      delete(id, addressId) {
        const path = `/store/customers/${id}/addresses/${addressId}`;
        return medusaRequest("DELETE", path);
      },
    },
  },

  store: {},

  variants: {
    retrieve(variantId) {
      const path = `/store/variants/${variantId}`;
      return medusaRequest("GET", path);
    },

    list(search) {
      const qString = Object.entries(search)
        .map(([key, value]) => {
          let cleanVal = value;
          if (Array.isArray(value)) {
            cleanVal = value.join(",");
          }
          return `${key}=${cleanVal}`;
        })
        .join("&");

      const path = `/store/variants${!!qString && `?${qString}`}`;
      return medusaRequest("GET", path);
    },
  },

  products: {
    retrieve(productId) {
      const path = `/store/products/${productId}`;
      return medusaRequest("GET", path);
    },

    list() {
      const path = `/store/products`;
      return medusaRequest("GET", path);
    },

    variants: {
      retrieve(variantId) {
        const path = `/store/variants/${variantId}`;
        return medusaRequest("GET", path);
      },

      list(productId) {
        const path = `/store/products/${productId}/variants`;
        return medusaRequest("GET", path);
      },
    },
  },

  cart: {
    create(cart) {
      const path = `/store/carts`;
      return medusaRequest("POST", path, cart);
    },

    retrieve(cartId) {
      const path = `/store/carts/${cartId}`;
      return medusaRequest("GET", path);
    },

    update(cartId, update) {
      const path = `/store/carts/${cartId}`;
      return medusaRequest("POST", path, update);
    },

    setShippingMethod(cartId, payload) {
      const path = `/store/carts/${cartId}/shipping-methods`;
      return medusaRequest("POST", path, payload);
    },

    setPaymentMethod(cartId, method) {
      const path = `/store/carts/${cartId}/payment-method`;
      return medusaRequest("POST", path, method);
    },

    updatePaymentSession(cartId, updateObj) {
      const path = `/store/carts/${cartId}/payment-session/update`;
      return medusaRequest("POST", path, updateObj);
    },

    setPaymentSession(cartId, providerId) {
      const path = `/store/carts/${cartId}/payment-session`;
      return medusaRequest("POST", path, { provider_id: providerId });
    },

    clearPaymentSession(cartId, providerId) {
      const path = `/store/carts/${cartId}/payment-sessions/${providerId}`;
      return medusaRequest("DELETE", path);
    },

    refreshPaymentSession(cartId, providerId) {
      const path = `/store/carts/${cartId}/payment-sessions/${providerId}/refresh`;
      return medusaRequest("POST", path);
    },

    completeCart(cartId) {
      const path = `/store/carts/${cartId}/complete-cart`;
      return medusaRequest("POST", path);
    },

    createPaymentSessions(cartId) {
      const path = `/store/carts/${cartId}/payment-sessions`;
      return medusaRequest("POST", path);
    },

    authorizePayment(cartId, providerId, data) {
      const path = `/store/carts/${cartId}/payment-method/${providerId}/authorize`;
      return medusaRequest("POST", path, data);
    },

    discounts: {
      generate(dynamicCode) {
        const path = `/discount-code`;
        return medusaRequest("POST", path, {
          discount_code: dynamicCode,
        });
      },

      delete(cartId, couponCode) {
        const path = `/store/carts/${cartId}/discounts/${couponCode}`;
        return medusaRequest("DELETE", path);
      },
    },

    lineItems: {
      create(cartId, payload) {
        const path = `/store/carts/${cartId}/line-items`;
        return medusaRequest("POST", path, payload);
      },

      update(cartId, lineItemId, payload) {
        const path = `/store/carts/${cartId}/line-items/${lineItemId}`;
        return medusaRequest("POST", path, payload);
      },

      delete(cartId, lineItemId) {
        const path = `/store/carts/${cartId}/line-items/${lineItemId}`;
        return medusaRequest("DELETE", path);
      },
    },
  },

  swaps: {
    create(payload) {
      const path = `/store/swaps`;
      return medusaRequest("POST", path, payload);
    },

    retrieveByCartId(cartId) {
      const path = `/store/swaps/${cartId}`;
      return medusaRequest("GET", path);
    },
  },

  orders: {
    create(order) {
      const path = `/store/orders`;
      return medusaRequest("POST", path, order);
    },

    retrieve(orderId) {
      const path = `/store/orders/${orderId}`;
      return medusaRequest("GET", path);
    },

    retrieveByCartId(cartId) {
      const path = `/store/orders/cart/${cartId}`;
      return medusaRequest("GET", path);
    },

    update(orderId, update) {
      const path = `/admin/orders/${orderId}`;
      return medusaRequest("POST", path, update);
    },

    list() {
      const path = `/admin/orders`;
      return medusaRequest("GET", path);
    },

    capturePayment(orderId) {
      const path = `/admin/orders/${orderId}/capture`;
      return medusaRequest("POST", path, {});
    },

    createFulfillment(orderId) {
      const path = `/admin/orders/${orderId}/fulfillment`;
      return medusaRequest("POST", path, {});
    },

    return(orderId, items) {
      const path = `/admin/orders/${orderId}/return`;
      return medusaRequest("POST", path, items);
    },

    cancel(orderId) {
      const path = `/admin/orders/${orderId}/cancel`;
      return medusaRequest("POST", path, {});
    },

    lookup(query) {
      let path = `/store/orders?`;

      if (typeof query === "object") {
        const queryString = Object.entries(query).map(([key, value]) => {
          let val = value;
          if (Array.isArray(value)) {
            val = value.join(",");
          }

          return `${key}=${encodeURIComponent(val)}`;
        });
        path = `/store/orders?${queryString.join("&")}`;
      }
      if (typeof query === "string") {
        path = `/store/orders?${query}`;
      }
      return medusaRequest("GET", path);
    },
  },

  shippingOptions: {
    list(query) {
      let path = `/store/shipping-options`;
      if (typeof query === "string") {
        path = `/store/shipping-options/${query}`;
      } else {
        const queryString = Object.entries(query).map(([key, value]) => {
          let val = value;
          if (Array.isArray(value)) {
            val = value.join(",");
          }

          return `${key}=${val}`;
        });
        path = `/store/shipping-options?${queryString.join("&")}`;
      }
      return medusaRequest("GET", path);
    },
  },

  returnReasons: {
    list() {
      let path = `/store/return-reasons`;
      return medusaRequest("GET", path);
    },
  },

  returns: {
    create(order) {
      const path = `/store/returns`;
      return medusaRequest("POST", path, order);
    },
  },

  regions: {
    list() {
      const path = `/store/regions`;
      return medusaRequest("GET", path);
    },

    retrieve(id) {
      const path = `/store/regions/${id}`;
      return medusaRequest("GET", path);
    },
  },

  giftCards: {
    retreive(id) {
      const path = `/store/gift-cards/${id}`;
      return medusaRequest("GET", path);
    },
  },

  adyen: {
    retrievePaymentMethods(cartId) {
      const path = `/adyen/payment-methods`;
      return medusaRequest("POST", path, {
        cart_id: cartId,
      });
    },

    additionalDetails(data) {
      const path = `/adyen/additional-details`;
      return medusaRequest("POST", path, data);
    },

    applePaySession(url) {
      const path = `/adyen/apple-pay-session`;
      return medusaRequest("POST", path, { validation_url: url });
    },
  },

  klarna: {
    authorizePayment(data) {
      const path = `/adyen/authorize`;
      return medusaRequest("POST", path, data);
    },
  },

  restock: {
    signUp(variantId, email) {
      const path = `/restock-notifications/variants/${variantId}`;
      return medusaRequest("POST", path, { email: email });
    },
  },
};

export default medusa;
