import React, { useState, useEffect, useContext } from "react";
import styles from "../../styles/ShippingStep.module.css";
import ShippingMethod from "./shippingMethod";
import { BiLeftArrowAlt } from "react-icons/bi";
import DisplayContext from "../../context/display-context";
import { isEmpty } from "../../utils/helperFunctions";
import StoreContext from "../../context/store-context";

const ShippingStep = ({
  handleDeliverySubmit,
  savedMethods,
  isProcessing,
  cart,
}) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState();

  const { getShippingOptions } = useContext(StoreContext);
  const { updateCheckoutStep } = useContext(DisplayContext);

  /**
   * On load we want to fetch all the shipping options available for the cart.
   * Furthermore, we preselect shipping options if only one exists.
   */
  useEffect(() => {
    // Wait until the customer has entered their address information
    if (!cart.shipping_address?.country_code) {
      return;
    }

    getShippingOptions().then((partitioned) => {
      setShippingOptions(partitioned);
    });

    //if method is already selected, then preselect
    if (cart.shipping_methods.length > 0) {
      setSelectedOption(cart.shipping_methods[0].shipping_option);
    }
  }, [cart, setSelectedOption, getShippingOptions]);

  const handleSelectOption = (o) => {
    setSelectedOption(o);
  };

  const handleSubmit = () => {
    handleDeliverySubmit(selectedOption);
    updateCheckoutStep(3);
  };

  // const handleSubmit = () => {
  //   if (handleDeliverySubmit && !isEmpty(selectedOptions)) {
  //     for (const k of Object.keys(selectedOptions)) {
  //       const selectedOption = selectedOptions[k];
  //     }

  //     handleDeliverySubmit(selectedOptions);
  //   }
  // };

  // const handleSelectOption = async (k, o) => {
  //   setSelectedOptions({
  //     ...selectedOptions,
  //     [k]: o,
  //   });
  // };

  return (
    <div className={styles.container}>
      <h2>Delivery</h2>
      {isEmpty(shippingOptions) || isProcessing ? (
        <div>loading...</div>
      ) : (
        <div>
          {shippingOptions.map((so) => {
            return (
              <div key={so.id}>
                <ShippingMethod
                  option={so}
                  chosen={selectedOption}
                  handleOption={handleSelectOption}
                />
              </div>
            );
          })}
        </div>
      )}
      <div className={styles.controls}>
        <button
          className={styles.stepBack}
          onClick={() => updateCheckoutStep(1)}
        >
          <BiLeftArrowAlt /> Back to information
        </button>
        <button className={styles.nextBtn} onClick={handleSubmit}>
          <span id="button-text">Next</span>
        </button>
      </div>
    </div>
  );
};

export default ShippingStep;
