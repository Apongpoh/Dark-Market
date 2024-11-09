import Menu from '../../../components/menu';
import styles from '../../../styles/Btc.module.css';
import { getBtc } from '../../../lib/client/walletAPI/btcapi';
import { ReactQrCode } from '@devmehq/react-qr-code';
import { signOut } from '../../../lib/client/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function BTC() {

    const [btc, setBtc] = useState({});
    const [error, setError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const btcId = globalThis.window?.location.pathname.split("/").pop();

    const router = useRouter();

    useEffect(() => {
        const loadSingleBtc = btcId => {
            getBtc(btcId)
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        signOut();
                        router.push('/user-auth/signin');
                    }

                    if (data.msg && btcId === 'undefined') {
                        setError({ error: data.msg });
                    } else {
                        setBtc(data);
                    }
                });
        };
        loadSingleBtc(btcId);
    }, [btcId, error]);

    const copyText = (entryText) => {
        navigator.clipboard.writeText(entryText);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 5000);
    };

    return (
        <div>
            <Menu />
            <div className={styles.container}>
                <div className={styles.address}>
                    <div className={styles.addressLeft}>
                        <h1 style={{ color: 'rgba(10, 40, 200, 0.5)' }}>Address</h1>
                        <p className={styles.tooltip} style={{ fontSize: '20px' }} onClick={() => copyText(btc.address)}>
                            {btc.address}
                            <span className={styles.tooltiptext} style={{ fontSize: '15px' }}>{isCopied ? 'Copied to clipboard!' : 'Copy'}</span>
                        </p>
                    </div>
                    <div className={styles.addressRight}>
                        <ReactQrCode value={btc.address} size={150} />
                    </div>
                </div>
                <div className={styles.btcinfo}>
                    <div className={styles.rowBTCR}>
                        <h2>RECEIVED</h2>
                        <p style={{ color: 'black', fontSize: 'larger', fontWeight: 'bolder' }}>{btc.total_received && btc.total_received / 100000000} BTC</p>
                    </div>
                    <div className={styles.rowBTCS}>
                        <h2>SENT</h2>
                        <p style={{ color: 'black', fontSize: 'larger', fontWeight: 'bolder' }}>{btc.total_sent && btc.total_sent / 100000000} BTC</p>
                    </div>
                    <div className={styles.rowBTCB}>
                        <h2>BALANCE</h2>
                        <p style={{ color: 'black', fontSize: 'larger', fontWeight: 'bolder' }}>{btc.balance && btc.balance / 100000000} BTC</p>
                    </div>
                    <div className={styles.rowBTCUB}>
                        <h2>UNCONFIRMED BALANCE</h2>
                        <p style={{ color: 'black', fontSize: 'larger', fontWeight: 'bolder' }}>{btc.unconfirmed_balance && btc.unconfirmed_balance / 100000000} BTC</p>
                    </div>
                    <div className={styles.rowBTCFB}>
                        <h2>FINAL BALANCE</h2>
                        <p style={{ color: 'black', fontSize: 'larger', fontWeight: 'bolder' }}>{btc.final_balance && btc.final_balance / 100000000} BTC</p>
                    </div>
                </div>
                <div className={styles.transactions}>
                    <h2 style={{ margin: '0 0 10px' }}>{btc.n_tx} Transactions ({btc.unconfirmed_n_tx} unconfirmed)</h2>
                    <p style={{ margin: '0 0 10px', color: 'grey' }}>For privacy and security reasons, only the last five transactions are shown.</p>
                    <div>
                        {btc.txrefs?.slice(0, 5).map(txr => (
                            <div key={txr.tx_hash}>
                                <div className={styles.txItem}>
                                    <h3 className={styles.tooltip} onClick={() => copyText(txr.tx_hash)}>
                                        {txr.tx_hash}
                                        <span className={styles.tooltiptext} style={{ fontSize: '15px' }}>{isCopied ? 'Copied to clipboard!' : 'Copy'}</span>
                                    </h3>
                                    <p><strong style={{ color: 'grey' }}>STATUS</strong>  {txr.confirmations} confirmations</p>
                                    <p><strong style={{ color: 'grey' }}>TRANSACTION VALUE</strong>  {txr.value && txr.value / 100000000} BTC</p>
                                    <p><strong style={{ color: 'grey' }}>DOUBLE SPEND</strong>  {txr.double_spend ? 'Yes' : 'No'}</p>
                                    <p><strong style={{ color: 'grey' }}>FEE SAVED</strong>  This transaction saves 36% on fees</p>
                                    <p><strong style={{ color: 'grey' }}>CONFIRMED DATE</strong>  {txr.confirmed}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}