import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { companyCandidateService } from "../../services/companyCandidate/companyCandidateService";
import { UpdateCompanyCandidateRequest } from "../../services/companyCandidate/dto/updateCompanyCandidateRequest";
import { CompanyCandidateByIdResponse } from "../../services/companyCandidate/dto/companyCandidateByCompanyAndCandidateResponse";
import { CompanyCandidateByCompanyAndCandidateRequest } from "../../services/companyCandidate/dto/companyCandidateByCompanyAndCandidateRequest";
interface Props {
  visible: boolean;
  companyId: string;
  candidateId: string;
  onCloseModal: () => void;
}

const EditCompanyCandidate = ({
  visible,
  companyId,
  candidateId,
  onCloseModal,
}: Props) => {
  const toast = useRef<Toast>(null);
  const validationSchema = yup.object().shape({
    companyId: yup.string().required("Vui lòng chọn cty"),
    position: yup.string().required("Vui lòng chọn vị trí ứng tuyển"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateCompanyCandidateRequest>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  useQuery(
    ["GetCompanyCandidateById"],
    () => {
      let param = {
        candidateId: candidateId,
        companyId: companyId,
      } as CompanyCandidateByCompanyAndCandidateRequest;
      return companyCandidateService.getByCompanyAndCandidate(param);
    },
    {
      enabled: !!visible && !!companyId && !!candidateId,
      onSuccess: (data) => {
        setValue("position", data.data.position);
      },
    }
  );

  useEffect(() => {
    if (candidateId) setValue("candidateId", candidateId);
    if (companyId) setValue("companyId", companyId);
  }, [candidateId, companyId, setValue, visible]);

  const editCompanyCandidateMutation = useMutation(
    (data: UpdateCompanyCandidateRequest) =>
      companyCandidateService.update(data)
  );
  const onSubmit = (data: UpdateCompanyCandidateRequest) => {
    console.log("data", data);
    const request = {
      ...data,
    };

    editCompanyCandidateMutation.mutate(request, {
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
        loading={editCompanyCandidateMutation.isLoading}
      />
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        style={{ width: "750px" }}
        header={"Chỉnh sửa vị trí ứng tuyển "}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={onCloseModal}
      >
        <div className="rounded-xl ">
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

export default EditCompanyCandidate;
