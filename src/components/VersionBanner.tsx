import { getVersionMessage, getDefaultVersion } from '@/lib/versions';
import styles from './VersionBanner.module.css';

interface VersionBannerProps {
  version: string;
  latestVersionPath: string;
}

export function VersionBanner({ version, latestVersionPath }: VersionBannerProps) {
  const message = getVersionMessage(version);
  const isCurrentVersion = version === getDefaultVersion();

  const getIconClass = () => {
    switch (message.icon) {
      case 'times-circle':
        return 'fa-solid fa-circle-xmark';
      case 'check-circle':
        return 'fa-solid fa-circle-check';
      case 'shield-alt':
        return 'fa-solid fa-shield';
      case 'info-circle':
      default:
        return 'fa-solid fa-circle-info';
    }
  };

  return (
    <div className={`${styles.banner} ${styles[`style-${message.style}`]} ${!message.message ? styles.noMessage : ''}`} role="alert">
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={`${styles.icon} ${getIconClass()}`} aria-hidden="true" />
          <div className={styles.titleSection}>
            <div className={styles.title}>
              <span>Version {version}</span>
              <span className={styles.status}>
                <i className={`${styles.statusIcon} ${getIconClass()}`} aria-hidden="true" />
                {message.stability}
              </span>
            </div>
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
