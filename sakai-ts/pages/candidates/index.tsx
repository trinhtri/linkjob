import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { Suspense, useState } from 'react';
import debounce from 'lodash.debounce';
import { candidateService } from '../../services/candidate/candidateService';
import { useRouter } from 'next/router';
import { TabMenu } from 'primereact/tabmenu';
import { MultiSelect } from 'primereact/multiselect';
import { CommonLookupRequest } from '../../services/commonLookup/dto/commonLookupRequest';
import { commonLookupService } from '../../services/commonLookup/commonLookupService';
import { Calendar } from 'primereact/calendar';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import { SearchCandidateCommonRequest } from '../../services/candidate/dto/searchCandidateRequest';

const Candidates = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [lazyState, setlazyState] = useState<SearchCandidateCommonRequest>({
        filterSearch: null,
        startDate: null,
        endDate: null,
        languages: []
    });

    const handleSearch = (event: any) => {
        setlazyState({
            ...lazyState,
            filterSearch: event.target.value
        })
    }
    const debouncedSearch = debounce(handleSearch, 600);

    const { data: countForStatus, refetch: refetchCountForStatus } = useQuery(
        ['CountForStatus'],
        () => { return candidateService.getCountForStatus(); },
    );
    const SearchJobTable = dynamic(() => import('../../components/candidates/searchJobTable'), {
        ssr: false
    });
    const ApplyingForJobsTable = dynamic(() => import('../../components/candidates/applyingForJobsTable'), {
        ssr: false
    });
    const InterviewScheduleTable = dynamic(() => import('../../components/candidates/interviewScheduleTable'), {
        ssr: false
    });
    const PassedTableTable = dynamic(() => import('../../components/candidates/passedTable'), {
        ssr: false
    });
    const AcceptedTableTable = dynamic(() => import('../../components/candidates/acceptedTable'), {
        ssr: false
    });

    const wizardItems = [
        {
            id: "0",
            label: `Đang tìm việc (${countForStatus?.data.dangTimViec ?? 0})`,
            component: <SearchJobTable filter={lazyState} />
        },
        {
            id: "1",
            label: `Đang ứng tuyển (${countForStatus?.data.dangUngTuyen ?? 0})`,
            component: <ApplyingForJobsTable filter={lazyState} />
        },
        {
            id: "2",
            label: `Lịch phỏng vấn (${countForStatus?.data.lichPV ?? 0})`,
            component: <InterviewScheduleTable filter={lazyState} />
        },
        {
            id: "3",
            label: `Đã trúng tuyển (${countForStatus?.data.daTrungTuyen ?? 0})`,
            component: <PassedTableTable filter={lazyState} />
        },
        {
            id: "4",
            label: `Đã hoàn thành (${countForStatus?.data.daHoanThanh ?? 0})`,
            component: <AcceptedTableTable filter={lazyState} />
        },
    ];

    const Component = wizardItems[activeIndex].component;

    const onChangeTab = (event: any) => {
        setActiveIndex(event.index);
    }

    const router = useRouter();
    const onCreate = () => {
        router.push("/candidates/create");
    };

    const { data: languages } = useQuery(
        ["Languages"],
        () => {
            let param = {
                type: "Language"
            } as CommonLookupRequest;
            return commonLookupService.getLookup(param);
        },
    );

    const exportCSV = () => {

    }

    const onChangeV = (e: any) => {
        setlazyState({ ...lazyState, languages: e.value })
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mb-3">
                        <h5 className="mt-0">Quản lý ứng viên</h5>

                        <div>
                            <Button label="Export" icon="pi pi-upload" className="p-button-help mr-2 p-button-sm" onClick={exportCSV} />
                            <Button label="Thêm mới" icon="pi pi-plus" className="p-button-success mr-2 p-button-sm" onClick={onCreate} />
                        </div>
                    </div>

                    <div className='flex'>
                        <div className="col-3">
                            <span className="block mt-2 md:mt-0 p-input-icon-right">
                                <InputText type="search" onChange={debouncedSearch} placeholder="Nhập từ khóa tìm kiếm" className="w-full" />
                                <i className="pi pi-search" />
                            </span>
                        </div>
                        <div className="col-3">
                            <MultiSelect
                                inputId="multiselect"
                                value={lazyState.languages}
                                optionValue="value"
                                optionLabel="label"
                                placeholder="Chọn ngôn ngữ"
                                className={`form-control w-full `}
                                options={languages?.data}
                                onChange={(e) =>
                                    setlazyState({ ...lazyState, languages: e.value })
                                }
                            />
                        </div>
                        <div className="col-3">
                            <Calendar
                                placeholder='Ngày bắt đầu'
                                dateFormat="dd/mm/yy"
                                showButtonBar
                                className={`form-control w-full `}
                                value={lazyState.startDate}
                                onChange={(e: any) =>
                                    setlazyState({ ...lazyState, startDate: e.value })
                                }
                            ></Calendar>
                        </div>
                        <div className="col-3">
                            <Calendar dateFormat="dd/mm/yy"
                                placeholder='Ngày kết thúc'
                                showButtonBar
                                className={`form-control w-full `}
                                value={lazyState.endDate}
                                onChange={(e: any) =>
                                    setlazyState({ ...lazyState, endDate: e.value })
                                }
                            ></Calendar>
                        </div>
                    </div>
                    <TabMenu model={wizardItems} activeIndex={activeIndex} onTabChange={(e) => onChangeTab(e)} />

                    <Suspense fallback={`Loading...`}>
                        {Component}
                    </Suspense>

                </div>
            </div>
        </div>
    );
};
export default Candidates;
