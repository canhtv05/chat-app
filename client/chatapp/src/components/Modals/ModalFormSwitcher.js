import { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ModalLink from './ModalLink';

function ModalFormSwitcher({
    mainForm,
    subForm,
    isOpen,
    setIsOpen,
    subFormRef,
    isShowSubForm,
    setIsShowSubForm,
    valueScrollHeight,
}) {
    const containerRef = useRef();
    const initialContainerHeightRef = useRef();

    useEffect(() => {
        if (!isOpen) {
            setIsShowSubForm(false);
        }
    }, [isOpen, setIsShowSubForm]);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.style.transition = 'height 0.3s ease-in-out';
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        if (!initialContainerHeightRef.current) {
            initialContainerHeightRef.current = containerRef.current.scrollHeight;
            containerRef.current.style.height = `${initialContainerHeightRef.current}px`;
        }

        if (subFormRef.current) {
            requestAnimationFrame(() => {
                if (isShowSubForm) {
                    containerRef.current.style.height = `${subFormRef.current.scrollHeight}px`;
                } else {
                    containerRef.current.style.height = `${initialContainerHeightRef.current}px`;
                }
            });
        }
    }, [isShowSubForm, subFormRef]);

    // handle resize form
    useEffect(() => {
        if (valueScrollHeight && isShowSubForm) {
            containerRef.current.style.height = `${valueScrollHeight}px`;
        }
    }, [isShowSubForm, valueScrollHeight]);

    return (
        <ModalLink outline title="Thông tin tài khoản">
            <div className="relative overflow-hidden transition-all" ref={containerRef}>
                <div
                    className={`relative w-full transition-transform duration-300 ease-in-out ${
                        isShowSubForm ? '-translate-x-full' : 'translate-x-0'
                    }`}
                >
                    {mainForm}
                </div>

                <div
                    className={`absolute top-0 w-full transition-transform duration-300 ease-in-out ${
                        isShowSubForm ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    ref={subFormRef}
                >
                    {subForm}
                </div>
            </div>
        </ModalLink>
    );
}

ModalFormSwitcher.propTypes = {
    mainForm: PropTypes.node.isRequired,
    subForm: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    subFormRef: PropTypes.object.isRequired,
    isShowSubForm: PropTypes.bool.isRequired,
    setIsShowSubForm: PropTypes.func.isRequired,
};

export default memo(ModalFormSwitcher);
