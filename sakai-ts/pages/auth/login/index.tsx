/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Page } from '../../../types/types';
import { userService } from '../../api/user/userService';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Toast } from 'primereact/toast';

interface ILoginDto {
    email: string;
    password: string;
}
const LoginPage: Page = () => {
    const toast = useRef<Toast>(null);
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const validationSchema = yup.object().shape({
        email: yup.string().required('Email is required').email('Email is invalid'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ILoginDto>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data: ILoginDto) => {
        userService
            .login(data.email, data.password)
            .then(() => {
                const returnUrl = (router.query.returnUrl || '/') as string;
                router.push(returnUrl);
            })
            .catch(() => {
                toast.current?.show({ severity: 'error', summary: 'Login fail', detail: 'Tài khoản không hợp lệ. Vui lòng thử lại!', life: 3000 });
            })
            .finally(() => reset());
    };

    return (
        <>
            <Toast ref={toast} />
            <div className={containerClassName}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
                    <div className="flex flex-column align-items-center justify-content-center">
                        {/* <img src={`${contextPath}/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" /> */}
                        <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                            <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                                <div className="text-center mb-5">
                                    <div className="text-900 text-3xl font-medium mb-3">Đăng nhập</div>
                                </div>
                                <div>
                                    <div className="field">
                                        <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                            {' '}
                                            Email
                                        </label>
                                        <InputText id="email1" type="text" {...register('email')} placeholder="Email address" className="w-full md:w-30rem block" style={{ padding: '1rem' }} />
                                        <small className="p-error">{errors.email?.message}</small>
                                    </div>
                                    <div className="field">
                                        <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                            Mật khẩu
                                        </label>
                                        <InputText id="password" type="password" {...register('password')} placeholder="Password" className="w-full md:w-30rem block" style={{ padding: '1rem' }} />
                                        <small className="p-error">{errors.password?.message}</small>
                                    </div>
                                    <Button label="Đăng nhập" className="w-full p-3 text-xl" onClick={handleSubmit(onSubmit)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>

    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
