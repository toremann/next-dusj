import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(
    `https://rest.fjordkraft.no/pricecalculator/priceareainfo/private/1001`
  );
  const data = await res.json();

  console.log(data);

  // Pass data to the page via props
  return { props: { data } };
}

export default function Home({ data }) {

  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);  

  const literPerMinutt = 16 
  const literPerSekund = 0.26

  const kWhPerMinutt = 0.56
  const kWhPerSekund = 0.009
  const kWhPerMillisekund = 0.00009

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.calculator}>
        <h1>Dusj kalkulator:</h1>
        <h1 className={styles.title}>{(data.price / 100).toFixed(2)} NOK</h1>
        <h1 className={styles.title}>{(time * kWhPerMillisekund * (data.price / 1000)).toFixed(3)} NOK</h1>
        <h1 className={styles.title}>{((Math.floor((time / 1000) % 60)) * kWhPerSekund).toFixed(3)} kWh</h1>

        <h1>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:{("0" + ((time / 10) % 100)).slice(-2)}</h1>
        
        <button className={styles.button} onClick={() => setRunning(true)}>Start</button>
        <button className={styles.button} onClick={() => setRunning(false)}>Stop</button>
        <button className={styles.button} onClick={() => setTime(0)}>Reset</button>   
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
