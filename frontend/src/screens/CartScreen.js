import React from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import axios from 'axios';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
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

  const removeCartHandler = async (item) => {
    ctxDispatch({
      type: 'REMOVE_CART_PRODUCT',
      payload: item,
    });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=?shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <button disabled={item.quantity === 1}>
                        <i
                          className="fas fa-minus-circle"
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                        ></i>
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        disabled={item.quantity === item.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <button onClick={() => removeCartHandler(item)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Total ({cartItems.reduce((a, b) => a + b.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, b) => a + b.quantity * b.price, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroupItem>
                  <button
                    type="button"
                    variant="primary"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </button>
                </ListGroupItem>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
