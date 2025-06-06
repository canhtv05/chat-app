import { Avatar } from '@mui/joy';
import { toast } from 'react-hot-toast';
import MyButton from '../MyButton/MyButton';
import { MdOutlineCameraAlt } from 'react-icons/md';
import { LuPenLine } from 'react-icons/lu';
import { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateMyInfo } from '~/redux/reducers/authSlice';
import { setLoading } from '~/redux/reducers/eventSlice';

function ProfileInfo({ setIsShowEditForm }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { gender, dob, phone, firstName, lastName, profilePicture } = useSelector((state) => state.auth.data.data);

    const inputRef = useRef(null);
    const [tempPicture, setTempPicture] = useState('');

    const handleUploadFile = async (picture) => {
        if (!picture) return;

        if (!picture.type.startsWith('image/')) {
            toast.error(t('common.toast.imageOnly'));
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (picture.size > maxSize) {
            toast.error(t('common.toast.sizeExceeded'));
            return;
        }

        dispatch(setLoading(true));

        const formData = new FormData();
        formData.append('file', picture);
        formData.append('upload_preset', 'chat-app');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/doxc6iqyk/image/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.secure_url) {
                setTempPicture(data.secure_url);
                dispatch(updateMyInfo({ profilePicture: data.secure_url }));
            } else {
                toast.success(t('common.toast.uploadSuccess'));
            }
        } catch (error) {
            toast.error(t('common.toast.uploadFailed'));
        } finally {
            dispatch(setLoading(false));
            toast.error(t('common.toast.errorUpload'));
        }
    };

    const handleClickUpload = () => {
        inputRef.current.click();
    };

    const dataInfo = [
        { label: t('profile.gender'), value: gender },
        { label: t('profile.dob'), value: dob },
        { label: t('profile.phone'), value: phone },
    ];

    const genderText = (gender) => {
        if (gender === 'MALE') return t('profile.male');
        if (gender === 'FEMALE') return t('profile.female');
        if (gender === 'OTHER') return t('profile.other');
        return t('profile.unknown');
    };

    return (
        <>
            <div className="w-[450px] relative">
                <img
                    loading="lazy"
                    src="https://images.all-free-download.com/images/graphicwebp/belgium_514505.webp"
                    alt="background"
                    className="bg-contain block w-[450px]"
                />
                <div className="absolute left-[14px] bottom-[-64px] cursor-pointer">
                    <div onClick={handleClickUpload}>
                        <div className="border-base-300 border-4 rounded-full">
                            <Avatar sx={{ width: 90, height: 90 }} src={profilePicture || tempPicture} />
                        </div>
                        <div className="absolute right-0 bottom-0 bg-base-200 rounded-full border-2 border-base-300">
                            <MyButton isRounded height={36} width={36}>
                                <MdOutlineCameraAlt className="text-base-content size-5" />
                            </MyButton>
                        </div>
                        <input
                            ref={inputRef}
                            onChange={(e) => handleUploadFile(e.target.files[0])}
                            type="file"
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div className="absolute top-1/2 left-[260px] transform -translate-x-1/2 -translate-y-1/2 w-[300px]">
                        <div className="flex items-center">
                            <span className="text-base-content font-semibold text-xl mr-2 break-words max-w-[234px] line-clamp-2">
                                {`${firstName} ${lastName}`}
                            </span>
                            <MyButton isRounded height={36} width={36} onClick={() => setIsShowEditForm(true)}>
                                <LuPenLine className="text-base-content size-5" />
                            </MyButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-1 mt-[75px]"></div>
            <div className="px-4 py-1 flex flex-col">
                <span className="text-base-content font-semibold text-lg mb-2"> {t('profile.personalInfo')}</span>
                {dataInfo.map((info, index) => (
                    <div className="flex items-center my-2" key={index}>
                        <span className="text-base-content text-lg w-[120px] inline-block">{info.label}</span>
                        <span className="text-base-content text-lg font-semibold">
                            {info.label === t('profile.gender')
                                ? genderText(info.value)
                                : info.value || t('profile.noData')}
                        </span>
                    </div>
                ))}
            </div>
            <div className="w-full border-base-300 border-t-2">
                <MyButton width={'100%'} onClick={() => setIsShowEditForm(true)}>
                    <LuPenLine className="text-base-content size-6" />
                    <span className="text-base-content font-semibold text-lg text-no ml-3">
                        {' '}
                        {t('common.button.update')}
                    </span>
                </MyButton>
            </div>
        </>
    );
}

ProfileInfo.propTypes = {
    setIsShowEditForm: PropTypes.func.isRequired,
};

export default memo(ProfileInfo);
