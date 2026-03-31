import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function IconDeclarative() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon}>
      <rect x="8" y="8" width="48" height="48" rx="6" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M18 22h28M18 32h20M18 42h24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 36l6 6-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconOpenSource() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon}>
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="3" />
      <path
        d="M32 10v6M32 48v6M10 32h6M48 32h6M16.1 16.1l4.2 4.2M43.7 43.7l4.2 4.2M16.1 47.9l4.2-4.2M43.7 20.3l4.2-4.2"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function IconCloudscape() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon}>
      <path
        d="M48 38a12 12 0 00-22-6.7A10 10 0 1016 42h32a8 8 0 000-4z"
        stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
      />
      <path d="M24 50h16M32 42v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function IconSchema() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon}>
      <rect x="8" y="8" width="48" height="12" rx="3" stroke="currentColor" strokeWidth="3" />
      <rect x="8" y="26" width="48" height="12" rx="3" stroke="currentColor" strokeWidth="3" />
      <rect x="8" y="44" width="48" height="12" rx="3" stroke="currentColor" strokeWidth="3" />
      <path d="M18 14h4M18 32h4M18 50h4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

type FeatureItem = {
  title: string;
  Icon: () => ReactNode;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Declarative Code',
    Icon: IconDeclarative,
    description: (
      <>
        Define <b>what</b> you want and let the framework handle the <b>how</b>. Strato Admin turns
        resource declarations into fully functional CRUD interfaces with minimal boilerplate.
      </>
    ),
  },
  {
    title: 'Open Source',
    Icon: IconOpenSource,
    description: (
      <>
        MIT licensed and built on the proven{' '}
        <a href="https://marmelab.com/react-admin/" target="_blank" rel="noopener noreferrer">
          React Admin
        </a>{' '}
        architecture. Transparent, community-driven, and free to use in any project.
      </>
    ),
  },
  {
    title: 'Powered by Cloudscape',
    Icon: IconCloudscape,
    description: (
      <>
        Built on{' '}
        <a href="https://cloudscape.design" target="_blank" rel="noopener noreferrer">
          AWS Cloudscape
        </a>
        , the same design system used across AWS products. Your admin gets a polished, accessible UI
        with zero design work.
      </>
    ),
  },
  {
    title: 'Schema-Driven',
    Icon: IconSchema,
    description: (
      <>
        Define field types, labels, and relationships once in a schema. Lists, forms, and detail
        views all stay in sync — no repetition, no drift.
      </>
    ),
  },
];

function Feature({ title, Icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className={clsx('text--center', styles.featureIconWrap)}>
        <Icon />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
