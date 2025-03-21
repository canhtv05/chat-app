import { Button, Input } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { signIn } from '~/redux/reducers/authSlice';

const buttonStyle = {
    borderRadius: '20px',
    border: '1px solid #3aaba7',
    backgroundColor: '#3aaba7',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '12px 45px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transition: 'transform 80ms ease-in',
    '&:hover': {
        backgroundColor: '#3aaba7',
    },
};

function SignIn({ isClick }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [dataSignin, setDataSignin] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (isClick) {
            setDataSignin({ email: '', password: '' });
            setErrorSignIn('');
            setErrors({});
        }
    }, [isClick]);

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

        const newErrors = {};
        if (!dataSignin.email.trim()) newErrors.email = 'Please enter your email!';
        if (!dataSignin.password.trim()) newErrors.password = 'Please enter your password!';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // unwrap
        const data = await dispatch(signIn(dataSignin));
        if (signIn.fulfilled.match(data)) {
            window.location.reload();
            navigate('/messages');
        } else if (signIn.rejected.match(data)) {
            setErrorSignIn(data.payload?.message);
            return;
        }
        setErrorSignIn('');
        setErrors({});
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

                <Button variant="soft" loading={loading} className="button mt-2" sx={buttonStyle} type="submit">
                    Sign In
                </Button>
            </form>
        </div>
    );
}

export default SignIn;
