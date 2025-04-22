import { Button, Input } from '@mui/joy';
import { toast } from 'react-hot-toast';
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
        }
    }, [isClick]);

    const handleChangeSignin = (e) => {
        setDataSignin((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSignin = async (e) => {
        e.preventDefault();

        const requireFields = {
            email: 'Please enter your email!',
            password: 'Please enter your password!',
        };

        for (let [field, message] of Object.entries(requireFields)) {
            if (!dataSignin[field].trim()) {
                toast.error(message);
                return;
            }
        }

        // unwrap
        const data = await dispatch(signIn(dataSignin));
        if (signIn.fulfilled.match(data)) {
            window.location.reload();
            navigate('/chats');
        } else if (signIn.rejected.match(data)) {
            toast.error(data.payload?.message);
            return;
        }
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
                    variant="soft"
                    type="email"
                    placeholder="Email"
                    className="mb-2 w-full"
                />
                <Input
                    name="password"
                    value={dataSignin.password}
                    onChange={handleChangeSignin}
                    variant="soft"
                    type="password"
                    placeholder="Password"
                    className="mb-2 w-full"
                />
                <Button variant="soft" loading={loading} className="button mt-2" sx={buttonStyle} type="submit">
                    Sign In
                </Button>
            </form>
        </div>
    );
}

export default SignIn;
