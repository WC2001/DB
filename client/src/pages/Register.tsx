import React from 'react';
import './styles/Login.css'
import {ErrorMessage, Field, Form, Formik} from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Routes,
    Route,
    Link,
    useNavigate,
} from 'react-router-dom';

interface RegisterProps {
}

export const Register: React.FC<RegisterProps> = ({}) => {
    const navigate = useNavigate();
    const notify = (text:string) => toast(text);
    return (
        <main>
            <ToastContainer />
            <h1> Register </h1>
            <Formik
                initialValues={{ username: '', password: '', repeatPassword: '' }}
                onSubmit={ async (values, {setSubmitting})=> {
                    console.log(values);
                    const res = await fetch('http://localhost:3002/user/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify( { username: values.username, password: values.password } )
                    });
                    const data = await res.json();
                    notify(data.message);
                    setTimeout(()=>{
                        if(data.message === 'Registered')
                            navigate('/login')
                    }, 3000);

                } }
            >
                {
                    ({ values, errors, touched, handleBlur, handleChange, handleSubmit })=>(
                        <Form>
                            <div>
                                <Field type="username" name="username" placeholder={ 'Username ...' } />
                                <ErrorMessage name="username" component="div" />
                            </div>
                            <div>
                                <Field type="password" name="password" placeholder={ 'Password ...' } />
                                <ErrorMessage name="password" component="div" />
                            </div>
                            <div>
                                <Field type="password" name="repeatPassword" placeholder={ 'Repeat Password ...' } />
                                <ErrorMessage name="repeatPassword" component="div" />
                            </div>
                            <button type="submit">
                               Sign Up
                            </button>
                        </Form>
                    )
                }
            </Formik>
        </main>
    )
}
