import Layout from '@/components/Layout';
import type { AppProps } from 'next/app';
import dynamic from "next/dynamic";
import 'flowbite';
import 'styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const {} = dynamic(import("tw-elements"), { ssr: false });
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
