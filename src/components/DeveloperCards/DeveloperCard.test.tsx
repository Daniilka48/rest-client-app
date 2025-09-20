import { render, screen } from '@testing-library/react';
import DeveloperCard from './DeveloperCard';

describe('DeveloperCard', () => {
  it('renders the name, role, and GitHub link', () => {
    render(
      <DeveloperCard
        photo="/me.jpg"
        name="Daniil Terekhin"
        role="Frontend Developer"
        bio="Graduate of Lipetsk"
        github="https://github.com/daniilka48"
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Daniil Terekhin'
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Frontend Developer'
    );

    expect(screen.getByText(/Graduate of Lipetsk/)).toBeInTheDocument();

    const githubLink = screen.getByRole('link', {
      name: /github.com\/daniilka48/,
    });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/daniilka48');
  });
});
