import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import { ConfigContext } from '../Context/ConfigContext'
// import { ConfigProvider } from '../Context/ConfigContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';



const Login = () => {
    const { t } = useTranslation();

    const { apiURL, handleUpdateToken } = useContext(ConfigContext);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setErrorMessage('');
    }, [username, password])


    const togglePassword = () => {
        setShowPassword((prevState) => !prevState);
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);

    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = {
            login_id: username,
            password: password,
            lang: 'en'
        }

        try {
            const response = await axios.post(`${apiURL}User/Login`, null, {
                params: formData
            }

            );
            setIsLoading(false);

            /* const data = response.data;
            console.log("data", data);
            console.log("response", response); */
            const data = response.data;
            /* console.log("data", data); */

            if (data.success) {
                console.log('login successfull');
                /*  console.log ('Response Data :' , data) */
                // console.log('token : ' , data.data[0].token)
                const token = response.data.data[0].token  // Extract the token from the response

                // Update the token in the context using handleTokenUpdate
                handleUpdateToken(token);
                localStorage.setItem("info", response.data.data[0])
                localStorage.setItem("user_id", response.data.data[0].user_id)
                setUsername('');
                setPassword('');
                navigate('/')
                // window.location.href = '/';
            } else {
                // Login failed
                console.error('Login failed.');
                console.error('Error:', response.data.error);
                console.log('Response Data :', data)
                setErrorMessage(t('Invalid username or password'));
                setIsLoading(false);

            }
        }
        catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Something went wrong. Please try again later.');
            setIsLoading(false);
            // Handle network or server errors here
        }


        /*  // Submit the login form here
       console.log('Submitting login form...');
       console.log('Username:', username);
       console.log('Password:', password);
       console.log('Remember me:', rememberMe);  */



    };

    return (
        <>
            <div

                className="auth-page-wrapper pt-5 ">
                {/* auth page bg */}
                <div

                    className="auth-one-bg-position auth-one-bg"

                    id="auth-particles">


                    <div

                        className="bg-overlay " ></div>


                    <div className="shape">


                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 1440 120">

                            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z">

                            </path>
                        </svg>
                    </div>
                </div>
            </div>
            {/* <!-- auth page content --> */}
            <div className="auth-page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center mt-sm-5 mb-4 text-white-50">
                                <div className="d-inline-block auth-logo">
                                    <a href="index.html">
                                        {/* <img src="assets/images/logo-light.png" alt="" height="20" /> */}
                                        <img src="assets/images/car7-Logo.png" alt="" height="80" />
                                    </a>
                                </div>
                                <p className="mt-3 fs-15 fw-medium">{t('CarZ 7 Partners Control Panel')}</p>

                            </div>
                        </div>
                    </div>
                    {/* <!-- end row --> */}

                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card mt-4">
                                <div className="card-body p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">{t('Welcome Back !')}</h5>
                                        <p className="text-muted">{t('Sign in to continue to Carz-7.')}</p>


                                    </div>

                                    <div className="p-2 mt-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="username" className="form-label">{t('Username')}</label>

                                                <input type="text" className="form-control position-relative z-1" id="username" name='username' placeholder={t('Enter user name')} value={username} onChange={handleUsernameChange} autoComplete='off' required />

                                            </div>
                                            <div className="mb-3">
                                                <div className="float-end">
                                                    <a href="auth-pass-reset-basic.html" className="text-muted">{t('Forgot password?')}</a>

                                                </div>
                                                <label className="form-label" htmlFor="password-input">{t('Password')}</label>

                                                <div className="position-relative auth-pass-inputgroup mb-3">
                                                    <input type={`${showPassword ? 'text' : 'password'}`} className="form-control pe-5 password-input" placeholder={t('Enter password')} id="password-input" value={password} onChange={handlePasswordChange} autoComplete='off' required />
                                                    <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon" onClick={togglePassword} >
                                                        <i className={`${showPassword ? 'ri-eye-fill align-middle' : 'ri-eye-off-fill align-middle'}`}>



                                                        </i></button>
                                                </div>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value='' id="auth-remember-check" checked={rememberMe} onChange={handleRememberMeChange} />
                                                <label className="form-check-label" htmlFor="auth-remember-check">{t('Remember me')}</label>
                                            </div>
                                            <div className="mt-4">
                                                {/* <button className="btn btn-secondary w-100" type="submit" disabled={!username || !password || isLoading ? true : false}>
                                                
                                                {isLoading ? 'Please Wait...' : 'Sign In'}</button>
 */}


                                                <div className="hstack flex-wrap gap-2 mb-3 mb-lg-0">
                                                    <button className="btn btn-secondary w-100" type="submit" disabled={!username || !password || isLoading ? true : false}>


                                                        <span className="d-flex align-items-center">
                                                            <span className={isLoading ? "spinner-border flex-shrink-0" : ''} role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </span>
                                                            <span className="flex-grow-1 ms-2">
                                                                <Trans i18nKey={isLoading ? 'Please Wait...' : 'Sign In'} />
                                                            </span>
                                                        </span>
                                                    </button>


                                                </div>
                                            </div>
                                            {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                                            <div className="mt-4 text-center">
                                                {/* <div className="signin-other-title">
                                                <h5 className="fs-13 mb-4 title">Sign In with</h5>
                                            </div> */}
                                                {/*  <div>
                                                <button type="button" className="btn btn-primary btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></button>
                                                <button type="button" className="btn btn-danger btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></button>
                                                <button type="button" className="btn btn-dark btn-icon waves-effect waves-light"><i className="ri-github-fill fs-16"></i></button>
                                                <button type="button" className="btn btn-info btn-icon waves-effect waves-light"><i className="ri-twitter-fill fs-16"></i></button>
                                            </div> */}

                                            </div>
                                        </form>
                                    </div>



                                </div>

                                {/* <!-- end card body --> */}

                            </div>
                            {/* <!-- end card --> */}

                            <div className="mt-4 text-center">
                                <p className="mb-0">Don't have an account ? <a href="auth-signup-basic.html" className="fw-semibold text-primary text-decoration-underline"> Signup </a> </p>
                            </div>

                        </div>
                    </div>
                    {/* <!-- end row --> */}

                </div>
                {/* <!-- end container --> */}


            </div>
            {/*  <!-- end auth page content --> */}
            {/*  <!-- footer --> */}
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center">
                                <p className="mb-0 text-muted">&copy;
                                    {year} Powered By Ghayar LLC UAE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/*  <!-- end Footer --> */}

        </>
    )
}

export default Login