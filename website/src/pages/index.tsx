import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started">
            Get Started - 5min ⏱️
          </Link>
          <Link
            className="button button--primary button--lg margin-left--md"
            to="/docs/companion-panel/overview">
            Explore Companion Panels 🤖
          </Link>
        </div>
        <div className={styles.demoLinks}>
          <Link
            className="button button--outline button--secondary margin-top--md"
            to="https://your-store.com">
            🚀 Live Demo
          </Link>
          <Link
            className="button button--outline button--secondary margin-left--sm margin-top--md"
            to="https://github.com/medusajs/nextjs-starter-medusa">
            ⭐ GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Revolutionary E-commerce with AI`}
      description="Enhanced Medusa Next.js starter with revolutionary companion panel system, AI shopping assistant, and modern e-commerce patterns.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}