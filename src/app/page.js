"use client";
import { useState } from "react";

import styles from "@/app/styling/landingP.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>My Personal Website</h1>
        {isLoading && <div className={styles.skeleton}>Loading Form...</div>}
        <iframe
          src="https://dashboard.mailerlite.com/forms/1319105/145608201780331689/share"
          className={styles.newsletter}
          scrolling="no"
          style={{
            display: isLoading ? "none" : "block",
          }}
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </main>
      <footer className={styles.footer}>
        <h2>footer section.</h2>
      </footer>
    </div>
  );
}
