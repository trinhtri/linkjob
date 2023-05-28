import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Menu } from 'primereact/menu';
import CreateRole from '../../components/roles/CreateRole';
import { CreateOrUpdateRoleDto } from '../api/role/dto/createOrUpdateRoleDto';
import { roleService } from '../api/role/roleService';
import { userService } from '../api/user/userService';
import { CreateOrUpdateUserDto } from '../api/user/dto/createOrUpdateUserDto';

const Roles = () => {
    const [visible, setVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filterSearch, setFilterSearch] = useState(null);
    const validationSchema = yup.object().shape({
        name: yup.string().required('Vui lòng nhập tên quyền')
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<CreateOrUpdateRoleDto>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema)
    });

    const { data, isLoading, refetch } = useQuery(
        ['FnGetAllRole', filterSearch, pageNumber, pageSize],
        () => {
            const param = {
                filterSearch: filterSearch,
                pageNumber: pageNumber,
                pageSize: pageSize
            };
            return roleService.getsPaging(param);
        },
        {
            enabled: true,
            keepPreviousData: true
        }
    );
    useEffect(() => {
        refetch();
    }, [filterSearch]);

    const deleteUserMutation = useMutation((userId) => userService.delete(userId));
    const confirmDelete = (data: any) => {
        confirmDialog({
            message: 'Are you sure you want to delete user?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                deleteUserMutation.mutate(data.userId, {
                    onSuccess(data, variables, context) {
                        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Delete user successfully', life: 3000 });
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
    const addUserMutation = useMutation((data) => roleService.create(data));
    const handleCreateOrUpdate = (data) => {
        addUserMutation.mutate(data, {
            onSuccess: () => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Thêm mới quyền thành công', life: 3000 });
                setVisible(false);
                refetch();
            },
            onError: (error: any) => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
                setVisible(false);
            }
        });
        reset();
    };
    const handleCancel = () => {
        reset();
        setVisible(false);
    };

    const onEdit = (data: CreateOrUpdateUserDto) => {
        setValue('id', data.userId, { shouldValidate: true });
        setValue('name', data.email, { shouldValidate: true });
        setVisible(true);
    };

    const menu = useRef(null);
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Hành động</span>
                <Button label="Hành động" icon="pi pi-cog " onClick={(e) => menu.current.toggle(e)} className="p-button-outlined p-button-sm" />
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
                    <h5 className="mt-0">Quản lý quyền</h5>
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
                        <Column field="name" header="Tên" sortable headerStyle={{ minWidth: '25rem' }}></Column>
                        <Column header="Hành động" body={actionBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                    </DataTable>

                    <CreateRole visible={visible} errors={errors} onCancel={() => handleCancel()} onSubmit={handleSubmit(handleCreateOrUpdate)} register={register} getValues={getValues} isLoading={addUserMutation.isLoading} />

                    <ConfirmDialog />
                </div>
            </div>
        </div>
    );
};
export default Roles;
