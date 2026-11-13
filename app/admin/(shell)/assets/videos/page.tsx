import { AssetsHead, Dl, FILES } from '@/components/admin/assets/parts';
import { requireUser } from '@/lib/auth/request';

const V = `${FILES}/videos`;
const FORMATS = [
  ['vertical', '9:16', 'Reels, Shorts, TikTok, Stories'],
  ['square', '1:1', 'LinkedIn and Instagram feeds'],
  ['landscape', '16:9', 'YouTube, LinkedIn, the site'],
] as const;
const VIDEOS = [
  { slug: 'under-the-hood-42s', title: 'Under the hood', length: '42 s', story: 'The eye dives into the Floor: 21 specialists, every move on the record. Bliss and Everything explained, a screen per beat, then “Plans it. Builds it. Checks it. Fixes it.” You make three decisions, and Cypher swallows the screen.' },
  { slug: 'waiting-on-you', title: 'Waiting on you', length: '22 s', story: 'Builds don’t stall on the work; they stall waiting on the client while someone circles back. The answer is the decision card: only what’s yours, with Cypher’s pick and a deadline. Say nothing? It goes ahead.', file: 'waiting-on-you-22s' },
  { slug: 'it-asks-once-15s', title: 'It asks once', length: '15 s', story: 'Same question, every project, every invoice. Cypher asks once: every answer becomes a rule, every build rewrites its own playbook. Name one vendor who can say that.' },
] as const;

/** The hype videos, each in three shapes, with sound. */
export default async function Videos() {
  await requireUser('assets', 'read', '/admin/assets/videos');
  return (
    <main className="wrap ad">
      <AssetsHead on="/admin/assets/videos" title="Videos">
        Each in three shapes, with its soundtrack, H.264 MP4. Play one here or download it for the network you’re posting to.
      </AssetsHead>
      {VIDEOS.map((v) => {
        const base = `cypher-${'file' in v ? v.file : v.slug}`;
        return (
          <section key={v.slug} className="ad-card ad-wide">
            <h3>{v.title} <span className="ad-dim">· {v.length}</span></h3>
            <p className="ad-fine as-story">{v.story}</p>
            <div className="as-videos">
              {FORMATS.map(([shape, ratio, where]) => (
                <figure key={shape} className={`as-video ${shape}`}>
                  <video controls preload="none" playsInline poster={`${V}/${base}-${shape}.jpg`} src={`${V}/${base}-${shape}.mp4`} />
                  <figcaption>
                    <span><b>{ratio}</b> <span className="ad-dim">{where}</span></span>
                    <Dl href={`${V}/${base}-${shape}.mp4`}>MP4</Dl>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
