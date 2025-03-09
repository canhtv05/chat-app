import { Avatar } from '@mui/material';
import MyButton from '../MyButton/MyButton';
import { MdOutlineCameraAlt } from 'react-icons/md';
import { LuPenLine } from 'react-icons/lu';
import { memo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function ProfileInfo({ setIsShowEditForm }) {
    const { gender, dob, phone, first_name, last_name } = useSelector((state) => state.auth.data);
    const inputRef = useRef();

    const handleUploadFile = useCallback(() => {
        if (inputRef.current) {
            inputRef.current?.click();
        }
    }, []);

    const dataInfo = [
        { label: 'Giới tính', value: gender },
        { label: 'Ngày sinh', value: dob },
        { label: 'Điện thoại', value: phone },
    ];

    return (
        <>
            <div className="w-[450px] relative">
                <img
                    src="https://images.all-free-download.com/images/graphicwebp/belgium_514505.webp"
                    alt="background"
                    className="bg-contain block w-[450px]"
                />
                <div className="absolute left-[14px] bottom-[-64px] cursor-pointer">
                    <div onClick={handleUploadFile}>
                        <div className="border-border border-4 rounded-full">
                            <Avatar sx={{ width: 90, height: 90 }} />
                        </div>
                        <div className="absolute right-0 bottom-0 bg-background-secondary rounded-full border-2 border-border">
                            <MyButton isRounded height={36} width={36}>
                                <MdOutlineCameraAlt className="text-text-bold size-5" />
                            </MyButton>
                        </div>
                        <input type="file" className="hidden" ref={inputRef} />
                    </div>
                    <div className="absolute top-1/2 left-[260px] transform -translate-x-1/2 -translate-y-1/2 w-[300px]">
                        <div className="flex items-center">
                            <span className="text-text-bold font-semibold text-xl mr-2 break-words max-w-[234px] line-clamp-2">
                                {`${first_name} ${last_name}`}
                            </span>
                            <MyButton isRounded height={36} width={36}>
                                <LuPenLine className="text-text-bold size-5" />
                            </MyButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-1 bg-background mt-[75px]"></div>
            <div className="px-4 py-1 flex flex-col">
                <span className="text-text-bold font-semibold text-lg mb-2">Thông tin cá nhân</span>
                {dataInfo.map((info, index) => (
                    <div className="flex items-center my-2" key={index}>
                        <span className="text-text-light text-lg w-[120px] inline-block">{info.label}</span>
                        <span className="text-text-bold text-lg font-semibold">
                            {info.label === 'Giới tính' ? (info.value === true ? 'Nam' : 'Nữ') : info.value}
                        </span>
                    </div>
                ))}
            </div>
            <div className="w-full border-border border-t-2">
                <MyButton width={'100%'} onClick={() => setIsShowEditForm(true)}>
                    <LuPenLine className="text-text-bold size-6" />
                    <span className="text-text-bold font-semibold text-lg text-no ml-3">Cập nhật</span>
                </MyButton>
            </div>
        </>
    );
}

ProfileInfo.propTypes = {
    setIsShowEditForm: PropTypes.func.isRequired,
};

export default memo(ProfileInfo);
