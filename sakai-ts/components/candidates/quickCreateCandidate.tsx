import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useRef } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { CreateOrUpdateLanguageRequest } from '../../services/language/dto/createOrUpdateLanguageRequest';
import { languageService } from '../../services/language/languageService';
import { QuickCreateCandidateRequest } from '../../services/candidate/dto/quickCreateCandidateRequest';
import { candidateService } from '../../services/candidate/candidateService';
import axios from 'axios';
import getConfig from 'next/config';
interface Props {
    visible: boolean;
    onCloseModal: () => void;
}

const QuickCreateCandidate = ({ visible, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);

    const validationSchema = yup.object().shape({
        fullName: yup.string().required("Vui lòng nhập họ tên"),
    });

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors }
    } = useForm<QuickCreateCandidateRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
    });

    const addCandidateMutation = useMutation((data: QuickCreateCandidateRequest) => candidateService.quickCreate(data));
    const onSubmit = (data: QuickCreateCandidateRequest) => {
        addCandidateMutation.mutate(data, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Thêm mới ứng viên thành công', life: 3000 });
                onCloseModal();
            },
            onError: (error: any) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
                onCloseModal();
            }
        });
        reset();
    };
    const onHandleCanncel = () => {
        reset();
        onCloseModal();
    }
    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onHandleCanncel} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit(onSubmit)}
                loading={addCandidateMutation.isLoading} />
        </>
    );
    
    const { publicRuntimeConfig } = getConfig();
    const onUpload = (event: any) => {
        if (event.target && event.target.files[0]) {
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            const apiUpload = `${publicRuntimeConfig.apiUrl}/files`;
            setValue("cvName", event.target.files[0].name);
            axios
                .post(apiUpload, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    setValue("cvUrl", response.data);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }
    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '650px' }}
                header={'Thêm nhanh ứng viên'}
                modal className="p-fluid" footer={productDialogFooter} onHide={onCloseModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl">
                <div className="field mb-6">
                        <div className="max-w-xl">
                            <div id="form-file-upload">
                                <input type="file" id="input-file-upload" multiple={false} onChange={onUpload} />
                                <label id="label-file-upload" htmlFor="input-file-upload">
                                    <div>
                                        <p>Drag and drop your file CV here</p>
                                    </div>
                                </label>
                                <div className="field col-12 text-base mt-2 font-medium	">
                                    <span>Tên file: {getValues('cvName')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="name">Tên *</label>
                        <InputText id="name" required autoFocus {...register('fullName')} className={`form-control ${errors.fullName ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.fullName?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="wish">Vị trí ứng tuyển</label>
                        <InputText id="name" {...register('wish')} className={`form-control ${errors.wish ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.wish?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="name">Năm sinh</label>
                        <InputText id="name" {...register('dateOfBirth')} className={`form-control ${errors.dateOfBirth ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.dateOfBirth?.message}</small>
                    </div>
                    <div className="field">
                        <label htmlFor="supporter">Người hỗ trợ</label>
                        <InputText id="supporter" {...register('supporter')} className={`form-control ${errors.supporter ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.supporter?.message}</small>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default QuickCreateCandidate;
