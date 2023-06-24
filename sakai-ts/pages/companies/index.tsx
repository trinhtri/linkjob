import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Menu } from 'primereact/menu';
import { CreateOrUpdateCompanyRequest } from '../../services/company/dto/createOrUpdateCompanyRequest';
import { companyService } from '../../services/company/companyService';
import { useRouter } from 'next/router';
import moment from 'moment';
import { CompanyResponse } from '../../services/company/dto/companyResponse';
import debounce from 'lodash.debounce';
import { Paginator } from 'primereact/paginator';
import { SearchCompanyRequest } from '../../services/company/dto/searchCompanyRequest';
import { rowsPerPageOptions } from '../../public/constant';
import UpdateNextCallCompanyModal from '../../components/companies/updateNextCallCompanyModal';
import UpdateLastCallCompanyModal from '../../components/companies/updateLastCallCompanyModal';
import { Tooltip } from 'primereact/tooltip';

const Companies = () => {
    const toast = useRef<Toast>(null);
    const [currentId, setCurrentId] = useState<string>('');
    const [visibleNextCall, setVisibleNextCall] = useState<boolean>(false);
    const [visibleLastCall, setVisibleLastCall] = useState<boolean>(false);
    const dt = useRef(null);
    const router = useRouter();

    const [lazyState, setlazyState] = useState<SearchCompanyRequest>({
        pageNumber: 1,
        pageSize: 10,
        filterSearch: null,
    });

    const { data, isLoading, refetch } = useQuery(
        ['GetCompaniesWithPaginator', lazyState],
        () => {
            const param = {
                filterSearch: lazyState.filterSearch,
                pageNumber: lazyState.pageNumber,
                pageSize: lazyState.pageSize,
            };
            return companyService.getsPaging(param);
        },
        {
            enabled: true,
            keepPreviousData: true
        }
    );

    const onPageChange = (event: any) => {
        setlazyState({
            ...lazyState,
            pageNumber: event.page + 1,
            pageSize: event.rows
        })
    }
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
        router.push(`/companies/create`);
    };

    const onEdit = (data: CreateOrUpdateCompanyRequest) => {
        router.push(`/companies/${data.id}`);
    };
    const onUpdateNextCall = (data: CreateOrUpdateCompanyRequest) => {
        setCurrentId(data.id);
        setVisibleNextCall(true);
    };
    const onUpdateLastCall = (data: CreateOrUpdateCompanyRequest) => {
        setCurrentId(data.id);
        setVisibleLastCall(true);
    };

    const onCloseHandleNextCall = () => {
        setVisibleNextCall(false);
        refetch();
    }
    const onCloseHandleLastCall = () => {
        setVisibleLastCall(false);
        refetch();
    }
    const handleSearch = (event: any) => {
        setlazyState({
            ...lazyState,
            filterSearch: event.target.value
        });
    }
    const debouncedSearch = debounce(handleSearch, 600);

    const actionBodyTemplate = (rowData: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const menu = useRef<Menu>(null);
        return (
            <>
                <Button icon="pi pi-ellipsis-h" rounded severity="secondary" onClick={(e) => menu.current?.toggle(e)} className="p-button-outlined p-button-sm" />
                {/* <span className="p-column-title">Hành động</span> */}
                {/* <Button label="Hành động" icon="pi pi-cog " onClick={(e) => menu.current?.toggle(e)} className="p-button-outlined p-button-sm" /> */}
                <Menu
                    ref={menu}
                    popup
                    model={[
                        {
                            label: 'Chỉnh sửa',
                            command: () => onEdit(rowData)
                        },
                        {
                            label: 'Cuộc gọi cuối',
                            command: () => onUpdateLastCall(rowData)
                        },
                        {
                            label: 'Cuộc gọi tiếp theo',
                            command: () => onUpdateNextCall(rowData)
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

    const lastCallBodyTemplate = (rowData: CompanyResponse) => {
        if (rowData.lastCall)
            return moment(rowData.lastCall).format('DD/MM/YYYY');
    };
    const nextCallBodyTemplate = (rowData: CompanyResponse) => {
        if (rowData.nextCall)
            return moment(rowData.nextCall).format('DD/MM/YYYY');
    };
    const companyNameBodyTemplate = (rowData: CompanyResponse) => {
        return <>
            <span>{rowData.name}</span>
            {/* {
                rowData.note && (
                    <>
                        <i className="pi pi-info-circle cursor-pointer knob ml-2" id={`${rowData.id}-tooltip`}></i>
                        <Tooltip target={`.${rowData.id}-tooltip`} content={`${rowData.note}`} className="max-w-30rem" />
                    </>
                )
            } */}
        </>;
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
                                <InputText type="search" onChange={debouncedSearch} placeholder="Search..." className="w-full" />
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
                        rows={10}
                        loading={isLoading}
                        className="datatable-responsive"
                        emptyMessage="No companies found."
                    >
                        <Column field='name' body={companyNameBodyTemplate} header="Tên công ty" headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="connecter" header="Nhân sự" headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="fieldOfActivity" header="Lĩnh vực hoạt động" headerStyle={{ minWidth: '5rem' }}></Column>
                        {/* <Column field="email" header="Email" headerStyle={{ minWidth: '5rem' }}></Column> */}
                        <Column field="landline" header="Điện thoại bàn" headerStyle={{ minWidth: '5rem' }}></Column>
                        {/* <Column field="phoneNumber" header="Điện thoại cá nhân" headerStyle={{ minWidth: '5rem' }}></Column> */}
                        <Column body={lastCallBodyTemplate} header="Cuộc gọi cuối" headerStyle={{ minWidth: '5rem' }} ></Column>
                        <Column body={nextCallBodyTemplate} header="Ngày gọi tiếp theo" headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="isContracted" header="Đã kí HĐ" headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="isRuningJob" header="Đang chạy job" headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="address" header="Địa chỉ" headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '1rem' }}></Column>
                    </DataTable>

                    <Paginator first={lazyState.pageNumber} rows={lazyState.pageSize} totalRecords={data?.data?.totalCount} rowsPerPageOptions={rowsPerPageOptions} onPageChange={onPageChange} leftContent></Paginator>

                    <UpdateNextCallCompanyModal
                        currentId={currentId}
                        visible={visibleNextCall}
                        onCloseModal={onCloseHandleNextCall}
                    />
                    <UpdateLastCallCompanyModal
                        currentId={currentId}
                        visible={visibleLastCall}
                        onCloseModal={onCloseHandleLastCall}
                    />
                    <ConfirmDialog />
                </div>
            </div>
        </div>
    );
};
export default Companies;
