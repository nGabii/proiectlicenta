import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import { useContext } from 'react';
import { Store } from '../Store';
import { Link } from 'react-router-dom';

function NavBar() {
  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">electroBlindatus</Navbar.Brand>
        <Nav className="me-auto"></Nav>
        <Link to="/cart" className="nav-link">
          Cart
          {cart.cartItems.length > 0 && (
            <Badge pill bg="danger">
              {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
            </Badge>
          )}
        </Link>
      </Container>
    </Navbar>
  );
}

export default NavBar;
