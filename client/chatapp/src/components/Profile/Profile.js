import { useEffect, useRef, useState } from 'react';

import ModalFormSwitcher from '../Modals/ModalFormSwitcher';
import ProfileInfo from './ProfileInfo';
import ProfileEdit from './ProfileEdit';

function Profile({ isOpen, setIsOpen }) {
    const formRef = useRef();
    const [isShowEditForm, setIsShowEditForm] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsShowEditForm(false);
        }
    }, [isOpen]);

    return (
        <ModalFormSwitcher
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            mainForm={<ProfileInfo setIsShowEditForm={setIsShowEditForm} />}
            subForm={<ProfileEdit setIsShowEditForm={setIsShowEditForm} />}
            subFormRef={formRef}
            isShowSubForm={isShowEditForm}
            setIsShowSubForm={setIsShowEditForm}
        />
    );
}

export default Profile;
