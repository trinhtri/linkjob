import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import { Toast } from 'primereact/toast';
import { candidateService } from '../../services/candidate/candidateService';
import { commonLookupService } from '../../services/commonLookup/commonLookupService';
import { CommonLookupRequest } from '../../services/commonLookup/dto/commonLookupRequest';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { SetInterviewScheduleRequest } from '../../services/candidate/dto/setInterviewScheduleRequest';
import moment from 'moment';
interface Props {
    visible: boolean;
    currentId: string;
    onCloseModal: () => void;
}

const SetInterviewSchedule = ({ visible, currentId, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);
    const { data: companies } = useQuery(
        ["Companies"],
        () => {
            let param = {
                type: "Company",
                parentId: currentId
            } as CommonLookupRequest;
            return commonLookupService.getLookup(param);
        },
        {
            enabled: visible && !!currentId
        }
    );

    const validationSchema = yup.object().shape({
        companyId: yup.string().required("Vui lòng chọn công ty"),
    });

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors }
    } = useForm<SetInterviewScheduleRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            interviewSchedule: new Date()
        }
    });

    useEffect(() => {
        if (currentId)
            setValue("candidateId", currentId);
    }, [currentId, setValue, visible]);

    const setInterviewScheduleMutation = useMutation((data: SetInterviewScheduleRequest) => candidateService.setInterviewSchedule(data));
    const onSubmit = (data: SetInterviewScheduleRequest) => {
        const request = {
            ...data
        };
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

    const [timeInterview, setTimeInterview] = useState(moment.now);
    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '650px' }} header={'Đặt lịch phỏng vấn'} modal className="p-fluid" footer={productDialogFooter} onHide={onCloseModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="companyId">Công ty *</label>
                        <Dropdown
                            id="companyId"
                            options={companies?.data}
                            value={getValues("companyId")}
                            optionLabel="label"
                            optionValue="value"
                            className={`form-control ${errors.companyId ? "p-invalid" : ""
                                }`}
                            onChange={(e) =>
                                setValue("companyId", e.value, {
                                    shouldValidate: true,
                                })
                            }
                        />
                        <small className="p-error">
                            {errors.companyId?.message?.toString()}
                        </small>
                    </div>
                    <div className="field">
                        <label htmlFor="schedule">Ngày phỏng vấn</label>
                        <Calendar dateFormat="dd/mm/yy"
                            id='NgayPV'
                            value={getValues("interviewSchedule")}
                            {...register("interviewSchedule")}
                            onChange={(e: any) =>
                                setValue("interviewSchedule", e.value)
                            }
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
