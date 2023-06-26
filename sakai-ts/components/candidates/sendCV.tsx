import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { Toast } from "primereact/toast";
import { candidateService } from "../../services/candidate/candidateService";
import { SendCVRequest } from "../../services/candidate/dto/sendCVRequest";
import { commonLookupService } from "../../services/commonLookup/commonLookupService";
import { CommonLookupRequest } from "../../services/commonLookup/dto/commonLookupRequest";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
interface Props {
    visible: boolean;
    currentId: string;
    onCloseModal: () => void;
}

const SendCV = ({ visible, currentId, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);

    const { data: companies } = useQuery(
        ["CompanyUnSendCV"],
        () => {
            let param = {
                type: "CompanyUnSendCV",
                parentId: currentId,
            } as CommonLookupRequest;
            return commonLookupService.getLookup(param);
        },
        {
            enabled: !!visible && !!currentId,
        }
    );

    const validationSchema = yup.object().shape({
        companyId: yup.string().required("Vui lòng chọn cty"),
        position: yup.string().required("Vui lòng chọn vị trí ứng tuyển"),
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<SendCVRequest>({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (currentId) setValue("candidateId", currentId);
    }, [currentId, setValue, visible]);

    const sendCVMutation = useMutation((data: SendCVRequest) =>
        candidateService.sendCV(data)
    );
    const onSubmit = (data: SendCVRequest) => {
        console.log("data", data);
        const request = {
            ...data,
        };

        sendCVMutation.mutate(request, {
            onSuccess: () => {
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Gửi CV thành công",
                    life: 3000,
                });
                reset();
                onCloseModal();
            },
            onError: (error: any) => {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Gửi CV thất bại",
                    life: 3000,
                });
            },
        });
    };

    const productDialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text p-button-danger"
                onClick={onCloseModal}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={handleSubmit(onSubmit)}
                loading={sendCVMutation.isLoading}
            />
        </>
    );
    
    const [companySelected, setCompanySelected] = useState<string>();
    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                style={{ width: "750px" }}
                header={"Gửi CV"}
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={onCloseModal}
            >
                <div className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="company">Công ty phỏng vấn *</label>
                        <Dropdown
                            id="company"
                            options={companies?.data}
                            optionLabel="label"
                            optionValue="value"
                            value={companySelected}
                            onChange={(e) => {
                                setCompanySelected(e.target.value)
                                setValue("companyId", e.target.value)
                            }
                            }
                            filter
                            filterBy="label"
                            className={`form-control ${errors.companyId ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.companyId?.message?.toString()}
                        </small>
                    </div>
                    <div className="field ">
                        <label htmlFor="position">Vị trí ứng tuyển *</label>
                        <InputTextarea
                            id="position"
                            {...register("position")}
                            rows={3}
                            cols={20}
                            className={`form-control ${errors.position ? "p-invalid" : ""}`}
                        />
                        <small className="p-error">
                            {errors.position?.message?.toString()}
                        </small>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default SendCV;
