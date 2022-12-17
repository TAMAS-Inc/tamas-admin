import {
  fetchNotices,
  requestAddNotice,
  requestDeleteNotice,
  requestEditNotice,
} from "apis/notices";
import { NavigationLayout } from "components/NavigationLayout";
import Head from "next/head";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NoticeInfo } from "../../apis/notices";
import { twMerge as tw } from "tailwind-merge";

interface NoticesContextValue {
  adminPassword: string;
  notices: NoticeInfo[];
  setNotices: React.Dispatch<React.SetStateAction<NoticeInfo[]>>;
}
const NoticesContext = createContext<NoticesContextValue | null>(null);

const useNoticesContext = () => {
  const ctx = useContext(NoticesContext);

  if (!ctx) {
    throw new Error("Notices 컴포넌트 안에서만 쓰여야합니다!");
  }

  return ctx;
};
export default function Notice({
  notices: _notices,
}: {
  notices: NoticeInfo[];
}) {
  const pwdRef = useRef(null);
  const [notices, setNotices] = useState(_notices);
  const [adminPassword, setAdminPassword] = useState("");

  const handlePasswordChange = () => {
    const $password = pwdRef.current as unknown as HTMLInputElement;
    setAdminPassword($password.value);
  };
  const ctxValue: NoticesContextValue = {
    adminPassword,
    notices,
    setNotices,
  };

  return (
    <>
      <Head>
        <title>TAMAS Mangement</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationLayout>
        <NoticesContext.Provider value={ctxValue}>
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
            <AddNoticeCard />
            {notices.map((n) => (
              <NoticeCard key={n.noticeId} {...n} />
            ))}
          </div>
        </NoticesContext.Provider>
      </NavigationLayout>
    </>
  );
}

export async function getServerSideProps() {
  const notices = await fetchNotices();
  return {
    props: { notices },
  };
}

function NoticeCard({ noticeId, title, content }: NoticeInfo) {
  const { adminPassword, setNotices } = useNoticesContext();
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const [isChanged, setIsChanged] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);

  useEffect(() => {
    const $title = titleRef.current as unknown as HTMLInputElement;
    $title.value = title;
  }, []);

  useEffect(() => {
    setIsChanged(newTitle !== title || newContent !== content);
  }, [title, content, newTitle, newContent]);

  const handleTitleChange = () => {
    const $title = titleRef.current as unknown as HTMLInputElement;
    setNewTitle($title.value);
  };

  const handleContentChange = () => {
    const $content = contentRef.current as unknown as HTMLInputElement;
    setNewContent($content.value);
  };

  const handleSumbitClick = async () => {
    const notices = await requestEditNotice({
      noticeId,
      title: newTitle,
      content: newContent,
      adminPassword,
    });
    setNotices(notices);
  };

  const handleDeleteClick = async () => {
    const notices = await requestDeleteNotice({
      noticeId,
      adminPassword,
    });
    setNotices(notices);
  };

  return (
    <div className="w-[800px] flex flex-col bg-Primary-300 relative border-2">
      <div className="flex gap-2 justify-between p-3">
        <input
          onChange={handleTitleChange}
          ref={titleRef}
          className="bg-Primary-300 flex-1"
        />
        <div className="flex gap-2">
          <Button disabled={!isChanged} onClick={handleSumbitClick}>
            변경 사항 제출
          </Button>
          <Button className="bg-Red text-White" onClick={handleDeleteClick}>
            삭제
          </Button>
        </div>
      </div>
      <textarea
        onChange={handleContentChange}
        ref={contentRef}
        className="p-3"
        defaultValue={content}
      />
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
function AddNoticeCard() {
  const { adminPassword, setNotices } = useNoticesContext();
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const [isFilled, setIsFilled] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setIsFilled(title !== "" && content !== "");
  }, [title, content]);

  const handleTitleChange = () => {
    const $title = titleRef.current as unknown as HTMLInputElement;
    setTitle($title.value);
  };

  const handleContentChange = () => {
    const $content = contentRef.current as unknown as HTMLInputElement;
    setContent($content.value);
  };

  const handleSumbitClick = async () => {
    const notices = await requestAddNotice({
      title,
      content,
      adminPassword,
    });
    setNotices(notices);
    const $title = titleRef.current as unknown as HTMLInputElement;
    const $content = contentRef.current as unknown as HTMLInputElement;
    $title.value = "";
    $content.value = "";
  };

  return (
    <div className="w-[800px] flex flex-col bg-Primary-300 relative border-2">
      <div className="flex gap-2 justify-between p-3">
        <input
          onChange={handleTitleChange}
          ref={titleRef}
          className="bg-Primary-300 flex-1"
          placeholder="제목을 입력해주세요."
        />
        <div className="flex gap-2">
          <Button disabled={!isFilled} onClick={handleSumbitClick}>
            추가하기
          </Button>
        </div>
      </div>
      <textarea
        onChange={handleContentChange}
        ref={contentRef}
        className="p-3"
        defaultValue={""}
        placeholder="내용을 입력해주세요."
      />
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
