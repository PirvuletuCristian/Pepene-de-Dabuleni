import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartAction';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen(props){
    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;
    if ( !userInfo ){
        props.history.push('/signin');
    }
    const [fullName, setFullName] = useState(shippingAddress.fullName);
    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({fullName, address, city, postalCode}));
        props.history.push('/payment');
    }
    return(
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <form className = "form" onSubmit = {submitHandler}>
                <div>
                    <h1>Livrare</h1>
                </div>
                <div>
                    <label htmlFor = "fullName">Nume Complet</label>
                    <input
                     type="text"
                     id = "fullName"
                     placeholder="Introduceti numele complet" 
                     value = {fullName} onChange={(e) => setFullName(e.target.value)} 
                     required>
                    </input>
                </div>
                <div>
                    <label htmlFor = "address">Adresa</label>
                    <input
                     type="text"
                     id = "address"
                     placeholder="Introduceti adresa" 
                     value = {address} onChange={(e) => setAddress(e.target.value)} 
                     required>
                    </input>
                </div>
                <div>
                    <label htmlFor = "city">Oras</label>
                    <input
                     type="text"
                     id = "city"
                     placeholder="Introduceti orasul" 
                     value = {city} onChange={(e) => setCity(e.target.value)} 
                     required>
                    </input>
                </div>
                <div>
                    <label htmlFor = "postalCode">Cod postal</label>
                    <input
                     type="text"
                     id = "postalCode"
                     placeholder="Introduceti codul postal" 
                     value = {postalCode} onChange={(e) => setPostalCode(e.target.value)} 
                     required>
                    </input>
                </div>
                <div>
                    <label/>
                    <button className ="primary" type = "submit">
                        Continuati
                    </button>
                </div>
            </form>
        </div>
    )
}