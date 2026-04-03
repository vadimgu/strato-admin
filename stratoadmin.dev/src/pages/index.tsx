import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const EXAMPLE_CODE = `import { Admin, ResourceSchema, TextField } from '@strato-admin/admin';
import dataProvider from './dataProvider';

export default function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <ResourceSchema name="products">
        <TextField source="reference" isRequired />
        <TextField source="name" isRequired />
        <TextField source="description" />
      </ResourceSchema>
    </Admin>
  );
}`;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/getting-started/tutorial/">
            Get Started
          </Link>
          <Link className="button button--outline button--secondary button--lg" to="/docs/getting-started/intro">
            View Docs
          </Link>
          <a className="button button--outline button--secondary button--lg" href="https://stratoadmin.dev/demo/">
            Try Live Demo
          </a>
        </div>
      </div>
    </header>
  );
}

function CodeExample() {
  return (
    <section className={styles.codeExample}>
      <div className="container">
        <div className={styles.codeExampleInner}>
          <div className={styles.codeExampleText}>
            <Heading as="h2">Up and running in minutes</Heading>
            <p>
              Define your resources and StratoAdmin generates fully functional list, create, edit, and detail pages — all
              powered by AWS Cloudscape components.
            </p>
            <Link className="button button--primary" to="/docs/getting-started/tutorial/">
              Follow the tutorial →
            </Link>
          </div>
          <div className={styles.codeExampleCode}>
            <CodeBlock language="tsx">{EXAMPLE_CODE}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    step: '1',
    title: 'Install',
    description: 'Scaffold a new project with a single command and connect your data provider.',
  },
  {
    step: '2',
    title: 'Define Resources',
    description: 'Declare your data model with a schema. StratoAdmin generates all CRUD pages automatically.',
  },
  {
    step: '3',
    title: 'Deploy',
    description: 'Ship a production-ready admin app — auth, i18n, and branding included.',
  },
];

function HowItWorks() {
  return (
    <section className={styles.howItWorks}>
      <div className="container">
        <Heading as="h2" className={clsx('text--center', styles.sectionTitle)}>
          How it works
        </Heading>
        <div className={styles.steps}>
          {STEPS.map(({ step, title, description }) => (
            <div key={step} className={styles.step}>
              <div className={styles.stepNumber}>{step}</div>
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <CodeExample />
        <HowItWorks />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
