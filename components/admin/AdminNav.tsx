/** The message a form action redirects back with. */
export function Banner({ msg }: { msg?: string }) {
  if (!msg) return null;
  const bad = /^(That didn’t work|Nothing sent|No email column|Choose a CSV|That file)/.test(msg);
  return <p className={bad ? 'ad-banner bad' : 'ad-banner'} role="status">{msg}</p>;
}
