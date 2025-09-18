import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

const RestClientClient = dynamic(() => import('./ClientRestClient'), {
  ssr: false,
});

export default async function RestClientPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/sign-in');
  }

  return <RestClientClient />;
}
