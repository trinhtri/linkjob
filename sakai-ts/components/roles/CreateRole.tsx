import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { CreateOrUpdateRoleDto } from '../../pages/api/role/dto/createOrUpdateRoleDto';

interface Props {
    visible: boolean;
    isLoading: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    register: UseFormRegister<CreateOrUpdateRoleDto>;
    getValues: UseFormGetValues<CreateOrUpdateRoleDto>;
    errors: FieldErrors<CreateOrUpdateRoleDto>;
}

const CreateRole = ({ visible, errors, isLoading, onCancel, onSubmit, register, getValues }: Props) => {
    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onCancel} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={onSubmit} loading={isLoading} />
        </>
    );
    return (
        <>
            <Dialog visible={visible} style={{ width: '450px' }} header={getValues('id') != undefined ? 'Edit role' : 'Create role'} modal className="p-fluid" footer={productDialogFooter} onHide={onCancel}>
                <form onSubmit={onSubmit} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="name">Tên *</label>
                        <InputText id="name" required autoFocus {...register('name')} className={`form-control ${errors.name ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.name?.message}</small>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default CreateRole;
