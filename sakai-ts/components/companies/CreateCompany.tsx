import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { CreateOrUpdateCompanyRequest } from '../../services/company/dto/createOrUpdateCompanyRequest';

interface Props {
    visible: boolean;
    isLoading: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    register: UseFormRegister<CreateOrUpdateCompanyRequest>;
    getValues: UseFormGetValues<CreateOrUpdateCompanyRequest>;
    errors: FieldErrors<CreateOrUpdateCompanyRequest>;
}

const CreateCompany = ({ visible, errors, isLoading, onCancel, onSubmit, register, getValues }: Props) => {
    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onCancel} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={onSubmit} loading={isLoading} />
        </>
    );
    return (
        <>
            <Dialog visible={visible} style={{ width: '750px' }}
                header={getValues('id') != undefined ? 'Chỉnh sửa công ty' : 'Thêm mới công ty'}
                modal className="p-fluid" footer={productDialogFooter} onHide={onCancel}>
                <form onSubmit={onSubmit} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="name">Tên cty*</label>
                        <InputText id="name" required autoFocus {...register('name')} className={`form-control ${errors.name ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.name?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="connecter">Nhân sự</label>
                        <InputText id="connecter"  {...register('connecter')} className={`form-control ${errors.connecter ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.connecter?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email"  {...register('email')} className={`form-control ${errors.name ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.email?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="landline">Điện thoại bàn</label>
                        <InputText id="landline"  {...register('landline')} className={`form-control ${errors.name ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.landline?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="phoneNumber">Sdt cá nhân</label>
                        <InputText id="phoneNumber"  {...register('phoneNumber')} className={`form-control ${errors.name ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.phoneNumber?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="address">Địa chỉ</label>
                        <InputText id="address"  {...register('address')} className={`form-control ${errors.address ? 'p-invalid' : ''}`} />
                    </div>
                    <div className="field">
                        <label htmlFor="connecter">Nhân sự</label>
                        <InputText id="connecter"  {...register('connecter')} className={`form-control ${errors.name ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.name?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="connecter">Nhân sự</label>
                        <InputText id="connecter"  {...register('connecter')} className={`form-control ${errors.name ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.name?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="note">Ghi chú</label>
                        <InputTextarea autoResize rows={3} cols={30}   {...register("note")} />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default CreateCompany;
