import { getVersionMessage, getDefaultVersion } from '@/lib/versions';
import styles from './VersionBanner.module.css';

interface VersionBannerProps {
  version: string;
  latestVersionPath: string;
}

export function VersionBanner({ version, latestVersionPath }: VersionBannerProps) {
  const message = getVersionMessage(version);
  const isCurrentVersion = version === getDefaultVersion();

  return (
    <div className={`${styles.banner} ${styles[`style-${message.style}`]}`} role="alert">
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.icon} aria-hidden="true">
            {message.icon === 'times-circle' && '✕'}
            {message.icon === 'check-circle' && '✓'}
            {message.icon === 'info-circle' && 'ℹ'}
          </span>
          <div className={styles.titleSection}>
            <span className={styles.title}>
              Version {version}
              <span className={styles.status}>{message.stability}</span>
            </span>
          </div>
        </div>

        {message.message && (
          <div className={styles.messageSection}>
            <p className={styles.message}>
              This version of Silverstripe CMS {message.message}.
            </p>
            {!isCurrentVersion && (
              <a href={latestVersionPath} className={styles.link}>
                Go to documentation for the most recent stable version →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
