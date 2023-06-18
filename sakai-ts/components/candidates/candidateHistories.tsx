import React from "react";
import { candidateService } from "../../services/candidate/candidateService";
import { useQuery } from "react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";

interface Props {
    candidateId: string,
}

const CandidateHistories = ({ candidateId }: Props) => {

    const { data: candidateHistories, isLoading } = useQuery(
        ["GetCandidateHistoryById", candidateId],
        () => {
            return candidateService.getsCandidateHistories(candidateId);
        },
        {
            enabled: !!candidateId
        }
    );
    const formatDateTemplate = (rowData: any) => {
        return moment(rowData.createdAt).format('DD/MM/YYYY HH:mm');
    }
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>Lịch sử</h5>
                        <DataTable value={candidateHistories?.data}  >
                            <Column body={formatDateTemplate} header="Ngày" style={{ width: '25%' }} />
                            <Column field="content" header="Nội dung" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CandidateHistories;
