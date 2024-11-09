import Account from '../components/walletbtc/accounts';
import Link from 'next/link';
import Menu from '../components/menu';
import Receive from '../components/walletbtc/receive';
import Settings from '../components/walletbtc/settings';
import styles from '../styles/WalletBTCMessage.module.css';
import { getBtcs } from '../lib/client/walletAPI/btcapi';
import { isAuthenticated } from '../lib/client/auth';
import { useEffect, useState } from 'react';


export default function Wallet() {

    const [currentUser, setCurrentUser] = useState({});
    const [account, setAccount] = useState(true);
    const [receive, setReceive] = useState(false);
    const [send, setSend] = useState(false);
    const [settings, setSettings] = useState(false);
    const [colors, setColors] = useState({
        color1: 'blue',
        color2: 'green',
        color3: 'green',
        color4: 'green',
    });
    const [btcs, setBtcs] = useState([]);

    const { color1, color2, color3, color4 } = colors;

    const { user } = isAuthenticated();

    useEffect(() => setCurrentUser(user), []);

    const handleAccount = event => {
        event.preventDefault();

        setAccount(true);
        setColors({
            color1: 'blue',
            color2: 'green',
            color3: 'green',
            color4: 'green'
        });
        setReceive(false);
        setSend(false);
        setSettings(false);
    };

    const handleReceive = event => {
        event.preventDefault();

        setReceive(true);
        setColors({
            color1: 'green',
            color2: 'blue',
            color3: 'green',
            color4: 'green'
        });
        setAccount(false);
        setSend(false);
        setSettings(false);
    };

    const handleSend = event => {
        event.preventDefault();

        setSend(true);
        setColors({
            color1: 'green',
            color2: 'green',
            color3: 'blue',
            color4: 'green'
        });
        setAccount(false);
        setReceive(false);
        setSettings(false);
    };

    const handleSettings = event => {
        event.preventDefault();

        setSettings(true);
        setColors({
            color1: 'green',
            color2: 'green',
            color3: 'green',
            color4: 'blue'
        });
        setAccount(false);
        setReceive(false);
        setSend(false);
    };

    const loadBtcs = () => {
        getBtcs().then(data => {
            if (data.msg) {
                setBtcs({ error: data.msg });
            } else {
                setBtcs(data);
            }
        });
    };

    useEffect(() => loadBtcs(), []);

    return (
        <div>
            <Menu />
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.headingAccount}>
                        <h3 style={{ color: '#a200d0' }}>Manage Wallet</h3>
                        <p>Wallet accounts: {btcs.filter(btc => btc.user === currentUser._id).length}</p>
                    </div>
                    <ul className={styles.heading}>
                        <li className={styles.items} style={{ color: `${color1}`, cursor: 'pointer' }} onClick={handleAccount}>Account</li>
                        {currentUser.role === 0 && <li className={styles.items} style={{ color: `${color2}`, cursor: 'pointer' }} onClick={handleReceive}>Receive</li>}
                        <li className={styles.items} style={{ color: `${color3}`, cursor: 'pointer' }} onClick={handleSend}>
                            <ul className={styles.dropdowm}>
                                <li className={styles.listItem}>Send</li>
                                <ul className={styles.dropdownContent}>
                                    {
                                        btcs.map(btc => (
                                            (btc.user === currentUser._id) && (<li style={{ color: 'blueviolet' }} key={btc._id} value={btc._id}>
                                                <Link href={`/wallet/send/${btc._id}`}>{btc.label}</Link>
                                            </li>)
                                        ))
                                    }
                                </ul>
                            </ul>
                        </li>
                        <li className={styles.items} style={{ color: `${color4}`, cursor: 'pointer' }} onClick={handleSettings}>Settings</li>
                    </ul>
                </div>
                <div className={styles.right}>
                    <ul className={styles.heading}>
                        <li className={styles.items}>{account && <Account />}</li>
                        {currentUser.role === 0 && <li className={styles.items}>{receive && <Receive />}</li>}
                        <li className={styles.items}>
                            {
                                send && <div>
                                    <h1 style={{ color: '#a200d0', margin: '0 0 10px' }}>Withdrawal Payment</h1>
                                    <p>No wallet account selected.</p>
                                </div>
                            }
                        </li>
                        <li className={styles.items}>{settings && <Settings />}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}