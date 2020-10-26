import {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next";
import Head from "next/head";
import { Article, BlogPostImage } from "@components/Article";
import type { IPost } from "../index";

export default function BlogPost({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { title, body } = post;
  return (
    <Article>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
      </Head>
      <h1>{title}</h1>
      <BlogPostImage src="/mac.png" alt="mac" />
      <p>{body}</p>
    </Article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  const posts: IPost[] = await res.json();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (constext: GetStaticPropsContext) => {
  const { params } = constext;

  const emptyPost: IPost = {
    title: "Post not found",
    body: "",
    id: 0,
    userId: 0,
  };

  if (!params?.id) {
    return {
      props: {
        post: emptyPost,
      },
    };
  }

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  );

  const post: IPost = await res.json();
  return {
    props: {
      post,
    },
  };
};
