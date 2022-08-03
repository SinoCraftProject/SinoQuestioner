import styles from "../styles/Leaderboard.module.css";
import Head from "next/head";

export default function Rank() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Leaderboard - SinoQuiz</title>
                <meta name="description" content="SinoQuiz" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    TeaCon 2022 问答排行榜
                </h1>

                <p className={styles.description}>
                    还没有完成，去游戏里面看。
                </p>
            </main>
        </div>
    )
}
