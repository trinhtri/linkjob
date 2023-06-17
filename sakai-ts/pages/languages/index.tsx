import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Menu } from 'primereact/menu';
import { languageService } from '../../services/language/languageService';
import { CreateOrUpdateLanguageRequest } from '../../services/language/dto/createOrUpdateLanguageRequest';
import { LanguageResponse } from '../../services/language/dto/languageResponse';
import { SearchCompanyRequest } from '../../services/company/dto/SearchCompanyRequest';
import debounce from 'lodash.debounce';
import { Paginator } from 'primereact/paginator';
import { rowsPerPageOptions } from '../../public/constant';
import CreateLanguage from '../../components/languages/CreateLanguage';

const Languages = () => {
    const [visible, setVisible] = useState(false);
    const [currentId, setCurrentId] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef(null);

    const [lazyState, setlazyState] = useState<SearchCompanyRequest>({
        pageNumber: 1,
        pageSize: 10,
        filterSearch: null,
    });

    const { data, isLoading, refetch } = useQuery(
        ['GetLanguages', lazyState],
        () => {
            const param = {
                filterSearch: lazyState.filterSearch,
                pageNumber: lazyState.pageNumber,
                pageSize: lazyState.pageSize
            };
            return languageService.getsPaging(param);
        },
        {
            enabled: true,
            keepPreviousData: true
        }
    );
    const handleSearch = (event: any) => {
        setlazyState({
            ...lazyState,
            filterSearch: event.target.value
        });
    }
    const onPageChange = (event: any) => {
        setlazyState({
            ...lazyState,
            pageNumber: event.page + 1,
            pageSize: event.rows
        })
    }
    const debouncedSearch = debounce(handleSearch, 600);

    const deleteLanguageMutation = useMutation((id: string) => languageService.delete(id));
    const confirmDelete = (data: any) => {
        confirmDialog({
            message: 'Bạn có muốn xóa ngôn ngữ này không?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                deleteLanguageMutation.mutate(data.id, {
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

    const onEdit = (data: CreateOrUpdateLanguageRequest) => {
        setCurrentId(data.id);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        refetch();
    };

    const actionBodyTemplate = (rowData: LanguageResponse) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const menu = useRef<Menu>(null);
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
                    <h5 className="mt-0">Quản lý ngôn ngữ</h5>
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
                        loading={isLoading}
                        className="datatable-responsive"
                        emptyMessage="No users found."
                    >
                        <Column field="name" header="Tên" headerStyle={{ minWidth: '25rem' }}></Column>
                        <Column header="Hành động" body={actionBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                    </DataTable>

                    <Paginator first={lazyState.pageNumber}
                        rows={lazyState.pageSize}
                        totalRecords={data?.data?.totalCount}
                        rowsPerPageOptions={rowsPerPageOptions}
                        onPageChange={onPageChange} leftContent>
                    </Paginator>

                    <CreateLanguage
                        currentId={currentId}
                        visible={visible}
                        onCloseModal={() => handleCancel()}
                    />
                    <ConfirmDialog />
                </div>
            </div>
        </div>
    );
};

export default Languages;
