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
import ChangePassword from '../../components/users/ChangePassword';
import { Menu } from 'primereact/menu';
import CreateUser from '../../components/users/CreateUser';
import { Paginator } from 'primereact/paginator';
import { CreateOrUpdateUserDto } from '../api/user/dto/createOrUpdateUserDto';
import { ChangePasswordDto } from '../api/user/dto/changePasswordDto';
import { userService } from '../api/user/userService';

const Users = () => {
    const [visible, setVisible] = useState(false);
    const [visibleChangePassword, setVisibleChangePassword] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<any>(null);
    const [filterSearch, setFilterSearch] = useState(null);
    const menu = useRef<Menu>(null);
    const [currentId, setCurrentId] = useState<string>("");

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: "",
        sortOrder: null,
        filterSearch: null
    });

    // const { data, isLoading, refetch } = useQuery(
    //     ['Users', filterSearch, pageNumber, pageSize, sorting],
    //     () => {
    //         const param = {
    //             filterSearch: filterSearch,
    //             pageNumber: pageNumber,
    //             pageSize: pageSize,
    //             sorting: sorting
    //         };
    //         return userService.getsPaging(param);
    //     },
    //     {
    //         enabled: true,
    //         keepPreviousData: true
    //     }
    // );
    const { data, isLoading, refetch } = useQuery(
        ['Users', lazyState],
        () => {
            const param = {
                filterSearch: filterSearch,
                pageNumber: pageNumber,
                pageSize: pageSize,
                sorting: sorting
            };
            return userService.getsPaging(param);
        },
        {
            enabled: true,
            keepPreviousData: true
        }
    );

    const onSort = (event: any) => {
        setlazyState(event);
    };

    const onPageChange = (event: any) => {
        setlazyState(event);
        // setPageSize(e.rows);
        // setPageNumber(e.page + 1);
    }

    const validationSchema = yup.object().shape({
        email: yup.string().required('Email is required').email('Email is invalid'),
        userName: yup.string().required('User name is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')
    });

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors }
    } = useForm<CreateOrUpdateUserDto>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema)
    });

    const validationSchemaChangePassword = yup.object().shape({
        currentPassword: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')
    });
    const {
        register: registerChangePassword,
        handleSubmit: handleSubmitChangePassword,
        reset: resetChangePassword,
        formState: { errors: errorsChangePassword }
    } = useForm<ChangePasswordDto>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchemaChangePassword)
    });



    const deleteUserMutation = useMutation((userId) => userService.delete(userId));
    const confirmDelete = (data: any) => {
        confirmDialog({
            message: 'Are you sure you want to delete user?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                deleteUserMutation.mutate(data.userId, {
                    onSuccess() {
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
    const addUserMutation = useMutation((newUser) => userService.create(newUser));
    const handleCreateOrUpdate = (data: any) => {
        addUserMutation.mutate(data, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Create user successfully', life: 3000 });
                setVisible(false);
                reset();
                refetch();
            },
            onError: (error: any) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.errors, life: 3000 });
            }
        });
    };
    const handleCancel = () => {
        reset();
        setVisible(false);
    };

    const onChangePassword = (data: CreateOrUpdateUserDto) => {
        setCurrentId(data.userId);
        setVisibleChangePassword(true);
    };
    const changePasswordMutation = useMutation((data) => userService.changePassword(data));
    const handleChangePassword = (data: any) => {
        const request = {
            userId: currentId,
            ...data
        };
        changePasswordMutation.mutate(request, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Create user successfully', life: 3000 });
                setVisibleChangePassword(false);
            },
            onError: () => {
                setVisibleChangePassword(false);
            }
        });
    };
    const handleCancelChangePassword = () => {
        resetChangePassword();
        setVisibleChangePassword(false);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <>
                <Button label="Actions" icon="pi pi-cog " onClick={(e) => menu.current?.toggle(e)} className="p-button-outlined p-button-sm" />
                <Menu
                    ref={menu}
                    popup
                    model={[
                        {
                            label: 'Change password',
                            command: () => onChangePassword(rowData)
                        },
                        {
                            label: 'Delete',
                            command: () => confirmDelete(rowData)
                        }
                    ]}
                />
            </>
        );
    };

    ;

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h5 className="mt-0">Quản lý người dùng</h5>
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-3 mb-3">
                        <div className="col-4">
                            <span className="block mt-2 md:mt-0 p-input-icon-right">
                                <InputText type="search" onInput={(e: any) => setFilterSearch(e.target.value)} placeholder="Search..." className="w-full" />
                                <i className="pi pi-search" />
                            </span>
                        </div>

                        <div>
                            <Button label="Export" icon="pi pi-upload" className="p-button-help mr-2 p-button-sm" onClick={exportCSV} />
                            <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success mr-2 p-button-sm" onClick={onCreate} />
                        </div>
                    </div>

                    <DataTable
                        ref={dt}
                        value={data?.data?.items}
                        dataKey="userId"
                        loading={isLoading}
                        className="datatable-responsive"
                        emptyMessage="No users found."
                        onSort={onSort}
                        sortField={lazyState.sortField}
                        sortOrder={lazyState.sortOrder}
                        removableSort >
                        <Column field="userName" header="UserName" headerStyle={{ minWidth: '15rem' }} sortable></Column>
                        <Column field="email" header="Email" headerStyle={{ minWidth: '27rem' }} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                    </DataTable>

                    <Paginator first={pageNumber} rows={pageSize} totalRecords={data?.data?.totalCount} rowsPerPageOptions={[10, 20, 50, 100]} onPageChange={onPageChange} leftContent></Paginator>

                    <CreateUser visible={visible} errors={errors} onCancel={() => handleCancel()} onSubmit={handleSubmit(handleCreateOrUpdate)} register={register} getValues={getValues} isLoading={addUserMutation.isLoading} />

                    <ChangePassword
                        visible={visibleChangePassword}
                        errors={errors}
                        onCancel={() => handleCancelChangePassword()}
                        onSubmit={handleSubmitChangePassword(handleChangePassword)}
                        register={registerChangePassword}
                        isLoading={addUserMutation.isLoading}
                    />

                    <ConfirmDialog />
                </div>
            </div>
        </div>
    );
};
export default Users;
