import { Input } from '@mui/joy';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useLocalStorage from '~/hooks/useLocalStorage';
import { signin } from '~/services/auth/authService';

function SignIn() {
    const { setStorage } = useLocalStorage();
    const navigate = useNavigate();
    const [dataSignin, setDataSignin] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [errorSignIn, setErrorSignIn] = useState('');

    const handleChangeSignin = (e) => {
        setDataSignin((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        setErrors((prev) => ({
            ...prev,
            [e.target.name]: '',
        }));

        setErrorSignIn('');
    };

    const handleBlur = (e) => {
        if (!e.target.value.trim()) {
            setErrors((prev) => ({
                ...prev,
                [e.target.name]: 'Please enter this field!',
            }));
        }
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        setErrorSignIn('');

        const newErrors = {};
        if (!dataSignin.email.trim()) newErrors.email = 'Please enter your email!';
        if (!dataSignin.password.trim()) newErrors.password = 'Please enter your password!';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const [error, result] = await signin(dataSignin);
        if (error) {
            setErrorSignIn(error.response?.data?.message);
            return;
        }

        setStorage({ token: result.data.token });
        navigate('/');
    };

    return (
        <div className="form-container sign-in-container">
            <form className="form" onSubmit={handleSignin}>
                <h1 className="text-white font-semibold">Sign in</h1>
                <div className="social-container">
                    <a href="/" className="social">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="/" className="social">
                        <i className="fab fa-google-plus-g"></i>
                    </a>
                    <a href="/" className="social">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>

                <Input
                    name="email"
                    value={dataSignin.email}
                    onChange={handleChangeSignin}
                    onBlur={handleBlur}
                    variant="soft"
                    type="email"
                    placeholder="Email"
                    className="mb-2 w-full"
                />
                {errors.email && (
                    <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errors.email}</p>
                )}

                <Input
                    name="password"
                    value={dataSignin.password}
                    onChange={handleChangeSignin}
                    onBlur={handleBlur}
                    variant="soft"
                    type="password"
                    placeholder="Password"
                    className="mb-2 w-full"
                />
                {errors.password && (
                    <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errors.password}</p>
                )}

                {errorSignIn && (
                    <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errorSignIn}</p>
                )}

                <button className="button mt-2" type="submit">
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default SignIn;
