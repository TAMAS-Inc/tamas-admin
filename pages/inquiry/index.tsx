import Head from "next/head";
import { createContext, useContext, useRef, useState } from "react";
import { twMerge as tw } from "tailwind-merge";
import { NavigationLayout } from "components/NavigationLayout";
import { InquiryInfo, requestDeleteInquiry } from "apis/inquiry";
import { fetchInquiries } from "apis/inquiry";

interface InquiriesContextValue {
  adminPassword: string;
  inquiries: InquiryInfo[];
  setInquiries: React.Dispatch<React.SetStateAction<InquiryInfo[]>>;
}
const InquiriesContext = createContext<InquiriesContextValue | null>(null);

const useInquiriesContext = () => {
  const ctx = useContext(InquiriesContext);

  if (!ctx) {
    throw new Error("Inquiry 컴포넌트 안에서만 쓰여야합니다!");
  }

  return ctx;
};
export default function Inquiry({
  inquiries: _inquiries,
}: {
  inquiries: InquiryInfo[];
}) {
  const pwdRef = useRef(null);
  const [inquiries, setInquiries] = useState(_inquiries);
  const [adminPassword, setAdminPassword] = useState("");

  const handlePasswordChange = () => {
    const $password = pwdRef.current as unknown as HTMLInputElement;
    setAdminPassword($password.value);
  };
  const ctxValue: InquiriesContextValue = {
    adminPassword,
    inquiries: inquiries,
    setInquiries: setInquiries,
  };

  return (
    <>
      <Head>
        <title>TAMAS Mangement</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationLayout>
        <InquiriesContext.Provider value={ctxValue}>
          <div className="flex flex-col gap-3">
            <div>
              운영자 비밀번호
              <input
                type="password"
                onChange={handlePasswordChange}
                ref={pwdRef}
                placeholder="운영자 비밀번호를 입력해주세요"
              />
            </div>
            {inquiries.map((i) => (
              <InquiryCard key={i.inquiryId} {...i} />
            ))}
          </div>
        </InquiriesContext.Provider>
      </NavigationLayout>
    </>
  );
}

export async function getServerSideProps() {
  const inquiries = await fetchInquiries();
  return {
    props: { inquiries },
  };
}

function InquiryCard({ inquiryId, title, content, email }: InquiryInfo) {
  const { adminPassword, setInquiries } = useInquiriesContext();

  const handleDeleteClick = async () => {
    const inquiries = await requestDeleteInquiry({
      inquiryId,
      adminPassword,
    });
    setInquiries(inquiries);
  };

  return (
    <div className="w-[800px] flex flex-col bg-Primary-300 relative border-2">
      <div className="flex gap-2 justify-between p-3">
        <div className="bg-Primary-300 flex-1">{title}</div>
        <div className="flex gap-2">
          <Button className="bg-Red text-White" onClick={handleDeleteClick}>
            삭제
          </Button>
        </div>
      </div>
      <div className="bg-White">
        <div className="p-3">문의한 이메일: {email}</div>
        <div className="p-3">{content}</div>
      </div>
    </div>
  );

  function Button({ children, className, ...props }: Component<"button">) {
    return (
      <button
        className={tw(
          "px-3 py-2 rounded",
          props.disabled ? "bg-Gray-500 text-White" : "bg-White",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
}
