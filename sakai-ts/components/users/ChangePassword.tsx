import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ChangePasswordDto } from '../../pages/api/user/dto/changePasswordDto';

interface Props {
    visible: boolean;
    isLoading: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    register: UseFormRegister<ChangePasswordDto>;
    errors: FieldErrors<ChangePasswordDto>;
}

const ChangePassword = ({ visible, errors, isLoading, onCancel, onSubmit, register }: Props) => {
    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onCancel} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={onSubmit} loading={isLoading} />
        </>
    );
    return (
        <>
            <Dialog visible={visible} style={{ width: '450px' }} header={'Change password'} modal className="p-fluid" footer={productDialogFooter} onHide={onCancel}>
                <form onSubmit={onSubmit} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="password">Current password *</label>
                        <InputText type="password" id="currentPassword" {...register('currentPassword')} className={`form-control ${errors.currentPassword ? 'p-invalid' : ''}`} placeholder="Current password" />
                        <small className="p-error">{errors.currentPassword?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="password">New password *</label>
                        <InputText id="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'p-invalid' : ''}`} placeholder="Password" />
                        <small className="p-error">{errors.password?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="confirmPassword">Confirm password *</label>
                        <InputText type="password" id="confirmPassword" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'p-invalid' : ''}`} placeholder="Confirm password" />
                        <small className="p-error">{errors.confirmPassword?.message}</small>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default ChangePassword;
