import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import PathnameWrapper from 'components/PathnameWrapper';
import Customprovider from '../redux/CustomProvider';
import Script from 'next/script';
import Image from 'next/image';
import { GoogleTagManager } from '@next/third-parties/google';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.HomePage);

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-Inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic']
});

const currency = localFont({
  src: [
    {
      path: '../../public/assets/currency-symbol-v2.otf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-currency'
});
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="faPNTY-av9Kw-FQsjD6DplLzKbaUP3uViHm5vogBmM4"
        />
        <Script id="gtm-init" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NDT6D9FX');
        `}
        </Script>
      </head>
      <Script id="clarity-script" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "or4akfzmdn");
        `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XQXSL09C0D"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-XQXSL09C0D');
        `}
      </Script>


      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '589096380523529'); 
          fbq('track', 'PageView');
        `}
      </Script>
      <body className={`${inter.variable} ${currency.variable}`}>
        <GoogleTagManager gtmId="GTM-NDT6D9FX" />
        <noscript>
          {' '}
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NDT6D9FX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          >
          </iframe>
        </noscript>
        <noscript>
          <Image
            height={1}
            width={1}
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=589096380523529&ev=PageView&noscript=1"
            alt="Facebook tracking pixel"
          />
        </noscript>
        <Customprovider>
          <PathnameWrapper>{children}</PathnameWrapper>
        </Customprovider>
      </body>
    </html>
  );
}
