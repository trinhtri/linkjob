import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { Toast } from 'primereact/toast';
import { candidateService } from '../../services/candidate/candidateService';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { SetInterviewScheduleRequest } from '../../services/candidate/dto/setInterviewScheduleRequest';
interface Props {
    visible: boolean;
    currentId: string;
    companyId: string;
    companyName: string;
    onCloseModal: () => void;
}

const SetInterviewSchedule = ({ visible, currentId, companyId, companyName, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);
    const [timeInterview, setTimeInterview] = useState(new Date());

    const validationSchema = yup.object().shape({
        companyId: yup.string().required("Vui lòng chọn công ty"),
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<SetInterviewScheduleRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (currentId)
            setValue("candidateId", currentId);
        if (companyId)
            setValue("companyId", companyId);
    }, [companyId, currentId, setValue, visible]);

    const setInterviewScheduleMutation = useMutation((data: SetInterviewScheduleRequest) => candidateService.setInterviewSchedule(data));
    const onSubmit = (data: SetInterviewScheduleRequest) => {
        const request = {
            ...data
        };
        request.interviewSchedule = timeInterview;
        setInterviewScheduleMutation.mutate(request, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Gửi CV thành công', life: 3000 });
                reset();
                onCloseModal();
            },
            onError: (error: any) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: "Gửi CV thất bại", life: 3000 });
            }
        });
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-danger" onClick={onCloseModal} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit(onSubmit)} loading={setInterviewScheduleMutation.isLoading} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '650px' }} header={`Đặt lịch phỏng vấn cho ${companyName}`} modal className="p-fluid" footer={productDialogFooter} onHide={onCloseModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="schedule">Ngày phỏng vấn</label>
                        <Calendar dateFormat="dd/mm/yy"
                            id='NgayPV'
                            value={timeInterview}
                            onChange={(e: any) =>
                                setTimeInterview(e.value)}
                        ></Calendar>
                    </div>
                    <div className="field">
                        <label htmlFor="schedule">Giờ phỏng vấn</label>
                        <Calendar
                            timeOnly
                            showTime
                            hourFormat="12"
                            id='GioPV'
                            value={timeInterview}
                            onChange={(e: any) =>
                                setTimeInterview(e.value)}
                        >
                        </Calendar>
                    </div>
                    <div className="field">
                        <label htmlFor="schedule">Ghi chú</label>
                        <InputTextarea autoResize rows={3} cols={30}   {...register("note")} />
                    </div>
                </form>
            </Dialog >
        </>
    );

};

export default SetInterviewSchedule;
