import React from "react";
import CreateOrEditCandidateForm from "../../components/candidates/createOrEditCandidateForm";

const CreateCandidate = () => {
    return (
        <>
            <div className="col-12">
                <div className="card">
                    <h5>Thêm mới ứng viên</h5>
                    <CreateOrEditCandidateForm
                        candidateId=""
                    />
                </div>
            </div>
        </>
    );
};

export default CreateCandidate;
