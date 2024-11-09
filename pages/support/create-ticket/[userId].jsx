import Menu from '../../../components/menu';
import styles from '../../../styles/Ticket.module.css';
import { createTicket } from '../../../lib/client/ticketAPI/ticketapi';
import { isAuthenticated, signOut } from '../../../lib/client/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';


export default function CreateTicket() {

    const [currentUser, setCurrentUser] = useState({});
    const [values, setValues] = useState({
        subject: "",
        reason: "",
        message: "",
        error: "",
        loading: false,
        success: false,
        formData: new FormData()
    });

    const { subject, message, loading, error, success, formData } = values;

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

        setValues({ ...values, error: '', loading: true, success: '' });

        createTicket(currentUser._id, token, formData)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }
                
                if (data.msg) {
                    setValues({ ...values, error: data.msg, loading: false }); 
                } else {
                    setValues({ ...values, subject: '', message: '', loading: '', error: '', success: true });
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

    const showSuccess = () => (
        <div
            className={styles.showError}
            style={{ display: success ? "" : "none" }}
        >
            <span>{success}</span>
        </div>
    );

    return (
        <div>
            <Menu />
            <div className={styles.container}>
                <h2>Create Ticket</h2>
                <p style={{ color: "green", padding: '0 0 15px' }}>Check the FAQ before submitting a ticket. It might have your answer!</p>

                <div style={{ padding: '0 0 10px' }}>
                    {showLoading()}
                    {showError()}
                    {showSuccess()}
                </div>

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
                        <p style={{ position: 'relative', left: '23%', zIndex: '-1' }}>{subject.length}/50</p>
                    </div>
                    <div className={styles.formItem}>
                        <select className={styles.messageInput} onChange={handleChange('reason')}>
                            {
                                ['Other', 'Deposit/Withdrawal', 'Account Recovery', 'Report Bug', 'Report Scammer'].map((r, i) => (
                                    <option key={i} value={r}>{r}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={styles.formItem}>
                        <textarea
                            className={styles.messageInput}
                            rows="5"
                            type="textArea"
                            maxLength={500}
                            value={message}
                            onChange={handleChange('message')}
                            placeholder='Message...'
                        />
                        <p style={{ position: 'relative', left: '23%', zIndex: '-1' }}>{message.length}/500</p>
                    </div>
                    <div className={styles.formItem}>
                        <button style={{ padding: '5px', color: 'red', width: '50%', cursor: 'pointer' }}>Send</button>
                    </div>
                </form>

            </div>
        </div>
    );
}