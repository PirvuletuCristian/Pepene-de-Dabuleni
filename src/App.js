import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import { signout } from './actions/userActions';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignInScreen from './screens/SignInScrenn';
import PrivateRoute from './components/PrivateRoute';


function App() {

const cart = useSelector(state => state.cart);
const { cartItems } = cart;
const userSignin = useSelector((state) => state.userSignin);
const {userInfo} = userSignin;
const dispatch = useDispatch();
  const signoutHandler = () =>{
    dispatch(signout());
}

  return (
    <BrowserRouter>
    <div className = "grid-container">
    <header className = "row">
      <div>
        <Link className="brand" to ="/">Pepene de Dabuleni</Link>
      </div>
      <div>
        <Link to ="/cart">Cos
          {cartItems.length > 0 && (
            <span className = "badge">{cartItems.length}</span>
          )}
        </Link>
        {
          userInfo ? (
            <div className = "dropdown">
            <Link to = "#">{userInfo.name} <i className = "fa fa-caret-down"></i>{' '} </Link>
            <ul className= "dropdown-content">
              <li>
                <Link to ="/profile">Profil</Link>
              </li>
              <li>
                <Link to = "/orderhistory">Istoricul comenzilor</Link>
              </li>
              <li>
              <Link to ="#signout" onClick={signoutHandler}>Iesiti din cont
              </Link>
              </li>
            </ul>
            </div>
          ) : 
          (
            <Link to = "/signin">Autentificare</Link>
          )
        }
        
      </div>
    </header>
    <main>
      <Route path="/cart/:id?" component={CartScreen}></Route>
      <Route path = "/product/:id" component={ProductScreen}></Route>
      <Route path = "/signin" component = {SignInScreen}></Route>
      <Route path = "/register" component = {RegisterScreen}></Route>
      <Route path = "/shipping" component = {ShippingAddressScreen}></Route>
      <Route path = "/payment" component = {PaymentMethodScreen}></Route>
      <Route path = "/placeorder" component = {PlaceOrderScreen}></Route>
      <Route path = "/order/:id" component = {OrderScreen}></Route>
      <Route path = "/orderhistory" component = {OrderHistoryScreen}></Route>
      <PrivateRoute path = "/profile" component = {ProfileScreen}></PrivateRoute>
      <Route path = "/" component={HomeScreen} exact></Route>
    </main>
    <footer className = "row center">
      Toate drepturile rezervate.
    </footer>
  </div>
  </BrowserRouter>
  );
}

export default App;
