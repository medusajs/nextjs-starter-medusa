import React, { useEffect, useState, useContext } from "react";
import medusa from "../../services/medusa";
import { useRouter } from "next/router";
import { BiShoppingBag } from "react-icons/bi";
import { HiOutlineTruck } from "react-icons/hi";
import StoreContext from "../../context/store-context";
import { resetOptions } from "../../utils/helperFunctions";
import styles from "../../styles/Product.module.css";

const Product = ({ product }) => {
  const { addVariantToCart } = useContext(StoreContext);
  const [options, setOptions] = useState({
    variantId: "",
    quantity: 0,
    size: "",
  });

  useEffect(() => {
    if (product) {
      setOptions(resetOptions(product));
    }
  }, [product]);

  const handleQtyChange = (action) => {
    if (action === "inc") {
      if (options.quantity < 10)
        setOptions({
          variantId: options.variantId,
          quantity: options.quantity + 1,
          size: options.size,
        });
    }
    if (action === "dec") {
      if (options.quantity > 1)
        setOptions({
          variantId: options.variantId,
          quantity: options.quantity - 1,
          size: options.size,
        });
    }
  };

  const handleAddToBag = () => {
    addVariantToCart({
      variantId: options.variantId,
      quantity: options.quantity,
    });
    if (product) setOptions(resetOptions(product));
  };

  return (
    <div className={styles.container}>
      <figure className={styles.image}>
        <div className={styles.placeholder}></div>
      </figure>
      <div className={styles.info}>
        <span />
        <div className={styles.details}>
          <div className="title">
            <h1>{product.title}</h1>
          </div>
          <p className="price">19.50 EUR</p>
          <div className={styles.selection}>
            <p>Select Size</p>
            <div className="selectors">
              {product.variants
                .slice(0)
                .reverse()
                .map((v) => {
                  return (
                    <button
                      key={v.id}
                      className={`${styles.sizebtn} ${
                        v.title === options.size ? styles.selected : null
                      }`}
                      onClick={() =>
                        setOptions({
                          variantId: v.id,
                          quantity: options.quantity,
                          size: v.title,
                        })
                      }
                    >
                      {v.title}
                    </button>
                  );
                })}
            </div>
          </div>
          <div className={styles.selection}>
            <p>Select Quantity</p>
            <div className={styles.qty}>
              <button
                className={styles.qtybtn}
                onClick={() => handleQtyChange("dec")}
              >
                -
              </button>
              <span className={styles.ticker}>{options.quantity}</span>
              <button
                className={styles.qtybtn}
                onClick={() => handleQtyChange("inc")}
              >
                +
              </button>
            </div>
          </div>
          <button className={styles.addbtn} onClick={() => handleAddToBag()}>
            <span>Add to bag</span>
            <BiShoppingBag />
          </button>
          <div className={styles.tabs}>
            <div className="tab-titles">
              <button className={styles.tabtitle}>Product Description</button>
            </div>
            <div className="tab-content">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const { data } = await medusa.products.list();
  const products = data.products;

  // Get the paths we want to pre-render based on posts
  const paths = products.map((product) => ({
    params: { id: product.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const { data } = await medusa.products.retrieve(params.id);

  // Pass post data to the page via props
  return { props: { product: data.product } };
}

export default Product;
