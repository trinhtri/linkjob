import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { candidateService } from "../../services/candidate/candidateService";
import { CommonLookupRequest } from "../../services/commonLookup/dto/commonLookupRequest";
import { commonLookupService } from "../../services/commonLookup/commonLookupService";
import { formatCurrency } from "../../public/utilities/formatCurrency";
import { useQuery } from "react-query";

interface Props {
    candidateId?: string,
}

const CommonInformationCandidate = ({ candidateId }: Props) => {
    const router = useRouter();

    const { data: candidateDetail, isLoading } = useQuery(
        ["GetCandidateById", candidateId],
        () => {
            return candidateService.getById(candidateId);
        },
        {
            enabled: !!candidateId
        }
    );

    const { data: languages } = useQuery(
        ["Languages"],
        () => {
            let param = {
                type: "Language"
            } as CommonLookupRequest;
            return commonLookupService.getLookup(param);
        },
    );

    const [languagesSelected, setLanguagesSelected] = useState<string>();
    useEffect(() => {
        if (candidateDetail && languages) {
            const labelString = languages.data
                .filter(item => candidateDetail.data.languages.includes(item.value))
                .reduce((result, item) => {
                    return `${result}${item.label}`;
                }, '');
            setLanguagesSelected(labelString);
        }
    }, [candidateDetail, languages]), [candidateDetail, languages];

    return (
        <>
            <div className="grid">
                <div className="col-6">
                    <div className="card">
                        <h5>Thông tin chung</h5>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Họ tên
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.fullName}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Số điện thoại
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.phoneNumber}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Email
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.email}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Giới tính
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.gender}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Năm sinh
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.dateOfBirth}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Chỗ ở hiện tại
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.address}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Quê quán
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.homeTown}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Facebook
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.faceBook}</span>
                        </div>

                    </div>
                </div>

                <div className="col-6">
                    <div className="card">
                        <h5>Học vấn</h5>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Trường
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.school}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Chuyên ngành
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.major}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Bằng cấp
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.degree}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Kinh nghiệm
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.experience}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Ngôn ngữ
                            </div>
                            <span className=" ml-3 ">{languagesSelected}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Đánh giá ngôn ngữ
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.levelAssessment}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Lương mong muốn
                            </div>
                            <span className=" ml-3 ">{formatCurrency(candidateDetail?.data.salary ?? 0)}</span>
                        </div>
                        <div className="mt-3 pb-2 flex justify-content-between border-bottom-1 surface-border">
                            <div className="">
                                Nguyện vọng
                            </div>
                            <span className=" ml-3 ">{candidateDetail?.data.wish}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommonInformationCandidate;
