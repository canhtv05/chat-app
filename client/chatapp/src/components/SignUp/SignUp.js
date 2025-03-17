import { Input, Radio, RadioGroup } from '@mui/joy';
import { useState } from 'react';

import { signup } from '~/services/auth/authService';

function SignUp() {
    const [errorSignUp, setErrorSignUp] = useState('');
    const [errors, setErrors] = useState({});
    const [dataSignup, setDataSignup] = useState({
        first_name: '',
        last_name: '',
        dob: '',
        email: '',
        password: '',
        gender: true,
        phone: '',
    });

    const handleChangeSignup = (e) => {
        setDataSignup((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        setErrors((prev) => ({
            ...prev,
            [e.target.name]: '',
        }));

        setErrorSignUp('');
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        let error = '';

        if (!value.trim()) {
            error = 'Please enter this field!';
        } else if (value.length < 3 && name !== 'email') {
            error = 'Must be at least 3 characters!';
        } else if (name === 'email' && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            error = 'Please enter correct email format. Ex: abc@gmail.com';
        } else if (name === 'password' && !/^(?=.*\d)(?=.*[A-Za-z]).{4,}$/.test(value)) {
            error = 'Password must contain at least 1 letter and 1 number!';
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        // eslint-disable-next-line no-unused-vars
        const [error, result] = await signup(dataSignup);
        if (error) {
            setErrorSignUp(error.response?.data?.message);
            return;
        }

        setErrorSignUp('');
        setErrors({});
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
                        name="first_name"
                        value={dataSignup.first_name}
                        onChange={handleChangeSignup}
                        variant="soft"
                        type="text"
                        placeholder="First name"
                        className="mb-2 max-w-[134px]"
                        onBlur={handleBlur}
                    />
                    <Input
                        name="last_name"
                        value={dataSignup.last_name}
                        onChange={handleChangeSignup}
                        variant="soft"
                        type="text"
                        placeholder="Last name"
                        className="mb-2 max-w-[134px]"
                        onBlur={handleBlur}
                    />
                </div>
                {(errors.first_name || errors.last_name) && (
                    <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">
                        {errors.first_name || errors.last_name}
                    </p>
                )}
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Date of birth</span>
                <Input
                    name="dob"
                    value={dataSignup.dob}
                    onChange={handleChangeSignup}
                    variant="soft"
                    type="date"
                    className="mb-2 w-full"
                    onBlur={handleBlur}
                />
                {errors.dob && <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errors.dob}</p>}
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Gender</span>
                <RadioGroup
                    defaultValue={String(dataSignup.gender)}
                    name="gender"
                    className="flex justify-start w-full"
                >
                    <div className="flex my-2 items-center">
                        <Radio value="true" size="md" variant="soft" className="mr-2" />
                        <p className="text-left text-white text-sm ">Male</p>
                        <span className="mx-6"></span>
                        <Radio value="false" size="md" variant="soft" className="mr-2" />
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
                    onBlur={handleBlur}
                />
                {errors.phone && (
                    <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errors.phone}</p>
                )}
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Email</span>
                <Input
                    name="email"
                    value={dataSignup.email}
                    onChange={handleChangeSignup}
                    variant="soft"
                    type="email"
                    placeholder="Email"
                    className="mb-2 w-full"
                    onBlur={handleBlur}
                />
                {errors.email && (
                    <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errors.email}</p>
                )}
                <span className="text-left text-white text-sm font-semibold mb-1 w-full">Password</span>
                <Input
                    name="password"
                    value={dataSignup.password}
                    onChange={handleChangeSignup}
                    variant="soft"
                    type="password"
                    placeholder="Password"
                    className="mb-2 w-full"
                    onBlur={handleBlur}
                />
                {errors.password && (
                    <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errors.password}</p>
                )}
                {errorSignUp && <p className="text-red-500 font-semibold text-sm mb-2">{errorSignUp}</p>}
                <button className="button mt-2" type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignUp;
