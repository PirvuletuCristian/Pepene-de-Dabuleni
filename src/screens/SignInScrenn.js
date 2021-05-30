import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SignInScreen(props){


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

    const userSignin = useSelector((state) => state.userSignin);
    const {userInfo, loading, error} = userSignin;

    const dispatch = useDispatch();
    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(signin(email, password));
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
                    <h1>Autentifcare</h1>
                </div>
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
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
                    <label />
                    <button className="primary" type ="submit">Autentifcare</button>
                </div>
                <div>
                    <label />
                    <div>
                        Utilizator nou? {' '}
                        <Link to={`/register?redirect=${redirect}`}>Creeaza un cont</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}