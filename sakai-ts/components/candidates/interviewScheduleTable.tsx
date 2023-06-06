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
import { SearchCandidateCommonRequest, SearchCandidateRequest } from '../../services/candidate/dto/searchCandidateRequest';
import moment from 'moment';
import { CandidateInterviewResponse } from '../../services/candidate/dto/candidateInterviewResponse';
import { formatCurrency } from '../../pages/utilities/formatCurrency';
import SetInterviewSchedule from './setInterviewSchedule';
import { SetPassInterviewRequest } from '../../services/candidate/dto/setPassInterviewRequest';
interface Props {
    filter: SearchCandidateCommonRequest,
}

const InterviewScheduleTable = ({ filter }: Props) => {
    const [visibleSendCV, setVisibleSendCV] = useState<boolean>(false);
    const [visibleSchedule, setVisibleSchedule] = useState<boolean>(false);
    const [visiblePassInterview, setVisiblePassInterview] = useState<boolean>(false);
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
        ['interviewSchedulePaging', lazyState],
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
            return candidateService.getsPagingInterview(param);
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

    const setPassInterviewMutation = useMutation((data: SetPassInterviewRequest) => candidateService.setPassInterview(data));
    const confirmPassInterview = (data: any) => {
        confirmDialog({
            message: 'Bạn có chắc chắn ứng viên đã đỗ phỏng vấn không?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const request = {
                    candidateId: data.id,
                    companyId: data.companyId
                };
                setPassInterviewMutation.mutate(request, {
                    onSuccess: () => {
                        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Cập nhật thành công', life: 3000 });
                    },
                    onError: (error: any) => {
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: "Cập nhật thất bại", life: 3000 });
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
        refetch();
    };

    const handleCancelInterviewSchedule = () => {
        setVisibleSchedule(false);
        refetch();
    };

    const onSetPassInterview = (data: any) => {
        setCurrentId(data.id);
        setVisiblePassInterview(true);
    }

    const handleCancelPassInterview = () => {
        setVisiblePassInterview(false);
        refetch();
    };
    const salaryBodyTemplate = (rowData: CandidateInterviewResponse) => {
        return formatCurrency(rowData.luongMongMuon as number);
    };

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
                            label: 'Đã trúng tuyển',
                            command: () => confirmPassInterview(rowData)
                        },
                        {
                            label: 'Chỉnh sửa',
                            command: () => onEdit(rowData)
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
    const interviewTemplate = (rowData: CandidateInterviewResponse) => {
        return moment(rowData.interviewSchedule).format('DD/MM/YYYY HH:mm');
    }
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
                    <Column field="hoTen" header="Họ tên" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="sdt" header="Số điện thoại" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="email" header="Email" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="tenCty" header="Tên Cty" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column field="interviewSchedule" header="Thời gian" headerStyle={{ minWidth: '5rem' }} dataType="date" body={interviewTemplate} ></Column>
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
                {/* <SetPassInterview
                    visible={visiblePassInterview}
                    currentId={currentId}
                    onCloseModal={() => handleCancelPassInterview()}
                /> */}
                <ConfirmDialog />
            </div>
        </div>
    );
};
export default InterviewScheduleTable;
