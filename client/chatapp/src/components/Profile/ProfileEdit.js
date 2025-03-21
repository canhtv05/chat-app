import { RadioGroup } from '@mui/joy';
import MyInput from '../MyInput/MyInput';
import MyRadio from '../MyRadio/MyRadio';
import MyButton from '../MyButton/MyButton';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef, useState } from 'react';
import { updateMyInfo } from '~/redux/reducers/authSlice';

function ProfileEdit({ setIsShowEditForm, getScrollHeight }) {
    const dispatch = useDispatch();
    const formRef = useRef();
    const initialFormHeightRef = useRef();
    const { gender, dob, firstName, lastName } = useSelector((state) => state.auth.data.data);
    const { loading } = useSelector((state) => state.auth);
    const [dataUpdateCurrentUser, setDataUpdateCurrentUser] = useState({
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dob: dob,
    });

    useEffect(() => {
        if (!initialFormHeightRef.current && formRef.current) {
            initialFormHeightRef.current = formRef.current.scrollHeight;
        }
    }, []);

    const [errors, setErrors] = useState({});
    const [errorUpdateCurrentUser, setErrorUpdateCurrentUser] = useState('');

    const handleBlur = (e) => {
        const { name, value } = e.target;

        let error = '';

        if (!value.trim()) {
            error = 'Please enter this field!';
        } else if (value.length < 3 && (name === 'firstName' || name === 'lastName')) {
            error = 'Must be at least 3 characters!';
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleChange = (e) => {
        const { value, name } = e.target;

        setDataUpdateCurrentUser((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));

        setErrorUpdateCurrentUser('');
    };

    const handleSubmitForm = useCallback(
        async (e) => {
            e.preventDefault();

            const newErrors = {};
            if (!dataUpdateCurrentUser.firstName.trim()) newErrors.firstName = 'Please enter your first name!';
            if (!dataUpdateCurrentUser.lastName.trim()) newErrors.lastName = 'Please enter your last name!';
            if (!dataUpdateCurrentUser.dob.trim()) newErrors.dob = 'Please enter your date of birth!';
            if (!dataUpdateCurrentUser.gender.trim()) newErrors.gender = 'Please enter your gender!';
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            const data = await dispatch(updateMyInfo(dataUpdateCurrentUser));
            if (updateMyInfo.fulfilled.match(data)) {
                setIsShowEditForm(false);
            } else if (updateMyInfo.rejected.match(data)) {
                setErrorUpdateCurrentUser(data.payload?.message);
                return;
            }
            setErrorUpdateCurrentUser('');
            setErrors({});
        },
        [dataUpdateCurrentUser, dispatch, setIsShowEditForm],
    );

    useEffect(() => {
        if (formRef.current) {
            if (errors || errorUpdateCurrentUser) {
                // formRef.current.style.height = `${formRef.current.scrollHeight}px`;
                getScrollHeight(formRef.current.scrollHeight);
            }
        }
    }, [errors, getScrollHeight, errorUpdateCurrentUser]);

    return (
        <form className="px-4 py-1 flex flex-col items-center h-full" ref={formRef} onSubmit={handleSubmitForm}>
            <div className="flex my-2 w-full">
                <div className="flex flex-col w-full">
                    <span className="mb-2 text-text-bold font-semibold">Tên</span>
                    <MyInput
                        name="firstName"
                        className="mb-2 max-w-[200px] w-full"
                        placeholder="First name"
                        size="lg"
                        value={dataUpdateCurrentUser.firstName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <span className="mb-2 text-text-bold font-semibold">Họ</span>
                    <MyInput
                        name="lastName"
                        className="mb-2 max-w-[200px] w-full"
                        placeholder="Last name"
                        size="lg"
                        value={dataUpdateCurrentUser.lastName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {(errors.firstName || errors.lastName) && (
                <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">
                    {errors.firstName || errors.lastName}
                </p>
            )}
            <div className="flex flex-col my-2 w-full">
                <span className="mb-2 text-text-bold text-lg font-semibold">Thông tin cá nhân</span>
                <RadioGroup defaultValue={String(dataUpdateCurrentUser.gender)} name="gender" onChange={handleChange}>
                    <div className="flex my-2">
                        <MyRadio value="MALE" label="Nam" size="md" />
                        <span className="mx-6"></span>
                        <MyRadio value="FEMALE" label="Nữ" size="md" />
                    </div>
                </RadioGroup>
            </div>
            {errors.gender && (
                <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errors.gender}</p>
            )}
            <div className="flex flex-col my-2 w-full">
                <span className="mb-2 text-text-bold font-semibold">Ngày sinh</span>
                <MyInput
                    name="dob"
                    size="lg"
                    type="date"
                    defaultValue={dataUpdateCurrentUser.dob}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
            </div>
            {errors.dob && <p className="text-red-500 text-left text-sm font-semibold mb-1 w-full">{errors.dob}</p>}
            {errorUpdateCurrentUser && (
                <p className="text-red-500 font-semibold text-sm mb-2">{errorUpdateCurrentUser}</p>
            )}
            <div className="border-border border-t-2 w-full flex justify-end items-center p-2">
                <MyButton height={50} onClick={() => setIsShowEditForm(false)}>
                    <span className="text-text-bold font-semibold">Hủy</span>
                </MyButton>
                <MyButton height={50} width={'100px'} className="bg-background ml-4" loading={loading} type="submit">
                    <span className="text-text-bold font-semibold">Cập nhật</span>
                </MyButton>
            </div>
        </form>
    );
}

export default ProfileEdit;
