import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { Toast } from 'primereact/toast';
import { CreateOrUpdateUserDto } from '../../services/user/dto/createOrUpdateUserDto';
import { userService } from '../../services/user/userService';
interface Props {
    visible: boolean;
    onCancel: () => void;
    onCreatedUser: () => void;
}

const CreateUser = ({ visible, onCancel, onCreatedUser }: Props) => {
    const toast = useRef<Toast>(null);
    const validationSchema = yup.object().shape({
        email: yup.string().required('Email is required').email('Email is invalid'),
        userName: yup.string().required('User name is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required')
    });

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors }
    } = useForm<CreateOrUpdateUserDto>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema)
    });

    const addUserMutation = useMutation((newUser) => userService.create(newUser));
    const onSubmit = (data: any) => {
        addUserMutation.mutate(data, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Create user successfully', life: 3000 });
                reset();
                onCreatedUser();
            },
            onError: (error: any) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
            }
        });
    };


    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onCancel} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit(onSubmit)} loading={addUserMutation.isLoading} />
        </>
    );
    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '450px' }} header={getValues('userId') != undefined ? 'Edit user' : 'Create user'} modal className="p-fluid" footer={productDialogFooter} onHide={onCancel}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="name">User name *</label>
                        <InputText id="name" required placeholder="User name" autoFocus {...register('userName')} className={`form-control ${errors.userName ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.userName?.message?.toString()}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email *</label>
                        <InputText id="email" required placeholder="Email" {...register('email')} className={`form-control ${errors.email ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.email?.message?.toString()}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password *</label>
                        <InputText id="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'p-invalid' : ''}`} placeholder="Password" />
                        <small className="p-error">{errors.password?.message?.toString()}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="confirmPassword">Confirm password *</label>
                        <InputText id="confirmPassword" type="password" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'p-invalid' : ''}`} placeholder="Confirm password" />
                        <small className="p-error">{errors.confirmPassword?.message?.toString()}</small>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default CreateUser;
