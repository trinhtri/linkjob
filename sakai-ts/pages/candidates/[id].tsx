import React from "react";
import CreateOrEditCandidateForm from "../../components/candidates/createOrEditCandidateForm";
import { useRouter } from "next/router";

const EditCandidate = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <>
            <div className="col-12">
                <div className="card">
                    <h5>Chỉnh sửa ứng viên</h5>
                    <CreateOrEditCandidateForm
                        candidateId={id?.toString()}
                    />
                </div>
            </div>
        </>
    );
};

export default EditCandidate;
