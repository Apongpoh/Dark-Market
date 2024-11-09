import styles from '../../styles/WalletBTCMessage.module.css';
import { createMessage } from '../../lib/client/messageAPI/messageapi';
import { getVendorInfo } from '../../lib/client/userAPI/userapi';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';


export default function Send() {
    const [currentUser, setCurrentUser] = useState({});
    const [vendorAndbuyer, setVendorAndbuyer] = useState({});
    const [values, setValues] = useState({
        subject: "",
        text: "",
        error: "",
        loading: false,
        formData: new FormData()
    });

    const { subject, text, loading, error, formData } = values;

    const { user, token } = isAuthenticated();

    const router = useRouter();

    const vendorId = globalThis.window?.location.pathname.split("/").pop();

    useEffect(() => setCurrentUser(user), []);

    const handleChange = name => event => {
        const value = event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    }

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

    const clickSubmit = event => {
        event.preventDefault();

        setValues({ ...values, error: '', loading: true });

        createMessage(currentUser._id, vendorId, token, formData)
            .then(data => {

                if (data.msg === 'Invalid signature or expired. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setValues({ ...values, error: data.msg, loading: false });


                } else {
                    setValues({ ...values, subject: '', text: '', loading: '', error: '' });
                    router.reload();
                }

            });
    };

    const showError = () => (
        <div
            className={styles.showError}
            style={{ display: error ? "" : "none" }}
        >
            <span>{error}</span>
        </div>
    );

    const showLoading = () => (
        loading && (
            <h4 className={styles.showLoading}>
                <i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span>
            </h4>)
    );

    return (

        <div>
            <h1 style={{ color: '#a200d0' }}>Send a new message</h1>

            <div className={styles.accountForm}>

                {showLoading()}
                {showError()}

                <p style={{ padding: '0 0 10px' }}>Send to: <strong>{vendorAndbuyer.username || "Loading..."}</strong></p>

                <form onSubmit={clickSubmit}>
                    <div className={styles.formItem}>
                        <input
                            className={styles.messageInput}
                            type="text"
                            maxLength={50}
                            value={subject}
                            onChange={handleChange('subject')}
                            placeholder='Subject'
                        />
                        <p style={{ textAlign: 'end' }}>{subject.length}/50</p>
                    </div>
                    <div className={styles.formItem}>
                        <textarea
                            className={styles.messageInput}
                            rows="15"
                            type="textArea"
                            maxLength={5000}
                            value={text}
                            onChange={handleChange('text')}
                            placeholder='Message...'
                        />
                        <p style={{ textAlign: 'end' }}>{text.length}/5000</p>
                    </div>
                    <div className={styles.formItem}>
                        <button style={{ padding: '5px', color: 'red', width: '100%', cursor: 'pointer' }}>Send</button>
                    </div>
                </form>
            </div>
        </div >
    );
}