import Layout from "@/component/Layout";
import Loading from "@/component/Loading";
import AuthProvider from "@/context/AuthContext";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import { Router } from "next/router";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SocketProvider from "@/context/SocketContext";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import "react-datepicker/dist/react-datepicker.css";
export default function App({ Component, pageProps }) {
  const [loadPage, setLoadPage] = useState(false);
  Router.events.on("routeChangeStart", (url) => {
    setLoadPage(true);
  });
  Router.events.on("routeChangeComplete", () => {
    setLoadPage(false);
  });
  Router.events.on("routeChangeError", () => {
    setLoadPage(true);
  });

  return (
    <>
      {loadPage ? <Loading /> : null}
      <Head>
        <title>TRAFFIC SEO</title>
        <meta
          name="google-site-verification"
          content="E5D6eVD9q6pGeuoB8ov8olqnM_7vw371a4iy7qjQXzo"
        />
      </Head>
      <Script
        async
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-MZY2RQ0M0Q"
      ></Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
         window.dataLayer = window.dataLayer || []; function gtag()
         {dataLayer.push(arguments)}
         gtag('js', new Date()); gtag('config', 'G-MZY2RQ0M0Q');
        `}
      </Script>
      <FpjsProvider
        loadOptions={{
          apiKey: "xvFSU0mZlWPOiTdN3tA9",
        }}
      >
        <GoogleOAuthProvider clientId="124038751321-heq9tk8j8mvutq9o8rmspsm8omjr7r5v.apps.googleusercontent.com">
          <AuthProvider>
            <SocketProvider>
              <Component {...pageProps} />
              <ToastContainer closeButton={false} />
            </SocketProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </FpjsProvider>
    </>
  );
}
