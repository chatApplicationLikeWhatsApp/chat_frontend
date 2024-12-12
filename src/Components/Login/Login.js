import React, { useState } from 'react';
import {
    MDBInput,
    MDBBtn,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function Login() {
    const [formValue, setFormValue] = useState({
        password: '',
        email: '',
    });
    const naviation = useNavigate();

    const onChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        await axios.post('https://chat-server-0vlq.onrender.com/api/user/login', {
            email: formValue.email,
            password: formValue.password
        }).then((response) => {
            console.log("UIser>>>",response.data)
            localStorage.setItem("access_token", response.data?.accessToken)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            naviation('/chats')
            console.log(response)
        }).catch((err) => {
            console.log(err)
        })
    };

    return (
        <div className='login__form'>
            <h1>Login Form</h1>
            {/* Change onClick to onSubmit */}
            <MDBRow tag="form" className='g-3' onSubmit={handleSubmit}>
                <MDBCol md="4">
                    <MDBInput
                        value={formValue.email}
                        name='email'
                        onChange={onChange}
                        id='validationCustom01'
                        required
                        label='Email'
                    />
                </MDBCol>
                <MDBCol md="4">
                    <MDBInput
                        value={formValue.password}
                        name='password'
                        onChange={onChange}
                        id='validationCustom02'
                        required
                        type='password'
                        label='Password'
                    />
                </MDBCol>
                <MDBCol size="4">
                    <MDBBtn type='submit'>Submit form</MDBBtn>
                </MDBCol>
            </MDBRow>
        </div>
    );
}
