import { useEffect, useState } from 'react';

import SignIn from '~/components/SignIn/SignIn';
import SignUp from '~/components/SignUp/SignUp';
import './Auth.css';

function Auth() {
    const [isClickSignUp, setIsClickSignUp] = useState(false);
    const [isClickSignIn, setIsClickSignIn] = useState(false);

    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        const handleSignUp = () => {
            container.classList.add('right-panel-active');
            setIsClickSignUp(true);
            setIsClickSignIn(false);
        };

        const handleSignIn = () => {
            container.classList.remove('right-panel-active');
            setIsClickSignIn(true);
            setIsClickSignUp(false);
        };

        if (signUpButton && signInButton) {
            signUpButton.addEventListener('click', handleSignUp);
            signInButton.addEventListener('click', handleSignIn);
        }

        return () => {
            if (signUpButton && signInButton) {
                signUpButton.removeEventListener('click', handleSignUp);
                signInButton.removeEventListener('click', handleSignIn);
            }
        };
    }, []);

    return (
        <>
            <div className="wrapper border-base-300 border-2" id="container">
                <SignUp isClick={isClickSignUp} />
                <SignIn isClick={isClickSignIn} />
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="text-white text-4xl font-semibold mb-3">Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost button mt-5" id="signIn">
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1 className="text-white text-4xl font-semibold mb-3">Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost button mt-5" id="signUp">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Auth;
