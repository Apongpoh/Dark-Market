import Menu from '../../../components/menu';
import Send from '../../../components/message/send';
import Inbox from '../../../components/message/conversations';
import Settings from '../../../components/message/settings';
import styles from '../../../styles/WalletBTCMessage.module.css';
import { useState } from 'react';


export default function Message() {

    const [send, setSend] = useState(true);
    const [conversations, setConversations] = useState(false);
    const [settings, setSettings] = useState(false);
    const [colors, setColors] = useState({
        color1: 'blue',
        color2: 'green',
        color3: 'green',
    });

    const { color1, color2, color3 } = colors;

    const handleSend = event => {
        event.preventDefault();

        setSend(true);
        setColors({
            color1: 'blue',
            color2: 'green',
            color3: 'green',
        });
        setConversations(false);
        setSettings(false);
    };

    const handleInbox = event => {
        event.preventDefault();

        setConversations(true);
        setColors({
            color1: 'green',
            color2: 'blue',
            color3: 'green'
        });
        setSend(false);
        setSettings(false);
    };

    const handleSettings = event => {
        event.preventDefault();

        setSettings(true);
        setColors({
            color1: 'green',
            color2: 'green',
            color3: 'blue',
        });
        setSend(false);
        setConversations(false);
    };

    return (
        <div>
            <Menu />
            <div className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.headingAccount}>
                        <h3 style={{ color: '#a200d0' }}>Messages and Orders</h3>
                    </div>
                    <ul className={styles.heading}>
                        <li className={styles.items} style={{ color: `${color1}`, cursor: 'pointer' }} onClick={handleSend}>Send</li>
                        <li className={styles.items} style={{ color: `${color2}`, cursor: 'pointer' }} onClick={handleInbox}>Conversations</li>
                        <li className={styles.items} style={{ color: `${color3}`, cursor: 'pointer' }} onClick={handleSettings}>Settings</li>
                    </ul>
                </div>
                <div className={styles.right}>
                    <ul className={styles.heading}>
                        <li className={styles.items}>{send && <Send />}</li>
                        <li className={styles.items}>{conversations && <Inbox />}</li>
                        <li className={styles.items}>{settings && <Settings />}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}