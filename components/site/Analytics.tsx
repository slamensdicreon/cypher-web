import Script from 'next/script';
import Track from '@/components/Track';
import { GTM_ID } from '@/lib/site';

/**
 * Where visitors in Europe get no analytics cookies: the EEA, the UK and Switzerland. Google's tag
 * works out the visitor's region itself.
 */
const EUROPE = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];

/**
 * The public site's analytics. Our own count runs everywhere (no cookies). Google Tag Manager, which
 * loads Google Analytics, runs on the live site only, never on previews, local copies or the admin.
 * Consent Mode is set before it loads: advertising storage is off for everyone, and analytics
 * cookies are off for visitors in Europe (see the privacy page).
 */
export default function Analytics() {
  const live = process.env.VERCEL_ENV === 'production';
  return (
    <>
      <Track />
      {live && (
        <Script id="gtm" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(EUROPE)}});
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('set','ads_data_redaction',true);
dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
(function(d){var f=d.getElementsByTagName('script')[0],j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';f.parentNode.insertBefore(j,f);})(document);`}
        </Script>
      )}
    </>
  );
}
