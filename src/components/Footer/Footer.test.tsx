import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

jest.mock('next/link', () => {
  const LinkMock: React.FC<{ children: React.ReactNode; href: string }> = ({
    children,
    href,
  }) => <a href={href}>{children}</a>;
  return LinkMock;
});

jest.mock('next/image', () => {
  const ImageMock: React.FC<
    React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }
  > = (props) => {
    const { alt, ...rest } = props;
    return (
      <span data-testid="mock-image" {...rest}>
        {alt}
      </span>
    );
  };
  return ImageMock;
});

describe('Footer', () => {
  it('renders footer text with links and image', () => {
    render(<Footer />);

    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${year} REST Client App`))
    ).toBeInTheDocument();

    expect(screen.getByText('Daniil Terekhin').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/daniilka48'
    );
    expect(
      screen.getByText('Gulia Isaeva Çöloğlu').closest('a')
    ).toHaveAttribute('href', 'https://github.com/guliaisaeva');

    expect(screen.getByText('RS School').closest('a')).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );

    expect(screen.getByTestId('mock-image')).toHaveTextContent('RS School');
  });
});
