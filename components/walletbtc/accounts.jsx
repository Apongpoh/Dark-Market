import Link from 'next/link';
import moment from 'moment';
import styles from '../../styles/WalletBTCMessage.module.css';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { createBtcs, getBtcs, createMultisig } from '../../lib/client/walletAPI/btcapi';


export default function Account() {

    const [currentUser, setCurrentUser] = useState({});
    const [btcs, setBtcs] = useState([]);
    const [values, setValues] = useState({
        label: "",
        passphrase: "",
        confirmPassphrase: "",
        error: "",
        loading: false,
        formData: new FormData()
    });

    const { label, passphrase, confirmPassphrase, loading, error, formData } = values;

    const { user, token } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const handleChange = name => event => {
        const value = event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    }

    const clickSubmit = event => {
        event.preventDefault();

        setValues({ ...values, error: '', loading: true });

        createBtcs(currentUser._id, token, formData)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setValues({ ...values, error: data.msg, loading: false });
                } else {
                    setValues({ ...values, label: '', password: '', confirmPassword: '', error: '' });
                    router.reload();
                }
            });
    };

    const clickSubmitMultisig = event => {
        event.preventDefault();

        setValues({ ...values, error: '', loading: true });

        createMultisig(currentUser._id, token, formData)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }
                
                if (data.msg) {
                    setValues({ ...values, error: data.msg, loading: false });
                } else {
                    setValues({ ...values, label: '', password: '', confirmPassword: '', error: '' });
                    router.reload();
                }
            });
    };

    const loadBtcs = () => {
        getBtcs().then(data => {
            if (data.msg) {
                setBtcs({ error: data.msg, loading: false });
            } else {
                setBtcs(data);
            }
        });
    };

    useEffect(() => loadBtcs(), []);

    const walletAForm = () => (
        <form className={styles.form}>

            <input
                className={styles.walletInput}
                type="text"
                minLength={3}
                maxLength={15}
                value={label}
                onChange={handleChange('label')}
                placeholder='Label'
            />

            {
                currentUser.role === 0 && <input
                    className={styles.walletInput}
                    type="password"
                    value={passphrase}
                    onChange={handleChange('passphrase')}
                    placeholder='Passphrase'
                />
            }

            {
                currentUser.role === 0 && <input
                    className={styles.walletInput}
                    type="password"
                    value={confirmPassphrase}
                    onChange={handleChange('confirmPassphrase')}
                    placeholder='Re-enter passphrase'
                />
            }

            {
                currentUser.role === 0 ? <button className={styles.walletInput} type='buttom' onClick={clickSubmit} style={{ color: 'green', cursor: 'pointer' }} title='Generate new adddress'>Create Wallet Account</button> : <button className={styles.walletInput} type='buttom' onClick={clickSubmitMultisig} style={{ color: 'green', cursor: 'pointer' }} title='Generate new address'>Create Wallet Account</button>
            }

        </form>
    );

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
            <h1 style={{ color: '#a200d0' }}><strong>Wallet Accounts</strong></h1>

            <hr style={{ margin: '0 0 20px' }}></hr>

            <div className={styles.accountForm}>
                {showLoading()}
                {showError()}
                {walletAForm()}
            </div>

            <hr style={{ margin: '0 0 20px' }}></hr>

            <ul className={styles.account}>
                {
                    btcs.map(btc => (
                        (btc.user === currentUser._id) && (<div key={btc._id}>
                            <details className={styles.details}>
                                <summary className={styles.summary}>{btc.label}</summary>
                                <ul className={styles.itemsAccount}>
                                    <li style={{ display: 'flex' }}><span style={{ fontSize: 'larger', color: 'rgba(10, 40, 200, 0.5)' }}>Id:</span> <span style={{ padding: '0 24.5%', color: '#5e3c58' }}>{btc._id}</span></li>
                                    <li style={{ display: 'flex' }}><span style={{ fontSize: 'larger', color: 'rgba(10, 40, 200, 0.5)' }}>Address:</span> <span className={styles.btcaddr} style={{ padding: '0 19.8%' }}>{btc.address}</span></li>
                                    <li style={{ display: 'flex' }}><span style={{ fontSize: 'larger', color: 'rgba(10, 40, 200, 0.5)' }}>Created:</span> <span style={{ padding: '0 19.7%', color: '#5e3c58' }}>{moment(btc.createdAt).fromNow()}</span></li>
                                    <li style={{ display: 'flex' }}><span style={{ fontSize: 'larger', color: 'rgba(10, 40, 200, 0.5)' }}><Link href={`/wallet/transactions/${btc._id}`}>Account balance and transactions</Link></span></li>
                                </ul>
                            </details>
                        </div>)
                    ))
                }
            </ul>
        </div>
    );
}