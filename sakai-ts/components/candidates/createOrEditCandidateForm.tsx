import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import getConfig from "next/config";

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
        fullName: yup.string().required("Vui lòng nhập họ và tên"),
        phoneNumber: yup.string().required("Vui lòng nhập số điện thoại"),
        degree: yup.string().required("Vui lòng nhập bằng cấp"),
        gender: yup.string().required("Vui lòng chọn giới tính"),
        dateOfBirth: yup.string().required("Vui lòng nhập năm sinh"),
        // levelAssessment: yup.string().required("Vui lòng nhập đánh giá ngôn ngữ"),
        salary: yup.number().required("Vui lòng nhập lương mong muốn"),
        major: yup.string().required("Vui lòng nhập ngành"),
        school: yup.string().required("Vui lòng nhập trường"),
        experience: yup.string().required("Vui lòng nhập kinh nghiệm"),
        address: yup.string().required("Vui lòng nhập chỗ ở hiện tại"),
        wish: yup.string().required("Vui lòng nhập nguyện vọng"),
        languages: yup.array().min(1, "Vui lòng nhập ngôn ngữ"),
    });

    const { data: candidateDetail, isLoading } = useQuery(
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
            gender: "Nam",
        },
    });

    useEffect(() => {
        if (candidateDetail) {
            setValue('id', candidateDetail.data.id);
            setValue('fullName', candidateDetail.data.fullName);
            setValue('phoneNumber', candidateDetail.data.phoneNumber);
            setValue('email', candidateDetail.data.email);
            setValue('degree', candidateDetail.data.degree);
            setValue('gender', candidateDetail.data.gender);
            setValue('dateOfBirth', candidateDetail.data.dateOfBirth);
            setValue('faceBook', candidateDetail.data.faceBook);
            setValue('levelAssessment', candidateDetail.data.levelAssessment);
            setValue('major', candidateDetail.data.major);
            setValue('school', candidateDetail.data.school);
            setValue('experience', candidateDetail.data.experience);
            setValue('homeTown', candidateDetail.data.homeTown);
            setValue('address', candidateDetail.data.address);
            setValue('wish', candidateDetail.data.wish);
            setValue('languages', candidateDetail.data.languages ?? null);
            setValue('salary', candidateDetail.data.salary);
            setValue('cvName', candidateDetail.data.cvName);
            setValue('cvUrl', candidateDetail.data.cvUrl);
            setIsLoadingFile(true);
            setTimeout(() => {
                setIsLoadingFile(false);
            }, 50);
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

    const { publicRuntimeConfig } = getConfig();
    const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
    const onUpload = (event: any) => {
        if (event.target && event.target.files[0]) {
            setIsLoadingFile(true);
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
                    console.log("demo", response.data)
                    setValue("cvUrl", response.data);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => setIsLoadingFile(false));
        }
    }
    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 mb-6">
                        <div className="max-w-xl">
                            <div id="form-file-upload">
                                <input type="file" id="input-file-upload" multiple={false} onChange={onUpload} />
                                <label id="label-file-upload" htmlFor="input-file-upload">
                                    <div>
                                        <p>Drag and drop your file CV here</p>
                                    </div>
                                </label>
                                <div className="field col-12 text-base mt-2 font-medium	">
                                    <span>Tên file: {isLoadingFile == false && getValues('cvName')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="name">Họ và tên *</label>
                        <InputText
                            id="name"
                            required
                            {...register("fullName")}
                            className={`form-control ${errors.fullName ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.fullName?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="phoneNumber">Số điện thoại *</label>
                        <InputText
                            id="phoneNumber"
                            required
                            {...register("phoneNumber")}
                            className={`form-control ${errors.phoneNumber ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.phoneNumber?.message?.toString()}
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
                        <label htmlFor="degree">Bằng cấp *</label>
                        <InputText
                            id="degree"
                            {...register("degree")}
                            className={`form-control ${errors.degree ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.degree?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="gender">Giới tính *</label>
                        <Dropdown
                            id="gender"
                            options={genders}
                            value={getValues("gender")}
                            {...register("gender")}
                            optionLabel="label"
                            optionValue="value"
                            className={`form-control ${errors.gender ? "p-invalid" : ""
                                }`}
                            onChange={(e) =>
                                setValue("gender", e.target.value, {
                                    shouldValidate: true,
                                })
                            }
                        />
                        <small className="p-error">
                            {errors.gender?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="dateOfBirth">Năm sinh *</label>
                        <InputText
                            id="dateOfBirth"
                            {...register("dateOfBirth")}
                            className={`form-control ${errors.dateOfBirth ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.dateOfBirth?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="languages">Ngôn ngữ *</label>
                        <MultiSelect
                            inputId="multiselect"
                            value={getValues("languages")}
                            optionValue="value"
                            optionLabel="label"
                            className={`form-control ${errors.languages ? "p-invalid" : ""
                                }`}
                            options={languages?.data}
                            onChange={(e) =>
                                setValue("languages", e.target.value, {
                                    shouldValidate: true,
                                })
                            }
                        />
                        <small className="p-error">
                            {errors.languages?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="levelAssessment">Đánh giá ngôn ngữ </label>
                        <InputText
                            id="levelAssessment"
                            {...register("levelAssessment")}
                            className={`form-control ${errors.levelAssessment ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.levelAssessment?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="salary">Lương mong muốn *</label>
                        <InputNumber
                            value={getValues("salary")}
                            onValueChange={(e) => setValue('salary', e.value ?? 0)}
                            className={`form-control ${errors.salary ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.salary?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="major">Chuyên ngành *</label>
                        <InputText
                            id="major"
                            {...register("major")}
                            className={`form-control ${errors.major ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.major?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="school">Trường *</label>
                        <InputText
                            id="school"
                            {...register("school")}
                            className={`form-control ${errors.school ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.school?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="experience">Kinh nghiệm *</label>
                        <InputText
                            id="experience"
                            {...register("experience")}
                            className={`form-control ${errors.experience ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.experience?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="address">Chỗ ở hiện tại *</label>
                        <InputText
                            id="address"
                            {...register("address")}
                            className={`form-control ${errors.address ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.address?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="wish">Nguyện vọng *</label>
                        <InputText
                            id="wish"
                            {...register("wish")}
                            className={`form-control ${errors.wish ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.wish?.message?.toString()}
                        </small>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="facebook">Facebook </label>
                        <InputText
                            id="faceBook"
                            {...register("faceBook")}
                            className={`form-control`}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="homeTown">Quê quán </label>
                        <InputText
                            id="homeTown"
                            {...register("homeTown")}
                            className={`form-control ${errors.homeTown ? "p-invalid" : ""
                                }`}
                        />
                        <small className="p-error">
                            {errors.homeTown?.message?.toString()}
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
