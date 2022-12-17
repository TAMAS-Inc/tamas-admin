import Link from "next/link";
import { useRouter } from "next/router";

export function NavigationLayout({ children }: Component<"div">) {
  const router = useRouter();
  interface PageInfo {
    href: `/${string}`;
    title: string;
  }

  const managingPages: PageInfo[] = [
    {
      href: "/",
      title: "홈",
    },
    {
      href: "/notices",
      title: "공지사항",
    },
    {
      href: "/inquiry",
      title: "문의사항",
    },
  ];

  return (
    <div className="">
      <div className="flex  bg-white mb-3 border-b-2">
        {managingPages.map(({ href, title }) => (
          <Link key={href} href={href}>
            <div
              className={`text-body1 py-5 px-4 hover:scale-110   cursor-pointer ${
                href === router.pathname
                  ? "text-Primary-700 font-bold"
                  : "white"
              }`}
            >
              {title}
            </div>
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
