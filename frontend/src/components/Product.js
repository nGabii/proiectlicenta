import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';
import axios from 'axios';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Product out of stock');
      return;
    }

    ctxDispatch({
      type: 'ADD_CART_PRODUCT',
      payload: { ...item, quantity },
    });
  };

  return (
    <div className="product">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="product-info">
        <Link to={`/product/${product.slug}`}>
          <p>{product.name}</p>
        </Link>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        <p>
          <strong>${product.price}</strong>
        </p>
        {product.countInStock === 0 ? (
          <button disabled>Out of Stock</button>
        ) : (
          <button onClick={() => addToCartHandler(product)}>Add to cart</button>
        )}
      </div>
    </div>
  );
}

export default Product;
