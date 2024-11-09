import styles from '../../styles/WalletBTCMessage.module.css';
import { getBtcs } from '../../lib/client/walletAPI/btcapi';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { ReactQrCode } from '@devmehq/react-qr-code';
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";


export default function Receive() {

    const [currentUser, setCurrentUser] = useState({});
    const [btcs, setBtcs] = useState([]);
    const [value, setValue] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const { user } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const loadBtcs = () => {
        getBtcs().then(data => {

            if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                signOut();
                router.push('/user-auth/signin');
            }

            if (data.msg) {
                setError({ error: data.msg });
            } else {
                setBtcs(data);
            }
        });
    };

    useEffect(() => loadBtcs(), []);

    const handleChange = event => setValue(event.target.value);

    const copyText = (entryText) => {
        navigator.clipboard.writeText(entryText);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 5000);
    };

    return (
        <div>
            <h1 style={{ color: '#a200d0', margin: '0 0 10px' }}><strong>Deposit Payment</strong></h1>

            <div className={styles.receive}>

                <select className={styles.select} onChange={handleChange}>
                    <option>
                        Select Wallet Account
                    </option>
                    {
                        btcs.map(btc => (
                            (btc.user === currentUser._id) && (<option key={btc._id} value={btc._id}>
                                {btc.label}
                            </option>)
                        ))
                    }
                </select>

                <div>
                    {
                        btcs.map(btc => (
                            (btc.user === currentUser._id) && (btc._id === value) && (<div className={styles.qrcode} key={btc._id}>
                                <ReactQrCode value={btc.address} size={200} />
                            </div>)
                        ))
                    }
                </div>

                <div>
                    {
                        btcs.map(btc => (
                            (btc.user === currentUser._id) && (btc._id === value) && (

                                <p className={styles.tooltip} onClick={() => copyText(btc.address)} style={{ cursor: 'pointer' }} key={btc._id}>
                                    <strong>{btc.address}</strong>
                                    <span className={styles.tooltiptext} style={{ fontSize: '15px' }}>{isCopied ? 'Copied to clipboard!' : 'Copy'}</span>
                                </p>
                            )
                        ))
                    }
                </div>

            </div>
        </div>
    );
}