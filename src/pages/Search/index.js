import axios from 'axios';
import classNames from 'classnames/bind';
import queryString from 'query-string';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';

import styles from './Search.module.scss';

const cx = classNames.bind(styles);
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
};

Modal.setAppElement('#root');

function Search() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const location = useLocation();
    const params = queryString.parse(location.search);

    const [isLoading, setIsLoading] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState(true);

    const postData = async (data) => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'post',
                url: 'https://hitek-02.hitek.com.vn:6062/api/v1/pack/submit',
                data,
            });
            console.log('🚀 ~ file: index.js ~ line 30 ~ postData ~ res', res);

            setIsLoading(false);
            openModal(true);
        } catch (error) {
            setIsLoading(false);
            openModal(false);
        }
    };

    const onSubmitForm = useCallback(
        (dataForm) => {
            const data = {
                ...dataForm,
                pack_id: params.pack_id,
            };

            postData(data);
        },
        [params.pack_id],
    );

    function openModal(status) {
        setStatus(status);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo')}>
                <img
                    src="https://ungdunghotrodieutricovid19.hitek.com.vn:9056/api/v1/image/get/resized-image-1653108966910.png"
                    alt="abeauty"
                />
            </div>
            <form className={cx('form')} onSubmit={handleSubmit(onSubmitForm)}>
                <div className={cx('form-controls')}>
                    <label htmlFor="phone"></label>
                    <input
                        className={cx('phone-input')}
                        id="phone"
                        name="phone"
                        type="text"
                        placeholder="Nhập số điện thoại"
                        {...register('phone', {
                            required: 'SĐT không được để trống',
                            pattern: {
                                value: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                                message: 'SĐT không đúng định dạng',
                            },
                            maxLength: {
                                value: 11,
                                message: 'SĐT không được dài hơn 11 ký tự',
                            },
                        })}
                    />
                    {errors.phone && <p className={cx('error-message')}>{errors.phone.message}</p>}
                </div>

                <button className={cx('submit-btn')} disabled={isLoading}>
                    HOÀN THÀNH
                </button>
            </form>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                shouldCloseOnOverlayClick={true}
            >
                <div className={cx('wrapper-modal')}>
                    <img
                        src="https://ungdunghotrodieutricovid19.hitek.com.vn:9056/api/v1/image/get/resized-image-1653115504055.png"
                        alt="success"
                    />
                    <p className={cx('message')}>{status ? 'Thành công' : 'Thất bại'}</p>
                    <button className={cx('close-modal-btn')} onClick={closeModal}>
                        Đóng
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Search;
