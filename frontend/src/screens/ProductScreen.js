import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utility';
import { Store } from '../Store';

const initialState = {
  loading: true,
  error: '',
  product: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCES':
      return { ...state, product: action.payload, loading: false };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'FETCH_LOADING': {
      return { ...state, loading: true };
    }
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    dispatch({ type: 'FETCH_LOADING' });

    axios
      .get(`/api/products/slug/${slug}`)
      .then((response) => {
        dispatch({ type: 'FETCH_SUCCES', payload: response.data });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_ERROR', payload: getError(err) });
      });
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert('Product out of stock');
      return;
    }

    ctxDispatch({
      type: 'ADD_CART_PRODUCT',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="row top">
        <div className="col-1">
          <img src={product.image} alt={product.name} className="large" />
        </div>
        <div className="col-1">
          <ul>
            <li>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </li>
            <li>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </li>
            <li>
              <p>${product.price}</p>
            </li>
            <li>
              <p>{product.description}</p>
            </li>
          </ul>
        </div>

        <div className="col-1">
          <ul>
            <li>
              <div className="row">
                <div>Price: ${product.price}</div>
              </div>
            </li>
            <li>
              <div className="row">
                <div>Status:</div>
                <div>
                  {product.countInStock > 0 ? (
                    <span className="succes">In Stock</span>
                  ) : (
                    <span className="fail">Not in Stock</span>
                  )}
                </div>
              </div>
            </li>
            <li>
              <div className="row">
                <div>
                  {product.countInStock > 0 && (
                    <button onClick={addToCartHandler}>Add to cart</button>
                  )}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
