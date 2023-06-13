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

import { candidateService } from '../../services/candidate/candidateService';
import { useRouter } from 'next/router';
import { CandidateResponse } from '../../services/candidate/dto/candidateResponse';
import SendCV from './sendCV';
import { SearchCandidateCommonRequest, SearchCandidateRequest } from '../../services/candidate/dto/searchCandidateRequest';
import { formatCurrency } from '../../public/utilities/formatCurrency';
import { CandidateInterviewResponse } from '../../services/candidate/dto/candidateInterviewResponse';
import { AcceptOfferRequest } from '../../services/candidate/dto/acceptOfferRequest';

interface Props {
    filter: SearchCandidateCommonRequest,
    onReloadCountStatus: () => void;
}

const PassedTable = ({ filter, onReloadCountStatus }: Props) => {
    const [visibleSendCV, setVisibleSendCV] = useState<boolean>(false);
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
        status: 1,
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
        ['getCandidatePassed', lazyState],
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
            return candidateService.getsPagingPassed(param);
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
    const acceptOfferMutation = useMutation((request: AcceptOfferRequest) => candidateService.acceptOffer(request));
    const confirmAcceptOffer = (data: any) => {
        console.log("data", data);
        let request = {
            candidateId: data.id,
            companyId: data.companyId
        } as AcceptOfferRequest;
        confirmDialog({
            message: 'Bạn có chắc chắn ứng viên đã nhận Offer?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                acceptOfferMutation.mutate(request, {
                    onSuccess() {
                        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Delete user successfully', life: 3000 });
                        refetch();
                        onReloadCountStatus();
                    }
                });
            },
            acceptClassName: 'p-button-danger'
        });
    };

    const rejectOfferMutation = useMutation((request: AcceptOfferRequest) => candidateService.rejectOffer(request));
    const confirmRejectOffer = (data: any) => {
        console.log("data", data);
        let request = {
            candidateId: data.id,
            companyId: data.companyId
        } as AcceptOfferRequest;
        confirmDialog({
            message: 'Bạn có chắc chắn ứng viên từ chối Offer?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                rejectOfferMutation.mutate(request, {
                    onSuccess() {
                        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Ứng viên từ chối offer thành công', life: 3000 });
                        refetch();
                        onReloadCountStatus();
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
                            label: 'Nhận offer',
                            command: () => confirmAcceptOffer(rowData)
                        },
                        {
                            label: 'Từ chối offer',
                            command: () => confirmRejectOffer(rowData)
                        },
                        {
                            label: 'Chỉnh sửa',
                            command: () => onEdit(rowData)
                        },
                        {
                            label: 'Xem CV',
                            command: () => onViewCV(rowData)
                        }
                    ]}
                />
            </>
        );
    };
    const salaryBodyTemplate = (rowData: CandidateInterviewResponse) => {
        return formatCurrency(rowData.salary as number);
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
                    <Column field="companyName" header="Cty nhận" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column body={salaryBodyTemplate} header="Lương" headerStyle={{ minWidth: '5rem' }} ></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '1rem' }}></Column>
                </DataTable>
                <Paginator first={lazyState.pageNumber} rows={lazyState.pageSize} totalRecords={data?.data?.totalCount} rowsPerPageOptions={rowsPerPageOptions} onPageChange={onPageChange} leftContent></Paginator>
                <SendCV
                    visible={visibleSendCV}
                    currentId={currentId}
                    onCloseModal={() => handleCancelChangeSendCV()}
                />
                <ConfirmDialog />
            </div>
        </div>
    );
};
export default PassedTable;
