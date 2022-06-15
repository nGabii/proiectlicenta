import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
//import data from '../data';

const initialState = {
  loading: true,
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCES':
      return { ...state, products: action.payload, loading: false };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'FETCH_LOADING': {
      return { ...state, loading: true };
    }
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(
    logger(reducer),
    initialState
  );

  useEffect(() => {
    dispatch({ type: 'FETCH_LOADING' });

    axios
      .get('/api/products')
      .then((response) => {
        dispatch({ type: 'FETCH_SUCCES', payload: response.data });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_ERROR', payload: err.message });
      });
  }, []);

  return (
    <div>
      <Helmet>
        <title>Nume Site</title>
      </Helmet>
      <h1>Featured products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          products.map((product) => (
            <div key={product.slug}>
              <Product product={product}></Product>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
