import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { RadioGroup } from '@mui/joy';
import { useCallback, useEffect, useRef, useState } from 'react';
import MyInput from '../MyInput/MyInput';

import MyRadio from '../MyRadio/MyRadio';
import MyButton from '../MyButton/MyButton';
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

    const handleChange = (e) => {
        const { value, name } = e.target;

        setDataUpdateCurrentUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitForm = useCallback(
        async (e) => {
            e.preventDefault();

            const requireFields = {
                firstName: 'Please enter your first name!',
                lastName: 'Please enter your last name!',
                dob: 'Please enter your date of birth!',
                gender: 'Please enter your gender!',
            };

            for (let [field, message] of Object.entries(requireFields)) {
                if (!dataUpdateCurrentUser[field].trim()) {
                    toast.error(message);
                    return;
                }
            }

            const data = await dispatch(updateMyInfo(dataUpdateCurrentUser));
            if (updateMyInfo.fulfilled.match(data)) {
                setIsShowEditForm(false);
            } else if (updateMyInfo.rejected.match(data)) {
                toast.error(data.payload?.message);
                return;
            }
        },
        [dataUpdateCurrentUser, dispatch, setIsShowEditForm],
    );

    useEffect(() => {
        if (formRef.current) {
            // formRef.current.style.height = `${formRef.current.scrollHeight}px`;
            getScrollHeight(formRef.current.scrollHeight);
        }
    }, [getScrollHeight]);

    return (
        <>
            <form className="px-4 py-1 flex flex-col items-center h-full" ref={formRef} onSubmit={handleSubmitForm}>
                <div className="flex my-2 w-full">
                    <div className="flex flex-col w-full">
                        <span className="mb-2 text-base-content font-semibold">Tên</span>
                        <MyInput
                            name="firstName"
                            className="mb-2 max-w-[200px] w-full"
                            placeholder="First name"
                            size="lg"
                            value={dataUpdateCurrentUser.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="mb-2 text-base-content font-semibold">Họ</span>
                        <MyInput
                            name="lastName"
                            className="mb-2 max-w-[200px] w-full"
                            placeholder="Last name"
                            size="lg"
                            value={dataUpdateCurrentUser.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex flex-col my-2 w-full">
                    <span className="mb-2 text-base-content text-lg font-semibold">Thông tin cá nhân</span>
                    <RadioGroup value={dataUpdateCurrentUser.gender} name="gender" onChange={handleChange}>
                        <div className="flex my-2 text-base-content">
                            <MyRadio value="MALE" label="Nam" size="md" />
                            <span className="mx-6"></span>
                            <MyRadio value="FEMALE" label="Nữ" size="md" />
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex flex-col my-2 w-full">
                    <span className="mb-2 text-base-content font-semibold">Ngày sinh</span>
                    <MyInput
                        name="dob"
                        size="lg"
                        type="date"
                        defaultValue={dataUpdateCurrentUser.dob}
                        onChange={handleChange}
                    />
                </div>
            </form>
            <div className="border-base-300 border-t-2 w-full flex justify-end items-center p-2">
                <MyButton height={50} onClick={() => setIsShowEditForm(false)}>
                    <span className="text-base-content font-semibold">Hủy</span>
                </MyButton>
                <MyButton
                    height={50}
                    width={'100px'}
                    className="bg-base-100 ml-4"
                    loading={loading}
                    onClick={handleSubmitForm}
                >
                    <span className="text-base-content font-semibold">Cập nhật</span>
                </MyButton>
            </div>
        </>
    );
}

export default ProfileEdit;
