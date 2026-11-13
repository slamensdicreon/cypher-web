import Link from 'next/link';

/** Shared pieces of Campaign assets: the section tabs, file paths and the page head. */

export const FILES = '/admin/assets/files';

const TABS = [
  ['/admin/assets', 'Overview'],
  ['/admin/assets/logos', 'Logos & brand'],
  ['/admin/assets/social', 'Social profiles'],
  ['/admin/assets/videos', 'Videos'],
  ['/admin/assets/social-ads', 'Social ads'],
  ['/admin/assets/postcards', 'Postcards'],
  ['/admin/assets/trading', 'Trading cards'],
] as const;

export function AssetsHead({ on, title, children, actions }: { on: string; title: string; children?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <>
      <header className="ad-top as-head">
        <div>
          <h1>{title}</h1>
          {children && <p>{children}</p>}
        </div>
        {actions && <div className="ad-controls">{actions}</div>}
      </header>
      <nav className="ad-tabs as-tabs" aria-label="Campaign assets">
        {TABS.map(([href, label]) => (
          <Link key={href} href={href} className={on === href ? 'on' : undefined} aria-current={on === href ? 'page' : undefined}>{label}</Link>
        ))}
      </nav>
    </>
  );
}

/** A file to download, with its size note. */
export function Dl({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return <a className={`ad-btn small${primary ? ' primary' : ''}`} href={href} download>{children}</a>;
}
