import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Rank from "./rank";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>SinoQuiz!</title>
        <meta name="description" content="SinoQuiz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hello, world!
        </h1>

        <p className={styles.description}>
          This is quiz api of SinoCore. <br/>
          <Link href={'/rank'}>View the Leaderboard for TeaCon 2022.</Link>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/SinoCraftProject"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by&nbsp;
          <span>qyl27</span>
        </a>
      </footer>
    </div>
  )
}
