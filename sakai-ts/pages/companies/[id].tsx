import React from "react";
import { useRouter } from "next/router";
import CreateOrEditCompanyForm from "../../components/companies/createOrEditCompanyForm";

const EditCompany = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <>
            <div className="col-12">
                <div className="card">
                    <h5>Chỉnh sửa công ty</h5>
                    <CreateOrEditCompanyForm
                        id={id?.toString()}
                    />
                </div>
            </div>
        </>
    );
};

export default EditCompany;
