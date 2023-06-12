import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Menu } from 'primereact/menu';
import { Paginator } from 'primereact/paginator';
import { rowsPerPageOptions } from '../../public/constant';

import { userService } from '../../services/user/userService';
import { candidateService } from '../../services/candidate/candidateService';
import { useRouter } from 'next/router';
import { CandidateResponse } from '../../services/candidate/dto/candidateResponse';
import SendCV from './sendCV';
import SetInterviewSchedule from './setInterviewSchedule';
import { SearchCandidateCommonRequest, SearchCandidateRequest } from '../../services/candidate/dto/searchCandidateRequest';
import { formatCurrency } from '../../pages/utilities/formatCurrency';
import axios from 'axios';
import { saveAs } from "file-saver";
interface Props {
    filter: SearchCandidateCommonRequest,
    onReloadCountStatus: () => void;
}

const SearchJobTable = ({ filter, onReloadCountStatus }: Props) => {
    const [visibleSendCV, setVisibleSendCV] = useState<boolean>(false);
    const [visibleSchedule, setVisibleSchedule] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<any>(null);
    const [currentId, setCurrentId] = useState<string>("");

    const [lazyState, setlazyState] = useState<SearchCandidateRequest>({
        first: 0,
        pageNumber: 1,
        pageSize: 10,
        sortField: "UserName",
        sortOrder: null,
        filterSearch: null,
        status: 0,
        startDate: null,
        endDate: null,
        languages: []
    });

    useEffect(() => {
        setlazyState({
            ...lazyState,
            filterSearch: filter.filterSearch,
            startDate: filter.startDate,
            endDate: filter.endDate,
            languages: filter.languages,
        })
    }, [filter]);

    const { data, isLoading, refetch } = useQuery(
        ['searchJobQuery', lazyState],
        () => {
            let sorting = "";
            if (!!lazyState.sortField) {
                sorting = `${lazyState.sortField} ${lazyState.sortOrder === -1 ? "DESC" : "ASC"}`;
            }
            const param = {
                filterSearch: lazyState.filterSearch,
                pageNumber: lazyState.pageNumber,
                pageSize: lazyState.pageSize,
                status: lazyState.status,
                sorting: sorting,
                languages: lazyState.languages,
                startDate: lazyState.startDate,
                endDate: lazyState.endDate
            };
            return candidateService.getsPaging(param);
        },
        {
            enabled: !!lazyState,
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

    const onEdit = (data: any) => {
        router.push(`/candidates/${data.id}`);
    }

    const onSendCV = (data: any) => {
        setCurrentId(data.id);
        setVisibleSendCV(true);
    }
    const handleCancelChangeSendCV = () => {
        setVisibleSendCV(false);
        onReloadCountStatus();
        refetch();
    };

    const onSetInterviewSchedule = (data: any) => {
        setCurrentId(data.id);
        setVisibleSchedule(true);
    }
    const handleCancelInterviewSchedule = () => {
        setVisibleSchedule(false);
        refetch();
    };

    const salaryBodyTemplate = (rowData: any) => {
        return formatCurrency(rowData.salary as number);
    };
    const onViewCV = (data: any) => {
        if (data.cvUrl)
            window.open(data.cvUrl);
    }

    const actionBodyTemplate = (rowData: CandidateResponse) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const menu = useRef<Menu>(null);
        return (
            <>
                <Button icon="pi pi-ellipsis-h" rounded severity="secondary" onClick={(e) => menu.current?.toggle(e)} className="p-button-outlined p-button-sm" />
                <Menu
                    ref={menu}
                    popup
                    model={[
                        {
                            label: 'Gửi CV',
                            command: () => onSendCV(rowData)
                        },
                        {
                            label: 'Chỉnh sửa',
                            command: () => onEdit(rowData)
                        },
                        {
                            label: 'Xem CV',
                            command: () => onViewCV(rowData)
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
                <DataTable
                    ref={dt}
                    value={data?.data?.items}
                    dataKey="id"
                    loading={isLoading}
                    className="datatable-responsive"
                    emptyMessage="No users found."
                >
                    <Column field="fullName" header="Họ tên" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="phoneNumber" header="Số điện thoại" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="email" header="Email" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="gender" header="Giới tính" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="school" header="Trường" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="major" header="Chuyên ngành" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="languages" header="Ngoại ngữ" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="experience" header="Kinh nghiệm" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="wish" header="Nguyện vọng" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column body={salaryBodyTemplate} header="Lương" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '1rem' }}></Column>
                </DataTable>
                <Paginator first={lazyState.pageNumber} rows={lazyState.pageSize} totalRecords={data?.data?.totalCount} rowsPerPageOptions={rowsPerPageOptions} onPageChange={onPageChange} leftContent></Paginator>
                <SendCV
                    visible={visibleSendCV}
                    currentId={currentId}
                    onCloseModal={() => handleCancelChangeSendCV()}
                />
                <SetInterviewSchedule
                    visible={visibleSchedule}
                    currentId={currentId}
                    onCloseModal={() => handleCancelInterviewSchedule()}
                />
                <ConfirmDialog />
            </div>
        </div>
    );
};
export default SearchJobTable;
