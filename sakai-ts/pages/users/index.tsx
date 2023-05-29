import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Menu } from 'primereact/menu';
import CreateUser from '../../components/users/CreateUser';
import { Paginator } from 'primereact/paginator';
import { rowsPerPageOptions } from '../utilities/constant';

import debounce from 'lodash.debounce';
import { userService } from '../../services/user/userService';
import ChangePassword from '../../components/users/ChangePassword';

const Users = () => {
    const [visibleCreateUser, setVisibleCreateUser] = useState<boolean>(false);
    const [visibleChangePassword, setVisibleChangePassword] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<any>(null);
    const menu = useRef<Menu>(null);
    const [currentId, setCurrentId] = useState<string>("");

    const [lazyState, setlazyState] = useState({
        first: 0,
        pageNumber: 1,
        pageSize: 10,
        sortField: "userName",
        sortOrder: 1,
        filterSearch: null
    });

    const handleSearch = (event: any) => {
        setlazyState({
            ...lazyState,
            filterSearch: event.target.value
        })
    }
    const debouncedSearch = debounce(handleSearch, 600);

    const { data, isLoading, refetch } = useQuery(
        ['Users', lazyState],
        () => {
            let sorting = "";
            if (!!lazyState.sortField && !!lazyState.sortOrder) {
                sorting = `${lazyState.sortField} ${lazyState.sortOrder === 1 ? "ASC" : "DESC"}`;
            }
            const param = {
                filterSearch: lazyState.filterSearch,
                pageNumber: lazyState.pageNumber,
                pageSize: lazyState.pageSize,
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
        setlazyState({
            ...lazyState,
            sortOrder: event.sortOrder,
            sortField: event.sortField,
        })
    };

    const onPageChange = (event: any) => {
        setlazyState({
            ...lazyState,
            pageNumber: event.page + 1,
            pageSize: event.rows
        })
    }

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
        setVisibleCreateUser(true);
    };

    const handleCreatedUser = () => {
        setVisibleCreateUser(false);
        refetch();
    }

    const handleCloseModalCreateUser = () => {
        setVisibleCreateUser(false);
    };

    const onChangePassword = (data: any) => {
        setCurrentId(data.userId);
        setVisibleChangePassword(true);
    };

    const handleCancelChangePassword = () => {
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h5 className="mt-0">Quản lý người dùng</h5>
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-3 mb-3">
                        <div className="col-4">
                            <span className="block mt-2 md:mt-0 p-input-icon-right">
                                <InputText type="search" onChange={debouncedSearch} placeholder="Search..." className="w-full" />
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
                        sortOrder={lazyState.sortOrder}
                        sortField={lazyState.sortField}
                    >
                        <Column field="userName" header="UserName" headerStyle={{ minWidth: '15rem' }} sortable></Column>
                        <Column field="email" header="Email" headerStyle={{ minWidth: '27rem' }} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                    </DataTable>

                    <Paginator first={lazyState.pageNumber} rows={lazyState.pageSize} totalRecords={data?.data?.totalCount} rowsPerPageOptions={rowsPerPageOptions} onPageChange={onPageChange} leftContent></Paginator>

                    <CreateUser visible={visibleCreateUser} onCancel={() => handleCloseModalCreateUser()} onCreatedUser={handleCreatedUser} />

                    <ChangePassword
                        visible={visibleChangePassword}
                        currentId={currentId}
                        onCloseModal={() => handleCancelChangePassword()}
                    />

                    <ConfirmDialog />
                </div>
            </div>
        </div>
    );
};
export default Users;
