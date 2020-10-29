import Head from 'next/head'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <title>Laser Tag -jäsenpelit</title>
      </Head>
      {children}
    </>
  )
}
