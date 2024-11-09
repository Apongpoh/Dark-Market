import axios from "axios";
import styles from '../styles/Captcha.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Captcha() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');

  const router = useRouter();

  // get setText value and pass it to text
  useEffect(() => {
    axios.get('api/captcha')
      .then(res => { setText(res.data) })
      .catch(err => { throw new Error(`Fail to fetch captcha text: ${err}`) });
  }, []);

  // get setInput and pass it to input
  const handleInput = event => setInput(event.target.value);

  const clickSubmit = event => {
    event.preventDefault();

    if (input === text) {
      router.push('/user-auth/signup');
    } else {
      router.refresh();
    }
  };

  return (
    <div className={styles.captcha} >
      <h4 className={styles.captchaHeading}>
        Complete the captcha challenge, it protects your site from spam and abuse. Anti-Phishing: Make sure the link across matches the link of your url bar. If there is no .onion link across your captcha, you are on a phishing site.
      </h4>
      <div className={styles.captchaBackground}>
        <p className={styles.onionLink}>bsmzttfmbmvv4zoqjm264ws5b4jqwpzvvaicu3yqbl47d7euik35paid.onion</p>
        <p className={styles.captchaText}>{text}</p>

        <input className={styles.captchaInput} type="text" value={input} placeholder="Enter captcha" onInput={handleInput} name="text"></input>
        <span className={styles.captchaAlert}>Case sensitive!</span>

        <button className={styles.submitButton} onClick={clickSubmit} type="submit">Submit</button>
        <button className={styles.refreshButton} onClick={() => router.refresh()} type="submit">Refresh</button>
      </div>
    </div >
  );
}