import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  emoji?: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🤖 AI-Powered Companion Panels',
    emoji: '🤖',
    description: (
      <>
        Revolutionary interface pattern that transforms traditional modals into 
        persistent, AI-driven workflow companions. Experience seamless shopping 
        with contextual assistance.
      </>
    ),
  },
  {
    title: '📱 Responsive & Adaptive',
    emoji: '📱',
    description: (
      <>
        Mobile-first design with intelligent adaptation. Overlay modals on mobile, 
        side panels on desktop. Smooth animations and touch gestures included.
      </>
    ),
  },
  {
    title: '🏗️ Builder.io Integration',
    emoji: '🏗️',
    description: (
      <>
        Dynamic content management with Builder.io. Non-technical users can 
        customize panel content, promotions, and help sections without code changes.
      </>
    ),
  },
  {
    title: '🔧 Highly Configurable',
    emoji: '🔧',
    description: (
      <>
        Extensive configuration options with feature flags. Enable/disable panels, 
        customize behavior, and adapt to your specific e-commerce needs.
      </>
    ),
  },
  {
    title: '⚡ Performance Optimized',
    emoji: '⚡',
    description: (
      <>
        Built with performance in mind. Lazy loading, code splitting, and 
        optimized bundle sizes ensure fast loading times and smooth interactions.
      </>
    ),
  },
  {
    title: '🎯 Developer Experience',
    emoji: '🎯',
    description: (
      <>
        TypeScript-first with comprehensive documentation, testing utilities, 
        and development tools. Built for teams and maintainable codebases.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>
          <span className={styles.emoji}>{emoji}</span>
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        
        {/* Additional sections */}
        <div className={styles.additionalSections}>
          {/* Quick Start Section */}
          <div className="row margin-top--xl">
            <div className="col col--12">
              <div className={styles.quickStartSection}>
                <Heading as="h2" className="text--center margin-bottom--lg">
                  🚀 Quick Start Guide
                </Heading>
                <div className="row">
                  <div className="col col--4">
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>1</div>
                      <h4>Install & Setup</h4>
                      <p>Clone the repository and install dependencies. Configure your environment variables for Medusa and Builder.io.</p>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>2</div>
                      <h4>Configure Panels</h4>
                      <p>Customize your companion panels in <code>store.config.js</code>. Enable AI features, filters, and help systems.</p>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>3</div>
                      <h4>Deploy & Scale</h4>
                      <p>Deploy to Vercel or your preferred platform. Monitor performance and iterate based on user feedback.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="row margin-top--xl">
            <div className="col col--12">
              <div className={styles.statsSection}>
                <div className="row">
                  <div className="col col--3">
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>7+</div>
                      <div className={styles.statLabel}>Panel Types</div>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>100%</div>
                      <div className={styles.statLabel}>TypeScript</div>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>A11y</div>
                      <div className={styles.statLabel}>Compliant</div>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>Mobile</div>
                      <div className={styles.statLabel}>First</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}