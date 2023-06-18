import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { CreateOrUpdateLanguageRequest } from '../../services/language/dto/createOrUpdateLanguageRequest';
import { languageService } from '../../services/language/languageService';
interface Props {
    visible: boolean;
    currentId: string;
    onCloseModal: () => void;
}

const CreateLanguage = ({ visible, currentId, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);
    const { data: language } = useQuery(
        ["GetLanguageById"],
        () => languageService.getById(currentId),
        {
            enabled: !!visible && !!currentId
        }
    );

    const validationSchema = yup.object().shape({
        ctyNhan: yup.array().min(1, "Vui lòng chọn cty"),
    });

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors }
    } = useForm<CreateOrUpdateLanguageRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (language) {
            setValue("id", language.data.id);
            setValue("name", language.data.name);
        }
    }, [language, setValue]);

    const addLanguageMutation = useMutation((data: CreateOrUpdateLanguageRequest) => languageService.create(data));
    const addUpdateMutation = useMutation((data: CreateOrUpdateLanguageRequest) => languageService.update(data));
    const onSubmit = (data: CreateOrUpdateLanguageRequest) => {
        if (!!data.id) {
            addUpdateMutation.mutate(data, {
                onSuccess: () => {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Chỉnh sửa ngôn ngữ thành công', life: 3000 });
                    reset();
                    onCloseModal();
                },
                onError: (error: any) => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
                    onCloseModal();
                }
            });
        } else {
            addLanguageMutation.mutate(data, {
                onSuccess: () => {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Thêm mới ngôn ngữ thành công', life: 3000 });
                    onCloseModal();
                },
                onError: (error: any) => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
                    onCloseModal();
                }
            });
        }
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
                loading={addLanguageMutation.isLoading || addUpdateMutation.isLoading} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '450px' }}
                header={getValues('id') != undefined ? 'Chỉnh sủa ngôn ngữ' : 'Thêm mới ngôn ngữ'}
                modal className="p-fluid" footer={productDialogFooter} onHide={onCloseModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
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

export default CreateLanguage;
