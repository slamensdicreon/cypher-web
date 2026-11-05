/**
 * Vendor domains: agencies, integrators and platform vendors. They are declined as vendors.
 *
 * From the 2026 Symposium sponsor attendee registration report (October 26, 2026): every
 * business domain on a row marked Vendor. Personal mailboxes on those rows were left out, and so
 * was mit.edu (one attendee's university address, not their firm's). Valtech was on the
 * original list. Icreon is ours: see ALLOWED in rules.ts.
 *
 * Subdomains match too: fujitsu.com also covers jp.fujitsu.com.
 * Add more without a deploy through BLOCK_VENDOR_DOMAINS.
 */
export const VENDOR_DOMAINS: readonly string[] = [
  '21yunbox.com', // 21YunBox
  '7kingscode.com', // 7 KINGS CODE LLC
  'accenture.com', // Accenture
  'agencyq.com', // AgencyQ
  'akqaleap.com', // AKQA
  'alinedx.com.au', // Aline DX
  'allianceinnovations.com', // Alliance Innovations
  'altudo.co', // Altudo
  'americaneagle.com', // Americaneagle.com
  'applez.tech', // ApplezTech
  'arcsen.com', // Arcsen
  'asmblii.com', // asmblii
  'avanade.com', // Avanade
  'bendingspoons.com', // Brightcove
  'boltexec.com', // Bolt Exec
  'brimit.com', // BRIMIT
  'ci-hub.com', // CI HUB
  'cimarronwinter.com', // Cimarron Winter
  'claravine.com', // Claravine, Inc.
  'cloudiq.io', // Cloudiq
  'codehousegroup.com', // Codehouse
  'constantcontact.com', // Sitecore Send
  'coveo.com', // Coveo
  'dataweavers.com', // Dataweavers
  'deloitte.ca', // Deloitte
  'diagema.de', // diagema GmbH
  'digital-herd.com', // Digital Herd
  'digiteins.com', // Digiteins
  'elastic.co', // Elastic
  'epam.com', // EPAM
  'familie-kiener.de', // MSQ DX
  'fpt.com', // FPT Software
  'fujitsu.com', // Fujitsu
  'genpactexperience.com', // Genpact
  'getfishtank.ca', // Fishtank Consulting Corporation
  'getfishtank.com', // Fishtank Consulting
  'globant.com', // Globant
  'gradial.com', // Gradial
  'gravityglobal.com', // Gravity Global
  'habaneroconsulting.com', // Habanero Consulting Inc.
  'hakuhodo-ms.co.jp', // Hakuhodo Marketing Systems Inc.
  'hakuhodo.co.jp', // Hakuhodo Marketing Systems Inc.
  'horizontal.com', // Horizontal Digital
  'horizontalintegration.com', // Horizontal Digital
  'infinum.com', // Infinum
  'intellilink.co.jp', // NTT DATA INTELLILINK Corporation
  'interactivestrategies.com', // Interactive Strategies
  'iodigital.com', // iO
  'jp.fujitsu.com', // G-Search Ltd.
  'kogifi.com', // Kogif Corp.
  'konabos.com', // Konabos inc.
  'layeronemedia.com', // Layer One
  'lilt.com', // LILT
  'lumenalta.com', // Lumenalta
  'macaw.nl', // Macaw
  'mcdilldesign.com', // McDill
  'modea.com', // Modea
  'nishtechinc.com', // Nishtech
  'nttdata.com', // NTT DATA
  'omc.com', // Omnicom
  'onenorth.com', // One North
  'oshyn.com', // Oshyn
  'parlam.com', // Parlam
  'peplau.com.br', // MSQ DX
  'perficient.com', // Perficient
  'pixleration.com', // Pixleration
  'rbaconsulting.com', // RBA Consulting
  'rdadigital.com', // RDA Digital
  'relevancelab.com', // Relevance Lab, Inc
  'revspringinc.com', // RevSpring
  'rightpoint.com', // Genpact
  'sengo.com', // Sengo
  'setotech.com', // Independent Architect
  'silvertech.com', // SilverTech
  'siteimprove.com', // Siteimprove
  'slalom.com', // Slalom
  'taksatech.com', // Taksa Technology Solutions
  'tcs.com', // TCS
  'teaminternational.com', // TEAMCX
  'techguilds.com', // TechGuilds | Kajoo.ai
  'techxot.com', // Techxot
  'teksystems.com', // One North
  'thinkfresh.digital', // Think Fresh Digital
  'tomeganmarketing.com', // Tomegan Marketing Group
  'transperfect.com', // TransPerfect
  'unlockhealthnow.com', // Unlock Health
  'uxbee.nl', // uxbee
  'valtech.com', // Valtech
  'velir.com', // Velir
  'vercel.com', // Vercel
  'verndale.com', // Verndale
  'virtusa.com', // Virtusa
  'workato.com', // Workato
  'xcentium.com', // XCentium
  'zontdigital.com', // Zont Digital
];
