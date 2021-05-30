import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { register } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

    const userRegister = useSelector((state) => state.userRegister);
    const { userInfo, loading, error } = userRegister;

    const dispatch = useDispatch();
    const submitHandler = (e) =>{
        e.preventDefault();
        if(password !== confirmPassword){
            alert('Parola si confirmarea parolei nu coincid')
        } else{
            dispatch(register(name, email, password));
        }
        
    };
    useEffect(() => {
        if(userInfo) {
            props.history.push(redirect);
        }
    }, [props.history, redirect, userInfo]);
    return(
        <div>
            <form className = "form" onSubmit ={submitHandler}>
                <div>
                    <h1>Inregistrare</h1>
                </div>
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                <div>
                    <label htmlFor = "name">Nume </label>
                    <input type = "name" id="name" placeholder="Introduceti numele" required
                        onChange={ e => setName(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor = "email">Email </label>
                    <input type = "email" id="email" placeholder="Introduceti email-ul" required
                        onChange={ e => setEmail(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor = "password">Parola </label>
                    <input type = "password" id="password" placeholder="Introduceti parola" required
                        onChange={ e => setPassword(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor = "confirmPassword">Confirmati parola </label>
                    <input type = "password" id="confirmPassword" placeholder="Confirmati parola" required
                        onChange={ e => setConfirmPassword(e.target.value)}></input>
                </div>
                <div>
                    <label />
                    <button className="primary" type ="submit">Inregistrare</button>
                </div>
                <div>
                    <label />
                    <div>
                        Aveti deja cont? {' '}
                        <Link to={`/signin?redirect=${redirect}`}>Autentificare</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}