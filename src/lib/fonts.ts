import localFont from 'next/font/local';

export const poppins = localFont({
  src: [
    {
      path: '../public/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/Poppins-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

// Noto Sans Devanagari for proper Hindi rendering
export const notoDevanagari = localFont({
  src: [
    {
      path: '../public/NotoSansDevanagari-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/NotoSansDevanagari-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-devanagari',
  display: 'swap',
  fallback: ['Noto Sans Devanagari', 'system-ui'],
});
