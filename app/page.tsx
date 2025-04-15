import { Suspense } from 'react';
import HomeClient from './(home)/HomeClient';
import Layout from './(home)/Layout';
import Loading from '../components/Loading';

export default function Home() {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <HomeClient />
      </Suspense>
    </Layout>
  );
}
