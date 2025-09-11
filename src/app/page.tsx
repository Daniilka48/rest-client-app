import DeveloperCard from 'components/DeveloperCards/DeveloperCard';
import Link from 'next/link';
import styles from './MainPage.module.css';

export default function MainPageMock() {
  const isLoggedIn = false;

  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem',
        }}
      >
        <h1>REST Client</h1>
        <div>
          {isLoggedIn ? (
            <Link href="/rest-client">Main Page</Link>
          ) : (
            <>
              <Link href="/sign-in">Sign In</Link>
              {' | '}
              <Link href="/sign-up">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Welcome to the REST Client App</h2>
        <p className={styles.info}>Project: REST Client</p>
        <p className={styles.info}>Course: Stage 3 React</p>

        <h2 className={styles.subtitle}>Developers</h2>

        <section className={styles.developers}>
          <DeveloperCard
            photo="/2.jpg"
            name="Daniil Terekhin"
            role="Frontend Developer"
            bio="Graduate of Lipetsk State Technical University, majoring in Economics and Management at Enterprises. Before becoming a programmer, he worked in sales, service and SMM, developing communication and promotion skills. Currently studying on the React course at RS School, where he has already implemented several projects and significantly improved his programming skills."
            github="https://github.com/daniilka48"
          />

          <DeveloperCard
            photo="/1.jpeg"
            name="Second Developer"
            role="Frontend Developer"
            bio="Graduate of Lipetsk State Technical University, majoring in Economics and Management at Enterprises. Before becoming a programmer, he worked in sales, service and SMM, developing communication and promotion skills. Currently studying on the React course at RS School, where he has already implemented several projects and significantly improved his programming skills."
            github="https://github.com/guliaisaeva"
          />
        </section>
      </main>
    </div>
  );
}
