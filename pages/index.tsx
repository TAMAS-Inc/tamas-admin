import { NavigationLayout } from "components/NavigationLayout";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>TAMAS Mangement</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationLayout>
        <div>Home</div>
      </NavigationLayout>
    </>
  );
}
