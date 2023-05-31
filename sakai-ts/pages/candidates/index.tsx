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
import { rowsPerPageOptions } from '../../public/constant';

import debounce from 'lodash.debounce';
import { userService } from '../../services/user/userService';
import ChangePassword from '../../components/users/ChangePassword';
import { candidateService } from '../../services/candidate/candidateService';
import { useRouter } from 'next/router';

const Candidates = () => {
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
        sortField: "UserName",
        sortOrder: null,
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
            if (!!lazyState.sortField) {
                sorting = `${lazyState.sortField} ${lazyState.sortOrder === -1 ? "DESC" : "ASC"}`;
            }
            const param = {
                filterSearch: lazyState.filterSearch,
                pageNumber: lazyState.pageNumber,
                pageSize: lazyState.pageSize,
                sorting: sorting
            };
            return candidateService.getsPaging(param);
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

    const router = useRouter();
    const onCreate = () => {
        router.push("/candidates/create");
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
                <Button label="Hành động" icon="pi pi-cog " onClick={(e) => menu.current?.toggle(e)} className="p-button-outlined p-button-sm" />
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
                    <h5 className="mt-0">Quản lý ứng viên</h5>
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
                        dataKey="id"
                        loading={isLoading}
                        className="datatable-responsive"
                        emptyMessage="No users found."
                        onSort={onSort}
                        sortOrder={lazyState.sortOrder}
                        sortField={lazyState.sortField}
                    >
                        <Column field="hoTen" header="Họ tên" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="sdt" header="Số điện thoại" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="email" header="Email" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="gioiTinh" header="Giới tính" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="truong" header="Trường" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="nganh" header="Chuyên nghành" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="ngonNgu" header="Ngoại ngữ" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="kinhNghiem" header="Kinh nghiệm" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="nguyenVong" header="Nguyện vọng" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column field="luongMongMuon" header="Lương" headerStyle={{ minWidth: '5rem' }} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '1rem' }}></Column>
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
export default Candidates;
