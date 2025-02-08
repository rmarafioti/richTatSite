"use client";
import { useState } from "react";
import ContactForm from "@/app/components/ContactForm";

import styles from "@/app/styling/landingP.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.header}>My Personal Website</h1>
        <ContactForm />
        <div className={styles.newsContainer}>
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
        </div>
      </main>
      <footer className={styles.footer}>
        <h2>footer section.</h2>
      </footer>
    </div>
  );
}
