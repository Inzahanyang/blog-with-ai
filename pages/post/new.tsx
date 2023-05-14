import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { AppLayout } from "../../components/AppLayout";

interface PostForm {
  topic: string;
  keywords: string;
}

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, getValues } = useForm<PostForm>();

  const onValid = async (form: PostForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generatePost", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "content-type": "application/json",
        },
      });
      const json = await res.json();
      setLoading(false);
      if (json.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {!!loading && (
        <div className="text-green-500 flex h-full animate-pulse w-full items-center justify-center flex-col">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating...</h6>
        </div>
      )}
      {!loading && (
        <div className="flex flex-col overflow-auto w-full h-full ">
          <form
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200 space-y-3"
            onSubmit={handleSubmit(onValid)}
          >
            <div>
              <label>
                <strong className="text-sm font-semibold">
                  작성한 주제에 대한 블로그 게시물을 생성합니다:{" "}
                </strong>
              </label>
              <textarea
                className="resize-none mt-1 block w-full rounded-md border border-black h-16 px-2 py-0.5"
                {...register("topic", { required: true, minLength: 10 })}
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label>
                <strong className="text-sm font-semibold">
                  다음에 작성된 키워드를 타켓팅합니다.
                </strong>
              </label>
              <textarea
                className="resize-none mt-1 block w-full rounded-md border border-black h-16 px-2 py-0.5"
                {...register("keywords", { required: true, minLength: 9 })}
              ></textarea>
              <small className="block  mb-2 mt-0.5 text-sm text-slate-700">
                쉼표로 키워드를 구분합니다.
              </small>
            </div>
            <button type="submit" className="btn">
              {loading ? "Loading..." : "Generate Post"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false,
        },
      };
    }

    return {
      props,
    };
  },
});
