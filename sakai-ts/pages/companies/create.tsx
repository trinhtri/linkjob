import React from "react";
import CreateOrEditCompanyForm from "../../components/companies/createOrEditCompanyForm";

const CreateCompany = () => {
    return (
        <>
            <div className="col-12">
                <div className="card">
                    <h5>Thêm mới công ty</h5>
                    <CreateOrEditCompanyForm
                        id=""
                    />
                </div>
            </div>
        </>
    );
};

export default CreateCompany;
