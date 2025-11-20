import styles from './EditOnGithub.module.css';

interface EditOnGithubProps {
  version: string;
  filePath: string;
  category: 'docs' | 'user';
}

export default function EditOnGithub({
  version,
  filePath,
  category,
}: EditOnGithubProps) {
  const repo = category === 'docs' ? 'developer-docs' : 'userhelp-docs';
  const githubUrl = `https://github.com/silverstripe/${repo}/edit/${version}/${filePath}`;

  return (
    <div className={styles.editContainer}>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.editLink}>
        Edit on GitHub
      </a>
    </div>
  );
}
