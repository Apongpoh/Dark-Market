import Link from 'next/link';
import moment from 'moment';
import styles from '../../styles/WalletBTCMessage.module.css';
import { getMessages } from '../../lib/client/messageAPI/messageapi';
import { getVendorInfo } from '../../lib/client/userAPI/userapi';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';


export default function Inbox() {

    const [currentUser, setCurrentUser] = useState({});
    const [vendorAndbuyer, setVendorAndbuyer] = useState({});
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(false);
    
    const { user } = isAuthenticated();
    
    const router = useRouter();

    const vendorId = globalThis.window?.location.pathname.split("/").pop();

    useEffect(() => setCurrentUser(user), []);

    useEffect(() => {
        getMessages()
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.error) {
                    setError({ error: data.error });
                } else {
                    setMessages(data);
                }
            });
    }, []);

    const conversations = messages.filter((m) => m.senderId === currentUser._id || m.receiverId === currentUser._id);

    useEffect(() => {
        const loadSingleUser = userId => {
            getVendorInfo(userId)
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        signOut();
                        router.push('/user-auth/signin');
                    }

                    if (data.msg && userId === 'undefined') {
                        setError({ error: data.msg });
                    } else {
                        setVendorAndbuyer(data);
                    }
                });
        };
        loadSingleUser(vendorId);
    }, [vendorId, error]);

    return (
        <div>
            <h1 style={{ color: '#a200d0' }}>All Conversations</h1>
            <ul className={styles.account}>
                {
                    conversations.map(sendermessage => (
                        <div key={sendermessage._id}>
                            <details className={styles.details}>
                                <summary className={styles.summary}><Link href={`/message/${currentUser._id}/${sendermessage.senderId}`}>{sendermessage.senderId === vendorId && vendorAndbuyer.username || currentUser._id === sendermessage.senderId && currentUser.username || "View username"}</Link></summary>
                                <ul className={styles.itemsAccount}>
                                    <h3 style={{ margin: '0 0 15px' }}>{sendermessage.subject}</h3>
                                    <p style={{ margin: '0 0 15px' }}>{sendermessage.text}</p>
                                    <span style={{ color: '#5e3c58' }}>{moment(sendermessage.createdAt).fromNow()}</span>
                                </ul>
                            </details>
                        </div>
                    ))
                }
            </ul>
        </div>
    );
}