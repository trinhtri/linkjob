import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useRef } from 'react';
import * as yup from 'yup';
import { ChangePasswordDto } from '../../services/user/dto/changePasswordDto';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { userService } from '../../services/user/userService';
import { Toast } from 'primereact/toast';
interface Props {
    visible: boolean;
    currentId: string;
    onCloseModal: () => void;
}

const ChangePassword = ({ visible, currentId, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);
    const validationSchema = yup.object().shape({
        currentPassword: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        confirmPassword: yup
            .string()
            .required('Confirm Password is required')
            .oneOf([yup.ref('password')], 'Passwords must match')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ChangePasswordDto>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema)
    });


    const changePasswordMutation = useMutation((data) => userService.changePassword(data));
    const onSubmit = (data: any) => {
        const request = {
            userId: currentId,
            ...data
        };
        console.log("data", request)

        changePasswordMutation.mutate(request, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Create user successfully', life: 3000 });
                reset();
                onCloseModal();
            },
            onError: (error: any) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: "Cập nhật mật khẩu không thành công", life: 3000 });
            }
        });
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onCloseModal} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit(onSubmit)} loading={changePasswordMutation.isLoading} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '450px' }} header={'Change password'} modal className="p-fluid" footer={productDialogFooter} onHide={onCloseModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="password">Current password *</label>
                        <InputText type="password" id="currentPassword" {...register('currentPassword')} className={`form-control ${errors.currentPassword ? 'p-invalid' : ''}`} placeholder="Current password" />
                        <small className="p-error">{errors.currentPassword?.message?.toString()}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="password">New password *</label>
                        <InputText id="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'p-invalid' : ''}`} placeholder="Password" />
                        <small className="p-error">{errors.password?.message?.toString()}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="confirmPassword">Confirm password *</label>
                        <InputText type="password" id="confirmPassword" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'p-invalid' : ''}`} placeholder="Confirm password" />
                        <small className="p-error">{errors.confirmPassword?.message?.toString()}</small>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default ChangePassword;
