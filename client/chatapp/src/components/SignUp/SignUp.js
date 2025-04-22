import { Button, Input, Radio, RadioGroup } from '@mui/joy';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '~/redux/reducers/authSlice';

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

function SignUp({ isClick }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [dataSignup, setDataSignup] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        password: '',
        gender: 'MALE',
        phone: '',
    });

    useEffect(() => {
        if (isClick) {
            setDataSignup({
                firstName: '',
                lastName: '',
                dob: '',
                email: '',
                password: '',
                gender: 'MALE',
                phone: '',
            });
        }
    }, [isClick]);

    const handleChangeSignup = (e) => {
        setDataSignup((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const requireFields = {
            firstName: 'Please enter your first name!',
            lastName: 'Please enter your last name!',
            dob: 'Please enter your dob!',
            gender: 'Please enter your gender!',
            phone: 'Please enter your phone!',
            email: 'Please enter your email!',
            password: 'Please enter your password!',
        };

        for (const [field, message] of Object.entries(requireFields)) {
            if (!dataSignup[field].trim()) {
                toast.error(message);
                return;
            }
        }

        // eslint-disable-next-line no-unused-vars
        const data = await dispatch(signUp(dataSignup));
        if (signUp.fulfilled.match(data)) {
            setDataSignup({
                firstName: '',
                lastName: '',
                dob: '',
                email: '',
                password: '',
                gender: 'MALE',
                phone: '',
            });
        } else if (signUp.rejected.match(data)) {
            toast.error(data.payload?.message);
            return;
        }
    };

    return (
        <div className="form-container sign-up-container">
            <form className="form" onSubmit={handleSignUp}>
                <h1 className="text-white font-semibold">Create Account</h1>
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

                <div className="flex justify-between items-center w-full">
                    <span className="text-left text-white text-sm font-semibold mb-1 w-full">First name</span>
                    <span className="text-left text-white text-sm font-semibold mb-1 w-full ml-4">Last name</span>
                </div>
                <div className="flex justify-between items-center w-full">
                    <Input
                        name="firstName"
                        value={dataSignup.firstName}
                        onChange={handleChangeSignup}
                        variant="soft"
                        type="text"
                        placeholder="First name"
                        className="mb-2 max-w-[134px]"
                    />
                    <Input
                        name="lastName"
                        value={dataSignup.lastName}
                        onChange={handleChangeSignup}
                        variant="soft"
                        type="text"
                        placeholder="Last name"
                        className="mb-2 max-w-[134px]"
                    />
                </div>
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Date of birth</span>
                <Input
                    name="dob"
                    value={dataSignup.dob}
                    onChange={handleChangeSignup}
                    variant="soft"
                    type="date"
                    className="mb-2 w-full"
                />
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Gender</span>
                <RadioGroup
                    defaultValue={String(dataSignup.gender)}
                    name="gender"
                    className="flex justify-start w-full"
                >
                    <div className="flex my-2 items-center">
                        <Radio value="MALE" size="md" variant="soft" className="mr-2" />
                        <p className="text-left text-white text-sm ">Male</p>
                        <span className="mx-6"></span>
                        <Radio value="FEMALE" size="md" variant="soft" className="mr-2" />
                        <p className="text-left text-white text-sm ">Female</p>
                    </div>
                </RadioGroup>
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Phone number</span>
                <Input
                    name="phone"
                    value={dataSignup.phone}
                    onChange={handleChangeSignup}
                    variant="soft"
                    type="text"
                    placeholder="Phone number"
                    className="mb-2 w-full"
                />
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Email</span>
                <Input
                    name="email"
                    value={dataSignup.email}
                    onChange={handleChangeSignup}
                    variant="soft"
                    type="email"
                    placeholder="Email"
                    className="mb-2 w-full"
                />
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Password</span>
                <Input
                    name="password"
                    value={dataSignup.password}
                    onChange={handleChangeSignup}
                    variant="soft"
                    type="password"
                    placeholder="Password"
                    className="mb-2 w-full"
                />
                <Button variant="soft" loading={loading} className="button mt-2" sx={buttonStyle} type="submit">
                    Sign Up
                </Button>
            </form>
        </div>
    );
}

export default SignUp;
