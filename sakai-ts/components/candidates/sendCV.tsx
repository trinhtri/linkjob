import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import { Toast } from 'primereact/toast';
import { candidateService } from '../../services/candidate/candidateService';
import { SendCVRequest } from '../../services/candidate/dto/sendCVRequest';
import { commonLookupService } from '../../services/commonLookup/commonLookupService';
import { CommonLookupRequest } from '../../services/commonLookup/dto/commonLookupRequest';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
interface Props {
    visible: boolean;
    currentId: string;
    onCloseModal: () => void;
}

const SendCV = ({ visible, currentId, onCloseModal }: Props) => {
    const toast = useRef<Toast>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        let selected = [...selectedItems];
        if (e.checked)
            selected.push(e.value);
        else
            selected.splice(selected.indexOf(e.value), 1);

        setSelectedItems(selected);

        setValue("ctyNhan", selected);
    }
    const { data: companies } = useQuery(
        ["Company"],
        () => {
            let param = {
                type: "Company"
            } as CommonLookupRequest;
            return commonLookupService.getLookup(param);
        },
        {
            enabled: !!visible
        }
    );

    const { data: companiesSelected } = useQuery(
        ["CompaniesByCandidateId", visible],
        () => {
            return candidateService.getCompaniesByCandidateId(currentId);
        },
        {
            enabled: !!currentId && visible
        }
    );

    useEffect(() => {
        if (companiesSelected?.data) {
            setSelectedItems(companiesSelected.data)
        } else {
            setSelectedItems([]);
        }
    }, [companiesSelected]);

    const validationSchema = yup.object().shape({
        ctyNhan: yup.array().min(1, "Vui lòng chọn cty"),
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<SendCVRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (currentId)
            setValue("id", currentId);
    }, [currentId, setValue, visible]);

    const sendCVMutation = useMutation((data: SendCVRequest) => candidateService.sendCV(data));
    const onSubmit = (data: SendCVRequest) => {

        const request = {
            ...data
        };

        sendCVMutation.mutate(request, {
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
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit(onSubmit)} loading={sendCVMutation.isLoading} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} style={{ width: '650px' }} header={'Gửi CV'} modal className="p-fluid" footer={productDialogFooter} onHide={onCloseModal}>
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl ">
                    <div className="field">
                        <label htmlFor="password">Vui lòng chọn công ty</label>
                        <div className="col-12 md:col-4">
                            {companies?.data.map((item) => (
                                <div key={item.label} className="col-12" >
                                    <Checkbox inputId={item.label} {...register("ctyNhan")} value={item.value} onChange={handleCheckboxChange} checked={selectedItems.includes(item.value)} />
                                    <label htmlFor={item.label} className='ml-3'>{item.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default SendCV;
