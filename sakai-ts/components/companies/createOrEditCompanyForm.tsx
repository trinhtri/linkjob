import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { CreateOrUpdateCompanyRequest } from "../../services/company/dto/createOrUpdateCompanyRequest";
import { companyService } from "../../services/company/companyService";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";

interface Props {
    id?: string,
}

const CreateOrEditCompanyForm = ({ id }: Props) => {
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const [lastCall, setLastCall] = useState<Date>();
    const [nextCall, setNextCall] = useState<Date>();

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email("Email is invalid"),
        name: yup.string().required("Vui lòng nhập số tên cty"),
    });

    const { data: companyDetail, isLoading } = useQuery(
        ["GetCompanyById", id],
        () => {
            if (id)
                return companyService.getById(id);
        },
        {
            enabled: !!id
        }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateOrUpdateCompanyRequest>({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (companyDetail) {
            setValue('id', companyDetail.data.id);
            setValue('name', companyDetail.data.name);
            setValue('address', companyDetail.data.address);
            setValue('connecter', companyDetail.data.connecter);
            setValue('email', companyDetail.data.email);
            setValue('landline', companyDetail.data.landline);
            setValue('phoneNumber', companyDetail.data.phoneNumber);
            setValue('note', companyDetail.data.note);

            if (companyDetail.data.lastCall) {
                setLastCall(new Date(companyDetail.data.lastCall));
            }

            if (companyDetail.data.nextCall) {
                setNextCall(new Date(companyDetail.data.nextCall));
            }

        }
    }, [companyDetail, setValue]);

    const createMutation = useMutation((input: CreateOrUpdateCompanyRequest) =>
        companyService.create(input)
    );

    const editMutation = useMutation((input: CreateOrUpdateCompanyRequest) =>
        companyService.update(input)
    );

    const onSubmit = (data: CreateOrUpdateCompanyRequest) => {
        if (lastCall)
            data.lastCall = lastCall;
        if (nextCall)
            data.nextCall = nextCall;
        if (!!companyDetail?.data.id) {
            editMutation.mutate(data, {
                onSuccess: () => {
                    toast.current?.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Chỉnh sửa công ty thành công",
                        life: 3000,
                    });
                    reset();
                    router.push("/companies");
                },
                onError: (error: any) => {
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: error?.response?.data?.errors,
                        life: 3000,
                    });
                },
            });
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    toast.current?.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Thêm mới công ty thành công",
                        life: 3000,
                    });
                    reset();
                    router.push("/companies");
                },
                onError: (error: any) => {
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: error?.response?.data?.errors,
                        life: 3000,
                    });
                },
            });
        }
    };

    const onCancel = () => {
        router.push("/companies");
    };

    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="name">Tên cty*</label>
                        <InputText id="name" required autoFocus {...register('name')} className={`form-control ${errors.name ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.name?.message}</small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="connecter">Nhân sự</label>
                        <InputText id="connecter"  {...register('connecter')} className={`form-control ${errors.connecter ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.connecter?.message}</small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="email">Email</label>
                        <InputText id="email"  {...register('email')} className={`form-control ${errors.email ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.email?.message}</small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address">Địa chỉ</label>
                        <InputText id="address"  {...register('address')} className={`form-control ${errors.address ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.address?.message}</small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="landline">Điện thoại bàn</label>
                        <InputText id="landline"  {...register('landline')} className={`form-control ${errors.landline ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.landline?.message}</small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="phoneNumber">Sdt cá nhân</label>
                        <InputText id="phoneNumber"  {...register('phoneNumber')} className={`form-control ${errors.phoneNumber ? 'p-invalid' : ''}`} />
                        <small className="p-error">{errors.phoneNumber?.message}</small>
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="lastCall">Cuộc gọi cuối</label>
                        <Calendar
                            dateFormat="dd/mm/yy"
                            id='lastCall'
                            value={lastCall}
                            onChange={(e: any) =>
                                setLastCall(e.value)}
                        ></Calendar>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="nextCall">Ngày tiếp cận tiếp theo</label>
                        <Calendar
                            dateFormat="dd/mm/yy"
                            id='nextCall'
                            value={nextCall}
                            onChange={(e: any) =>
                                setNextCall(e.value)}
                        ></Calendar>
                    </div>

                    <div className="field col-12 md:col-12">
                        <label htmlFor="note">Ghi chú</label>
                        <InputTextarea autoResize rows={3} cols={30}   {...register("note")} />
                    </div>
                </div>
                <div className="col-12 flex md:justify-content-end">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-text p-button-danger"
                        onClick={onCancel}
                    />
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        className="p-button-text"
                        onClick={handleSubmit(onSubmit)}
                        loading={createMutation.isLoading || editMutation.isLoading}
                    />
                </div>
            </form>
        </>
    );
};

export default CreateOrEditCompanyForm;
