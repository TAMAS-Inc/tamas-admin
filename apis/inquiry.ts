import axios from "axios";
export interface InquiryInfo {
  inquiryId: string;
  email: string;
  title: string;
  content: string;
}
export type AdminPassword = string;

export interface AddInquiryParams extends Exclude<InquiryInfo, "inquiryId"> {
  adminPassword: AdminPassword;
}

export interface EditNoticeParams extends InquiryInfo {
  adminPassword: AdminPassword;
}
export interface DeleteInquiryParams extends Pick<InquiryInfo, "inquiryId"> {
  adminPassword: AdminPassword;
}

export type GetInquiries = () => InquiryInfo[];

export type RequestAddInquiry = (
  params: AddInquiryParams
) => Promise<InquiryInfo[]>;

export type RequestDeleteInquiry = (
  params: DeleteInquiryParams
) => Promise<InquiryInfo[]>;

const END_POINT = "http://localhost:3000/inquiry";

export const fetchInquiries = async () => {
  const url = `${END_POINT}/all`;
  const res = await axios.get(url);
  return res.data as InquiryInfo[];
};

export const requestDeleteInquiry: RequestDeleteInquiry = async ({
  inquiryId,
  adminPassword,
}) => {
  const url = `${END_POINT}/delete/${inquiryId}`;
  const res = await axios.post(url, {
    adminPassword,
  });

  return res.data as InquiryInfo[];
};

export const requestAddInquiry: RequestAddInquiry = async (params) => {
  const url = `${END_POINT}/add`;
  const res = await axios.post(url, params);

  return res.data as InquiryInfo[];
};
