"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

import withAuth from "@/components/common/withAuth";
import Head from "next/head";

const Page = () => {
  useEffect(() => {
    redirect("/home");
  });

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>
    </>
  );
};

export default withAuth(Page);
