import { Avatar } from '@mui/material';
import MyButton from '../MyButton/MyButton';
import { MdOutlineCameraAlt } from 'react-icons/md';
import { LuPenLine } from 'react-icons/lu';
import { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateMyInfo } from '~/redux/reducers/authSlice';

function ProfileInfo({ setIsShowEditForm }) {
    const dispatch = useDispatch();
    const { gender, dob, phone, firstName, lastName, profilePicture } = useSelector((state) => state.auth.data.data);

    const inputRef = useRef(null);
    const [tempPicture, setTempPicture] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUploadFile = async (picture) => {
        if (!picture) return;

        if (!picture.type.startsWith('image/')) {
            setError('Please upload an image file (jpg, png, etc.)');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (picture.size > maxSize) {
            setError('File size exceeds 5MB limit');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', picture);
        formData.append('upload_preset', 'chat-app');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/doxc6iqyk/image/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            console.log(data);

            if (data.secure_url) {
                setTempPicture(data.secure_url);
                dispatch(updateMyInfo({ profilePicture: data.secure_url }));
            } else {
                setError('Upload failed. Please try again.');
            }
        } catch (error) {
            setError('Error uploading file. Please try again.');
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClickUpload = () => {
        inputRef.current.click();
    };

    const dataInfo = [
        { label: 'Giới tính', value: gender },
        { label: 'Ngày sinh', value: dob },
        { label: 'Điện thoại', value: phone },
    ];

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
            <div className="py-1 bg-base-100 mt-[75px]"></div>
            <div className="px-4 py-1 flex flex-col">
                <span className="text-base-content font-semibold text-lg mb-2">Thông tin cá nhân</span>
                {dataInfo.map((info, index) => (
                    <div className="flex items-center my-2" key={index}>
                        <span className="text-base-content text-lg w-[120px] inline-block">{info.label}</span>
                        <span className="text-base-content text-lg font-semibold">
                            {info.label === 'Giới tính'
                                ? info.value === 'MALE'
                                    ? 'Nam'
                                    : info.value === 'FEMALE'
                                    ? 'Nữ'
                                    : 'Khác'
                                : info.value}
                        </span>
                    </div>
                ))}
            </div>
            <div className="w-full border-base-300 border-t-2">
                <MyButton width={'100%'} onClick={() => setIsShowEditForm(true)}>
                    <LuPenLine className="text-base-content size-6" />
                    <span className="text-base-content font-semibold text-lg text-no ml-3">Cập nhật</span>
                </MyButton>
            </div>
        </>
    );
}

ProfileInfo.propTypes = {
    setIsShowEditForm: PropTypes.func.isRequired,
};

export default memo(ProfileInfo);
