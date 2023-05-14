import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { MouseEvent } from "react";
import { getAppProps } from "../utils/getAppProps";
import { AppLayout } from "../components/AppLayout";

export default function TokenTopup() {
  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });
    const json = await result.json();
    console.log(json);
    window.location.href = json.session.url;
  };
  return (
    <div className="w-1/2 mx-auto mt-40">
      <h1>This is the token topup</h1>
      <button className="btn" onClick={handleClick}>
        add tokens
      </button>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
