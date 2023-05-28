import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { Button } from 'primereact/button';
import { CreateOrUpdateUserDto } from '../../pages/api/user/dto/createOrUpdateUserDto';

interface Props {
    visible: boolean;
    isLoading: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    register: UseFormRegister<CreateOrUpdateUserDto>;
    getValues: UseFormGetValues<CreateOrUpdateUserDto>;
    errors: FieldErrors<CreateOrUpdateUserDto>;
}

const CreateUser = ({ visible, errors, isLoading, onCancel, onSubmit, register, getValues }: Props) => {
    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onCancel} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={onSubmit} loading={isLoading} />
        </>
    );
    return (
        <>
            <Dialog visible={visible} style={{ width: '450px' }} header={getValues('userId') != undefined ? 'Edit user' : 'Create user'} modal className="p-fluid" footer={productDialogFooter} onHide={onCancel}>
                <form onSubmit={onSubmit} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="name">User name *</label>
                        <InputText id="name" required placeholder="User name" autoFocus {...register('userName')} className={`form-control ${errors.userName ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.userName?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email *</label>
                        <InputText id="email" required placeholder="Email" {...register('email')} className={`form-control ${errors.email ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.email?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password *</label>
                        <InputText id="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'p-invalid' : ''}`} placeholder="Password" />
                        <small className="p-error">{errors.password?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="confirmPassword">Confirm password *</label>
                        <InputText id="confirmPassword" type="password" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'p-invalid' : ''}`} placeholder="Confirm password" />
                        <small className="p-error">{errors.confirmPassword?.message}</small>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default CreateUser;
