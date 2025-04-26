import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SignIn from '~/components/SignIn/SignIn';
import SignUp from '~/components/SignUp/SignUp';
import './Auth.css';

function Auth() {
    const { t } = useTranslation();
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
                            <h1 className="text-white text-4xl font-semibold mb-3">{t('auth.welcomeBack')}</h1>
                            <p>{t('auth.keepConnected')}</p>
                            <button className="ghost button mt-5" id="signIn">
                                {t('auth.signIn')}
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1 className="text-white text-4xl font-semibold mb-3">{t('auth.helloFriend')}</h1>
                            <p>{t('auth.enterDetails')}</p>
                            <button className="ghost button mt-5" id="signUp">
                                {t('auth.signUp')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Auth;
