import Head from 'next/head'
import Navbar from '../Navbar/navbar'

export default function layout({title, children, showLogin, setShowLogin, counter}) {
  return (
    <>
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/icon.svg" />
        </Head>
        <Navbar showLogin={showLogin} setShowLogin={setShowLogin} counter={counter}/>
        {children}
    </>
  )
}
