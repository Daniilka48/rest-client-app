import { render } from '@testing-library/react';
import HistoryPage from './page';
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('./HistorySectionWrapper', () => {
  const Mock: React.FC = () => <div>Mocked HistorySectionWrapper</div>;
  Mock.displayName = 'MockedHistorySectionWrapper';
  return Mock;
});

describe('HistoryPage', () => {
  it('renders sign in message if no session', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const { findByText } = render(await HistoryPage());
    expect(
      await findByText('Please sign in to view your history')
    ).toBeInTheDocument();
  });

  it('renders HistorySectionWrapper if session exists', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '123' } });
    const { findByText } = render(await HistoryPage());
    expect(
      await findByText('Mocked HistorySectionWrapper')
    ).toBeInTheDocument();
  });
});
