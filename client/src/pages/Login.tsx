import React, {useContext} from "react";
import {ErrorMessage, Field, Form, Formik} from 'formik';
import './styles/Login.css';
import {AuthState} from "../shared/providers/AuthProvider";
import {User} from "../shared/types";
interface LoginProps {

}



export const Login: React.FC<LoginProps> = () => {
    const { login } = useContext(AuthState);
    return (
        <main>
            <h1>Login:</h1>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={ async (values, {setSubmitting})=> {
                    const payload: User = { username: values.username, password: values.password };
                    login(payload)
                    // const res = await fetch( 'http://localhost:3000/', {
                    //     method: 'POST',
                    //     headers: {  'Content-Type': 'application/json' },
                    //     body: JSON.stringify( payload )
                    // });
                    // const data  = await res.json();

                } }>
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
                            <button type="submit">
                               Login
                            </button>
                        </Form>
                    )
                }
            </Formik>
        </main>
    )

}
