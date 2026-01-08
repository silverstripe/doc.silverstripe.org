import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link
          href="/en/6/"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.25rem',
            backgroundColor: 'var(--theme-color-primary)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.375rem',
            fontWeight: '600',
          }}
        >
          Go to Latest Documentation
        </Link>
      </div>
    </main>
  );
}
