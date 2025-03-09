import { RadioGroup } from '@mui/joy';
import MyInput from '../MyInput/MyInput';
import MyRadio from '../MyRadio/MyRadio';
import MyButton from '../MyButton/MyButton';
import { useSelector } from 'react-redux';

function ProfileEdit({ setIsShowEditForm }) {
    const { gender, dob, first_name, last_name } = useSelector((state) => state.auth.data);

    return (
        <form className="px-4 py-1 flex flex-col items-center">
            <div className="flex flex-col my-2 w-full">
                <span className="mb-2 text-text-bold font-semibold">Tên hiển thị</span>
                <MyInput size="lg" value={`${first_name} ${last_name}`} />
            </div>
            <div className="flex flex-col my-2 w-full">
                <span className="mb-2 text-text-bold text-lg font-semibold">Thông tin cá nhân</span>
                <RadioGroup defaultValue={String(gender)} name="radio-buttons-group">
                    <div className="flex my-2">
                        <MyRadio value="true" label="Nam" size="md" />
                        <span className="mx-6"></span>
                        <MyRadio value="false" label="Nữ" size="md" />
                    </div>
                </RadioGroup>
            </div>
            <div className="flex flex-col my-2 w-full">
                <span className="mb-2 text-text-bold font-semibold">Ngày sinh</span>
                <MyInput size="lg" type="date" defaultValue={dob} />
            </div>
            <div className="border-border border-t-2 w-full flex justify-end items-center p-2">
                <MyButton height={50} onClick={() => setIsShowEditForm(false)}>
                    <span className="text-text-bold font-semibold">Hủy</span>
                </MyButton>
                <MyButton height={50} width={'100px'} className="bg-background ml-4">
                    <span className="text-text-bold font-semibold">Cập nhật</span>
                </MyButton>
            </div>
        </form>
    );
}

export default ProfileEdit;
