import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import { Toast } from 'primereact/toast';
import { UpdateNextCallCompanyRequest } from '../../services/company/dto/updateNextCallCompanyRequest';
import { companyService } from '../../services/company/companyService';
import { Calendar } from 'primereact/calendar';
interface Props {
    visible: boolean;
    currentId: string;
    onCloseModal: () => void;
}

const UpdateNextCallCompanyModal = ({ visible, currentId, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);
    const [nextCall, setNextCall] = useState<Date>();

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
    } = useForm<UpdateNextCallCompanyRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (company) {
            setValue("companyId", company.data.id);
            if (company.data.nextCall)
                setNextCall(new Date(company.data.nextCall));
        }
    }, [company, setValue]);

    const updateNextCallMutation = useMutation((data: UpdateNextCallCompanyRequest) => companyService.updateNextCall(data));
    const onSubmit = (data: UpdateNextCallCompanyRequest) => {
        if (nextCall === null || nextCall === undefined)
            return;
        const input = {
            companyId: currentId,
            nextCall: nextCall
        } as UpdateNextCallCompanyRequest;
        updateNextCallMutation.mutate(input, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Chỉnh sửa thời gian gọi tiếp theo thành công', life: 3000 });
                setNextCall(undefined);
                onCloseModal();
            },
            onError: (error: any) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
                setNextCall(undefined);
                onCloseModal();
            }
        });
    };
    const onHandleCanncel = () => {
        reset();
        setNextCall(undefined);
        onCloseModal();
    }
    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onHandleCanncel} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit(onSubmit)}
                loading={updateNextCallMutation.isLoading} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '450px' }}
                header={'Chỉnh sửa ngày cuộc gọi tiếp'}
                modal className="p-fluid" footer={dialogFooter} onHide={onCloseModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="nextCall">Ngày tiếp cận tiếp theo</label>
                        <Calendar
                            dateFormat="dd/mm/yy"
                            value={nextCall}
                            onChange={(e: any) => {
                                setNextCall(e.value);
                            }}
                        ></Calendar>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default UpdateNextCallCompanyModal;
