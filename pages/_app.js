import { IBM_Plex_Sans } from 'next/font/google'

import '../styles/globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

function MyApp({ Component, pageProps }) {
  return (
    <>
      <style
        jsx
        global
      >{`
        html {
          font-family: ${ibmPlexSans.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
