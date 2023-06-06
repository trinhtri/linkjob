import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { Toast } from "primereact/toast";
import { CreateOrEditCandidateRequest } from "../../services/candidate/dto/createOrEditCandidateRequest";
import { useRouter } from "next/router";
import { candidateService } from "../../services/candidate/candidateService";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { CommonLookupRequest } from "../../services/commonLookup/dto/commonLookupRequest";
import { commonLookupService } from "../../services/commonLookup/commonLookupService";
import { InputNumber } from "primereact/inputnumber";

interface Props {
    candidateId?: string,
}

const CreateOrEditCandidateForm = ({ candidateId }: Props) => {
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .required("Vui lòng nhập email")
            .email("Email is invalid"),
        hoTen: yup.string().required("Vui lòng nhập họ và tên"),
        sdt: yup.string().required("Vui lòng nhập số điện thoại"),
        bangCap: yup.string().required("Vui lòng nhập bằng cấp"),
        gioiTinh: yup.string().required("Vui lòng chọn giới tính"),
        namSinh: yup.string().required("Vui lòng nhập năm sinh"),
        danhGiaNgonNgu: yup.string().required("Vui lòng nhập đánh giá ngôn ngữ"),
        luongMongMuon: yup.number().required("Vui lòng nhập lương mong muốn"),
        nganh: yup.string().required("Vui lòng nhập ngành"),
        truong: yup.string().required("Vui lòng nhập trường"),
        kinhNghiem: yup.string().required("Vui lòng nhập kinh nghiệm"),
        choOHienTai: yup.string().required("Vui lòng nhập chỗ ở hiện tại"),
        nguyenVong: yup.string().required("Vui lòng nhập nguyện vọng"),
        ngonNgu: yup.array().min(1, "Vui lòng nhập ngôn ngữ"),
    });

    const { data: candidateDetail } = useQuery(
        ["GetCandidateById", candidateId],
        () => {
            return candidateService.getById(candidateId);
        },
        {
            enabled: !!candidateId
        }
    );

    const { data: languages } = useQuery(
        ["Languages"],
        () => {
            let param = {
                type: "Language"
            } as CommonLookupRequest;
            return commonLookupService.getLookup(param);
        },
    );


    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<CreateOrEditCandidateRequest>({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            gioiTinh: "Nam",
        },
    });

    useEffect(() => {
        if (candidateDetail) {
            setValue('id', candidateDetail.data.id);
            setValue('hoTen', candidateDetail.data.hoTen);
            setValue('sdt', candidateDetail.data.sdt);
            setValue('email', candidateDetail.data.email);
            setValue('bangCap', candidateDetail.data.bangCap);
            setValue('gioiTinh', candidateDetail.data.gioiTinh);
            setValue('namSinh', candidateDetail.data.namSinh);
            setValue('facebook', candidateDetail.data.facebook);
            setValue('danhGiaNgonNgu', candidateDetail.data.danhGiaNgonNgu);
            setValue('luongMongMuon', candidateDetail.data.luongMongMuon);
            setValue('nganh', candidateDetail.data.nganh);
            setValue('truong', candidateDetail.data.truong);
            setValue('kinhNghiem', candidateDetail.data.kinhNghiem);
            setValue('queQuan', candidateDetail.data.queQuan);
            setValue('choOHienTai', candidateDetail.data.choOHienTai);
            setValue('nguyenVong', candidateDetail.data.nguyenVong);
            setValue('ngonNgu', candidateDetail.data.ngonNgu ?? null);
        }
    }, [candidateDetail, setValue]);

    const createCandidateMutation = useMutation((input) =>
        candidateService.create(input)
    );

    const editCandidateMutation = useMutation((input) =>
        candidateService.update(input)
    );

    const onSubmit = (data: any) => {
        if (!!candidateDetail?.data.id) {
            editCandidateMutation.mutate(data, {
                onSuccess: () => {
                    toast.current?.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Chỉnh sửa ứng viên thành công",
                        life: 3000,
                    });
                    reset();
                    router.push("/candidates");
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
            createCandidateMutation.mutate(data, {
                onSuccess: () => {
                    toast.current?.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Thêm mới ứng viên thành công",
                        life: 3000,
                    });
                    reset();
                    router.push("/candidates");
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
        router.push("/candidates");
    };

    const genders = [
        { label: "Nam", value: "Nam" },
        { label: "Nữ", value: "Nữ" },
        { label: "Khác", value: "Khác" },
    ];

    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="name">Họ và tên *</label>
                        <InputText
                            id="name"
                            required
                            autoFocus
                            {...register("hoTen")}
                            className={`form-control ${errors.hoTen ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.hoTen?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="sdt">Số điện thoại *</label>
                        <InputText
                            id="sdt"
                            required
                            {...register("sdt")}
                            className={`form-control ${errors.sdt ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.sdt?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="email">Email *</label>
                        <InputText
                            id="email"
                            {...register("email")}
                            className={`form-control ${errors.email ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.email?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="bangCap">Bằng cấp *</label>
                        <InputText
                            id="bangCap"
                            {...register("bangCap")}
                            className={`form-control ${errors.bangCap ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.bangCap?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="gioiTinh">Giới tính *</label>
                        <Dropdown
                            id="gioiTinh"
                            options={genders}
                            value={getValues("gioiTinh")}
                            {...register("gioiTinh")}
                            optionLabel="label"
                            optionValue="value"
                            className={`form-control ${errors.gioiTinh ? "p-invalid" : ""
                                }`}
                            onChange={(e) =>
                                setValue("gioiTinh", e.target.value, {
                                    shouldValidate: true,
                                })
                            }
                        />
                        <small className="p-error">
                            {errors.gioiTinh?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="namSinh">Năm sinh *</label>
                        <InputText
                            id="namSinh"
                            {...register("namSinh")}
                            className={`form-control ${errors.namSinh ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.namSinh?.message?.toString()}
                        </small>
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="danhGiaNgonNgu">Đánh giá ngôn ngữ *</label>
                        <InputText
                            id="danhGiaNgonNgu"
                            {...register("danhGiaNgonNgu")}
                            className={`form-control ${errors.danhGiaNgonNgu ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.danhGiaNgonNgu?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="luongMongMuon">Lương mong muốn *</label>
                        <InputText
                            id="luongMongMuon"
                            {...register("luongMongMuon")}
                            className={`form-control ${errors.luongMongMuon ? "p-invalid" : ""
                                }`}
                        />
                        {/* <InputNumber id="luongMongMuon"
                            value={getValues("luongMongMuon")}
                            onValueChange={(e) => onInputNumberChange(e, 'price')}
                            mode="currency"
                            currency="USD"
                            locale="en-US" /> */}

                        {/* <InputNumber id="inputnumber"
                            value={getValues("luongMongMuon") ?? null}
                            className={`form-control ${errors.luongMongMuon ? "p-invalid" : ""
                                }`}
                            onValueChange={(e: any) => setValue("luongMongMuon", e.target.value)}></InputNumber> */}
                        <small className="p-error">
                            {errors.luongMongMuon?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="nganh">Chuyên nghành *</label>
                        <InputText
                            id="nganh"
                            {...register("nganh")}
                            className={`form-control ${errors.nganh ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.nganh?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="truong">Trường *</label>
                        <InputText
                            id="truong"
                            {...register("truong")}
                            className={`form-control ${errors.truong ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.truong?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="kinhNghiem">Kinh nghiệm *</label>
                        <InputText
                            id="kinhNghiem"
                            {...register("kinhNghiem")}
                            className={`form-control ${errors.kinhNghiem ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.kinhNghiem?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="choOHienTai">Chỗ ở hiện tại *</label>
                        <InputText
                            id="choOHienTai"
                            {...register("choOHienTai")}
                            className={`form-control ${errors.choOHienTai ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.choOHienTai?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="nguyenVong">Nguyện vọng *</label>
                        <InputText
                            id="nguyenVong"
                            {...register("nguyenVong")}
                            className={`form-control ${errors.nguyenVong ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.nguyenVong?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="ngonNgu">Ngôn ngữ *</label>
                        <MultiSelect
                            inputId="multiselect"
                            value={getValues("ngonNgu")}
                            optionValue="value"
                            optionLabel="label"
                            className={`form-control ${errors.ngonNgu ? "p-invalid" : ""
                                }`}
                            options={languages?.data}
                            onChange={(e) =>
                                setValue("ngonNgu", e.target.value, {
                                    shouldValidate: true,
                                })
                            }
                        />
                        <small className="p-error">
                            {errors.ngonNgu?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="facebook">Facebook </label>
                        <InputText
                            id="facebook"
                            {...register("facebook")}
                            className={`form-control`}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="queQuan">Quê quán </label>
                        <InputText
                            id="queQuan"
                            {...register("queQuan")}
                            className={`form-control ${errors.queQuan ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.queQuan?.message?.toString()}
                        </small>
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
                        loading={createCandidateMutation.isLoading || editCandidateMutation.isLoading}
                    />
                </div>
            </form>
        </>
    );
};

export default CreateOrEditCandidateForm;
