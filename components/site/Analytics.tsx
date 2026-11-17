import Script from 'next/script';
import Track from '@/components/Track';
import { GTM_ID } from '@/lib/site';

/**
 * The public site's analytics. Our own count runs everywhere (no cookies). Google Tag Manager, which
 * loads Google Analytics, runs on the live site only, never on previews, local copies or the admin.
 * Consent Mode is set before it loads: advertising storage is off for everyone, and analytics
 * cookies are off for visitors in Europe (see the privacy page). Google's tag can't tell the region
 * through this container, so /api/region answers that first; no answer within two seconds counts as
 * Europe. Site events go to Analytics with gtag('event'), which the container's Google tag forwards.
 */
export default function Analytics() {
  const live = process.env.VERCEL_ENV === 'production';
  return (
    <>
      <Track />
      {live && (
        <Script id="gtm" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
(function(d){var started=false;function start(europe){if(started)return;started=true;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:europe?'denied':'granted'});
gtag('set','ads_data_redaction',true);
dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName('script')[0],j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';f.parentNode.insertBefore(j,f);}
setTimeout(function(){start(true);},2000);
fetch('/api/region',{cache:'no-store'}).then(function(r){return r.json();}).then(function(x){start(x.europe!==false);}).catch(function(){start(true);});})(document);`}
        </Script>
      )}
    </>
  );
}
