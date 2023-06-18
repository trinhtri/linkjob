import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import { Toast } from 'primereact/toast';
import { companyService } from '../../services/company/companyService';
import { Calendar } from 'primereact/calendar';
import { UpdateLastCallCompanyRequest } from '../../services/company/dto/updateLastCallCompanyRequest';
interface Props {
    visible: boolean;
    currentId: string;
    onCloseModal: () => void;
}

const UpdateLastCallCompanyModal = ({ visible, currentId, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);
    const [lastCall, setLastCall] = useState<Date>();

    const { data: company } = useQuery(
        ["GetCompanyById"],
        () => companyService.getById(currentId),
        {
            enabled: !!visible && !!currentId
        }
    );

    const validationSchema = yup.object().shape({
        // nextCall: yup.string().required("Vui lòng nhập ngày gọi tiếp theo"),
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<UpdateLastCallCompanyRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (company) {
            setValue("companyId", company.data.id);
            if (company.data.lastCall)
                setLastCall(new Date(company.data.lastCall));
        }
    }, [company, setValue]);

    const updateLastCallMutation = useMutation((data: UpdateLastCallCompanyRequest) => companyService.updateLastCall(data));
    const onSubmit = (data: UpdateLastCallCompanyRequest) => {
        if (lastCall === null || lastCall === undefined)
            return;
        const input = {
            companyId: currentId,
            lastCall: lastCall
        } as UpdateLastCallCompanyRequest;
        updateLastCallMutation.mutate(input, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Chỉnh sửa thời gian gọi tiếp theo thành công', life: 3000 });
                setLastCall(undefined);
                onCloseModal();
            },
            onError: (error: any) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
                setLastCall(undefined);
                onCloseModal();
            }
        });
    };
    const onHandleCanncel = () => {
        reset();
        setLastCall(undefined);
        onCloseModal();
    }
    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onHandleCanncel} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit(onSubmit)}
                loading={updateLastCallMutation.isLoading} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '450px' }}
                header={'Chỉnh sửa ngày cuộc gọi tiếp'}
                modal className="p-fluid" footer={productDialogFooter} onHide={onCloseModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="nextCall">Cuộc gọi cuối</label>
                        <Calendar
                            dateFormat="dd/mm/yy"
                            value={lastCall}
                            onChange={(e: any) => {
                                setLastCall(e.value);
                            }}
                        ></Calendar>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default UpdateLastCallCompanyModal;
