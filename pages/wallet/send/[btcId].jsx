import Menu from '../../../components/menu';
import styles from '../../../styles/Btc.module.css';
import { fiatToBitcoin } from 'bitcoin-conversion';
import { getBtc } from '../../../lib/client/walletAPI/btcapi';
import { isAuthenticated, signOut } from '../../../lib/client/auth';
import { ReactQrCode } from '@devmehq/react-qr-code';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { withdrawBtc, withdrawBtcFromMultisigVendor } from '../../../lib/client/walletAPI/btcapi';


export default function Wallet() {

    const [currentUser, setCurrentUser] = useState({});
    const [btc, setBtc] = useState({});
    const [isCopied, setIsCopied] = useState(false);
    const [btcFiat, setBtcFiat] = useState();
    const [values, setValues] = useState({
        sendToAddress: '',
        amount: Number(0 / 100000000).toFixed(8),
        passphrase: '',
        vendorPassKey: '',
        mediatorPassKey: '',
        loading: false,
        success: false,
        error: '',
        redirectToProfile: false,
        formData: new FormData()
    });

    const { user, token } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const btcId = globalThis.window?.location.pathname.split("/").pop();

    let { sendToAddress, amount, passphrase, vendorPassKey, mediatorPassKey, success, loading, error, formData } = values;

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    useEffect(() => {
        const loadSingleBtc = btcId => {
            getBtc(btcId)
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        router.push('/user-auth/signin')
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

    useEffect(() => {
        const conv = async () => {
            const paymentInBtcFromUsd = await fiatToBitcoin('200', 'USD');
            setBtcFiat(paymentInBtcFromUsd);
        };

        conv();
    }, []);

    const clickSubmit = event => {
        event.preventDefault();

        setValues({ ...values, error: '', loading: true });

        withdrawBtc(btcId, currentUser._id, token, formData)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }
                
                if (data.msg) {
                    setValues({ ...values, error: data.msg });
                } else {
                    setValues({
                        ...values,
                        sendToAddress: '',
                        amount: '',
                        passphrase: '',
                        loading: false,
                        success: true,
                        error: false,
                    });
                }
            });
    };

    const clickSubmitVendor = event => {
        event.preventDefault();

        setValues({ ...values, error: '', loading: true });

        withdrawBtcFromMultisigVendor(btcId, currentUser._id, token, formData)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }
                
                if (data.msg) {
                    setValues({ ...values, error: data.msg });
                } else {
                    setValues({
                        ...values,
                        sendToAddress: '',
                        amount: '',
                        vendorPasskey: '',
                        mediatorPasskey: '',
                        loading: false,
                        success: true,
                        error: false,
                    });
                }
            });
    };

    const copyText = (entryText) => {
        navigator.clipboard.writeText(entryText);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 5000);
    };

    const showError = () => (
        <div style={{ display: error ? "" : "none", fontSize: 'large', color: 'red', margin: '8px', padding: '5px', borderRadius: '5px', backgroundColor: 'rgba(135, 35, 12, 0.164)' }}>
            <span>{error}</span>
        </div>
    );

    const showLoading = () => (
        loading && <h4 style={{ color: 'rgba(0, 0, 0, 0.6)' }}><i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span></h4>
    );

    const showSuccess = () => (
        <div className={styles.showSuccess} style={{ display: success ? '' : 'none', fontSize: 'smaller', color: 'red', margin: '8px', padding: '5px', borderRadius: '5px', backgroundColor: 'rgba(135, 35, 12, 0.164)' }}>
            Success!
        </div>
    );

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
                {
                    currentUser.role === 0 ?
                        <div className={styles.send}>
                            <h2 style={{ margin: '0 0 10px', textAlign: 'center', color: 'rgba(0, 0, 0, 0.7)' }}>Withdrawal Payment / Vendor bond Payment</h2>
                            <p style={{ margin: '0 0 10px', textAlign: 'center', color: 'rgba(0, 0, 0, 0.7)' }}>Send to address of your choice to withdraw funds.</p>
                            <div style={{ textAlign: 'center' }}>
                                <p className={styles.tooltip} style={{ margin: '0 0 10px', color: 'rgba(0, 0, 0, 0.7)' }}>
                                    Send exactly $200 USD vendor bond ({btcFiat?.toFixed(8)} BTC) to <strong style={{ fontSize: '15px' }} onClick={() => copyText('bc1qs3ss3sk4we64ap5cqlvvqn87ureyu0lpyaekx2')}>bc1qs3ss3sk4we64ap5cqlvvqn87ureyu0lpyaekx2</strong> to become a vendor.
                                    <span className={styles.tooltiptext} style={{ fontSize: '15px' }}>{isCopied ? 'Copied to clipboard!' : 'Copy'}</span>
                                </p>
                            </div>

                            <div className={styles.alert}>
                                {showError()}
                                {showLoading()}
                                {showSuccess()}
                            </div>

                            <form className={styles.authForm} onSubmit={clickSubmit}>
                                <div className={styles.formItem}>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        placeholder='Recipient Address'
                                        value={sendToAddress}
                                        onChange={handleChange('sendToAddress')}
                                    />
                                </div>

                                <div className={styles.formItem}>
                                    <input
                                        className={styles.formInput}
                                        type="Number"
                                        step={0.00000001}
                                        min={0}
                                        value={amount}
                                        onChange={handleChange('amount')}
                                    />
                                </div>

                                <div className={styles.formItem}>
                                    <input
                                        className={styles.formInput}
                                        type="password"
                                        placeholder='Passphrase'
                                        value={passphrase}
                                        onChange={handleChange('passphrase')}
                                    />
                                </div>

                                <div className={styles.formItem}>
                                    <button className={styles.formInput} style={{ color: 'green', cursor: 'pointer' }}><strong>Send</strong></button>
                                </div>
                            </form>
                        </div> :
                        <div className={styles.send}>
                            <h2 style={{ margin: '0 0 10px', textAlign: 'center', color: 'rgba(0, 0, 0, 0.7)' }}>Escrow Withdrawal Payment</h2>

                            <div className={styles.alert}>
                                {showError()}
                                {showLoading()}
                                {showSuccess()}
                            </div>

                            <form className={styles.authForm} onSubmit={clickSubmitVendor}>
                                <div className={styles.formItem}>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        placeholder='Recipient Address'
                                        value={sendToAddress}
                                        onChange={handleChange('sendToAddress')}
                                    />
                                </div>

                                <div className={styles.formItem}>
                                    <input
                                        className={styles.formInput}
                                        type="Number"
                                        step={0.00000001}
                                        min={0}
                                        value={amount}
                                        onChange={handleChange('amount')}
                                    />
                                </div>

                                <div className={styles.formItem}>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        placeholder='Vendor passkey'
                                        value={vendorPassKey}
                                        onChange={handleChange('vendorPassKey')}
                                    />
                                </div>

                                <div className={styles.formItem}>
                                    <input
                                        className={styles.formInput}
                                        type="text"
                                        placeholder='Mediator passkey'
                                        value={mediatorPassKey}
                                        onChange={handleChange('mediatorPassKey')}
                                    />
                                </div>

                                <div className={styles.formItem}>
                                    <button className={styles.formInput} style={{ color: 'green', cursor: 'pointer' }}><strong>Send</strong></button>
                                </div>
                            </form>
                        </div>
                }
            </div>
        </div>
    );
}