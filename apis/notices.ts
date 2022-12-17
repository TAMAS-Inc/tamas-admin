import axios from "axios";
export interface NoticeInfo {
  noticeId: string;
  title: string;
  content: string;
}
export type AdminPassword = string;

export interface AddNoticeParams extends Pick<NoticeInfo, "title" | "content"> {
  adminPassword: AdminPassword;
}

export interface EditNoticeParams extends NoticeInfo {
  adminPassword: AdminPassword;
}
export interface DeleteNoticeParams extends Pick<NoticeInfo, "noticeId"> {
  adminPassword: AdminPassword;
}
export type GetNotices = () => NoticeInfo[];
export type RequestAddNotice = (
  params: AddNoticeParams
) => Promise<NoticeInfo[]>;
export type RequestEditNotice = (
  params: EditNoticeParams
) => Promise<NoticeInfo[]>;
export type RequestDeleteNotice = (
  params: DeleteNoticeParams
) => Promise<NoticeInfo[]>;

const END_POINT = "http://localhost:3000/notice";

export const fetchNotices = async () => {
  const url = `${END_POINT}/all`;

  const res = await axios.get(url);
  console.log(res.data);
  return res.data as NoticeInfo;
};

export const requestEditNotice: RequestEditNotice = async ({
  noticeId,
  adminPassword,
  title,
  content,
}) => {
  const url = `${END_POINT}/edit/${noticeId}`;
  const res = await axios.post(url, {
    adminPassword,
    title,
    content,
  });
  return res.data as NoticeInfo[];
};

export const requestDeleteNotice: RequestDeleteNotice = async ({
  noticeId,
  adminPassword,
}) => {
  const url = `${END_POINT}/delete/${noticeId}`;
  const res = await axios.post(url, {
    adminPassword,
  });

  return res.data as NoticeInfo[];
};

export const requestAddNotice: RequestAddNotice = async (params) => {
  const url = `${END_POINT}/add`;
  const res = await axios.post(url, params);

  return res.data as NoticeInfo[];
};
