import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { RadioGroup } from '@mui/joy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MyInput from '../MyInput/MyInput';
import MyRadio from '../MyRadio/MyRadio';
import MyButton from '../MyButton/MyButton';
import { updateMyInfo } from '~/redux/reducers/authSlice';

function ProfileEdit({ setIsShowEditForm, getScrollHeight }) {
    const { t } = useTranslation();
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
                firstName: t('profile.firstNameRequired'),
                lastName: t('profile.lastNameRequired'),
                dob: t('profile.dobRequired'),
                gender: t('profile.genderRequired'),
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
                toast.success(t('profile.updateSuccess'));
            } else if (updateMyInfo.rejected.match(data)) {
                toast.error(data.payload?.message || t('common.toast.errorUpload'));
                return;
            }
        },
        [dataUpdateCurrentUser, dispatch, setIsShowEditForm, t],
    );

    useEffect(() => {
        if (formRef.current) {
            getScrollHeight(formRef.current.scrollHeight);
        }
    }, [getScrollHeight]);

    return (
        <>
            <form className="px-4 py-1 flex flex-col items-center h-full" ref={formRef} onSubmit={handleSubmitForm}>
                <div className="flex my-2 w-full">
                    <div className="flex flex-col w-full">
                        <span className="mb-2 text-base-content font-semibold">{t('profile.firstName')}</span>
                        <MyInput
                            name="firstName"
                            className="mb-2 max-w-[200px] w-full"
                            placeholder={t('profile.firstName')}
                            size="lg"
                            value={dataUpdateCurrentUser.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="mb-2 text-base-content font-semibold">{t('profile.lastName')}</span>
                        <MyInput
                            name="lastName"
                            className="mb-2 max-w-[200px] w-full"
                            placeholder={t('profile.lastName')}
                            size="lg"
                            value={dataUpdateCurrentUser.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex flex-col my-2 w-full">
                    <span className="mb-2 text-base-content text-lg font-semibold">{t('profile.personalInfo')}</span>
                    <RadioGroup value={dataUpdateCurrentUser.gender} name="gender" onChange={handleChange}>
                        <div className="flex my-2 text-base-content">
                            <MyRadio value="MALE" label={t('profile.male')} size="md" />
                            <span className="mx-6"></span>
                            <MyRadio value="FEMALE" label={t('profile.female')} size="md" />
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex flex-col my-2 w-full">
                    <span className="mb-2 text-base-content font-semibold">{t('profile.dob')}</span>
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
                    <span className="text-base-content font-semibold">{t('common.button.cancel')}</span>
                </MyButton>
                <MyButton
                    height={50}
                    width={'100px'}
                    className="bg-base-100 ml-4"
                    loading={loading}
                    onClick={handleSubmitForm}
                >
                    <span className="text-base-content font-semibold">{t('common.button.update')}</span>
                </MyButton>
            </div>
        </>
    );
}

export default ProfileEdit;
