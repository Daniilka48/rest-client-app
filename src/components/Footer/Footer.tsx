import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>
          © {new Date().getFullYear()} REST Client App |{' '}
          <Link
            href="https://github.com/daniilka48"
            target="_blank"
            className={styles.link}
          >
            Daniil Terekhin
          </Link>{' '}
          &{' '}
          <Link
            href="https://github.com/guliaisaeva"
            target="_blank"
            className={styles.link}
          >
            Gulia Isaeva Çöloğlu
          </Link>
        </p>

        <Link
          href="https://rs.school/courses/reactjs"
          target="_blank"
          className={styles.footerLogo}
        >
          <Image src="/rss-logo.svg" alt="RS School" width={40} height={40} />
        </Link>
      </div>
    </footer>
  );
}
