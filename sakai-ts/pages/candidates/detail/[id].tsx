import React from "react";
import { useRouter } from "next/router";
import CommonInformationCandidate from "../../../components/candidates/commonInformation";
import { Button } from "primereact/button";
import CandidateHistories from "../../../components/candidates/candidateHistories";

const DetailCandidate = () => {
    const router = useRouter();
    const { id } = router.query;

    const onCancel = () => {
        router.push("/candidates");
    };

    return (
        <>
            <div className="col-12 flex md:justify-content-end">
                <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    className="p-button-text p-button-success"
                    onClick={onCancel}
                />
            </div>
            <CommonInformationCandidate
                candidateId={id?.toString()}
            />
            <CandidateHistories
                candidateId={id?.toString() ?? ""}
            />
        </>
    );
};

export default DetailCandidate;
