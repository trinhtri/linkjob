import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Menu } from 'primereact/menu';
import { languageService } from '../../services/language/languageService';
import { CreateOrUpdateLanguageRequest } from '../../services/language/dto/createOrUpdateLanguageRequest';
import CreateLanguage from '../../components/languages/CreateLanguage';
import { CreateOrUpdateCompanyRequest } from '../../services/company/dto/createOrUpdateCompanyRequest';
import { companyService } from '../../services/company/companyService';
import CreateCompany from '../../components/companies/CreateCompany';

const Companies = () => {
    const [visible, setVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filterSearch, setFilterSearch] = useState(null);
    const validationSchema = yup.object().shape({
        name: yup.string().required('Vui lòng nhập tên ngôn ngữ')
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<CreateOrUpdateCompanyRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema)
    });

    const { data, isLoading, refetch } = useQuery(
        ['GetCompanies', filterSearch, pageNumber, pageSize],
        () => {
            const param = {
                filterSearch: filterSearch,
                pageNumber: pageNumber,
                pageSize: pageSize
            };
            return companyService.getsPaging(param);
        },
        {
            enabled: true,
            keepPreviousData: true
        }
    );

    const deleteCompanyMutation = useMutation((id: string) => companyService.delete(id));
    const confirmDelete = (data: any) => {
        confirmDialog({
            message: 'Bạn có muốn xóa công ty này không?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                deleteCompanyMutation.mutate(data.id, {
                    onSuccess(data, variables, context) {
                        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Xóa công ty thành công', life: 3000 });
                        refetch();
                    }
                });
            },
            acceptClassName: 'p-button-danger'
        });
    };

    const onCreate = () => {
        setVisible(true);
    };
    const addCompanyMutation = useMutation((data: CreateOrUpdateCompanyRequest) => companyService.create(data));
    const updateCompanyMutation = useMutation((data: CreateOrUpdateCompanyRequest) => companyService.update(data));
    const handleCreateOrUpdate = (data: any) => {
        if (!!data.id) {
            updateCompanyMutation.mutate(data, {
                onSuccess: () => {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Chỉnh sửa công ty thành công', life: 3000 });
                    setVisible(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
                    setVisible(false);
                }
            });
        } else {
            addCompanyMutation.mutate(data, {
                onSuccess: () => {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Thêm mới công ty thành công', life: 3000 });
                    setVisible(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
                    setVisible(false);
                }
            });
        }

        reset();
    };
    const handleCancel = () => {
        reset();
        setVisible(false);
    };

    const onEdit = (data: CreateOrUpdateCompanyRequest) => {
        setValue('id', data.id, { shouldValidate: true });
        setValue('name', data.name, { shouldValidate: true });
        setValue('address', data.address, { shouldValidate: true });
        setVisible(true);
    };

    const menu = useRef<Menu>(null);
    const actionBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Hành động</span>
                <Button label="Hành động" icon="pi pi-cog " onClick={(e) => menu.current?.toggle(e)} className="p-button-outlined p-button-sm" />
                <Menu
                    ref={menu}
                    popup
                    model={[
                        {
                            label: 'Chỉnh sửa',
                            command: () => onEdit(rowData)
                        },
                        {
                            label: 'Xóa',
                            command: () => confirmDelete(rowData)
                        }
                    ]}
                />
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h5 className="mt-0">Quản lý công ty</h5>
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-3 mb-3">
                        <div className="col-4">
                            <span className="block mt-2 md:mt-0 p-input-icon-right">
                                <InputText type="search" onInput={(e: any) => setFilterSearch(e.target.value)} placeholder="Search..." className="w-full" />
                                <i className="pi pi-search" />
                            </span>
                        </div>

                        <div>
                            <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success mr-2 p-button-sm" onClick={onCreate} />
                        </div>
                    </div>

                    <DataTable
                        ref={dt}
                        value={data?.data?.items}
                        dataKey="id"
                        paginator
                        rows={10}
                        loading={isLoading}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        emptyMessage="No users found."
                        responsiveLayout="scroll"
                    >
                        <Column field="name" header="Tên công ty" headerStyle={{ minWidth: '25rem' }}></Column>
                        <Column field="address" header="Địa chỉ" headerStyle={{ minWidth: '35rem' }}></Column>
                        <Column header="Hành động" body={actionBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                    </DataTable>

                    <CreateCompany
                        visible={visible}
                        errors={errors}
                        onCancel={() => handleCancel()}
                        onSubmit={handleSubmit(handleCreateOrUpdate)}
                        register={register}
                        getValues={getValues}
                        isLoading={addCompanyMutation.isLoading} />

                    <ConfirmDialog />
                </div>
            </div>
        </div>
    );
};
export default Companies;
