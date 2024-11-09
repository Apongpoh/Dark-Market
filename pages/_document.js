import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <link rel='shortcut icon' href='/favicon/terre.ico'></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
    </Html>
  )
}
