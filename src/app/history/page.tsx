import HistorySectionWrapper from './HistorySectionWrapper';
import { getServerSession } from 'next-auth';

export default async function HistoryPage() {
  const session = await getServerSession();
  if (!session) return <div>Please sign in to view your history</div>;

  return <HistorySectionWrapper />;
}
