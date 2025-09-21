import Image from 'next/image';
import styles from './DeveloperCard.module.css';

type DeveloperCardProps = {
  photo: string;
  name: string;
  role: string;
  bio?: string;
  github: string;
  priority?: boolean;
};

export default function DeveloperCard({
  photo,
  name,
  role,
  bio,
  github,
  priority,
}: DeveloperCardProps) {
  return (
    <div className={styles['about-card']}>
      <Image
        src={photo}
        alt={name}
        width={150}
        height={150}
        className={styles['about-photo']}
        priority={priority}
      />
      <h1 className={styles['about-title']}>{name}</h1>
      <h3 className={styles['about-subtitle']}>{role}</h3>

      {bio && <p className={styles['about-bio']}>{bio}</p>}

      <p className={styles['about-text']}>
        RS School React Course:{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          https://rs.school/react/
        </a>
      </p>

      <p className={styles['about-text']}>
        GitHub:{' '}
        <a href={github} target="_blank" rel="noreferrer">
          {github.replace('https://', '')}
        </a>
      </p>
    </div>
  );
}
