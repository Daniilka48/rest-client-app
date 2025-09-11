'use client';

import Link from 'next/link';
import Image from 'next/image';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} REST Client App |{' '}
          <Link href="https://github.com/daniilka48" target="_blank">
            Daniil Terekhin
          </Link>{' '}
          &{' '}
          <Link href="https://github.com/guliaisaeva" target="_blank">
            Second Developer
          </Link>
        </p>

        <Link
          href="https://rs.school/courses/reactjs"
          target="_blank"
          className="footer-logo"
        >
          <Image src="/rss-logo.svg" alt="RS School" width={100} height={40} />
        </Link>
      </div>
    </footer>
  );
}
