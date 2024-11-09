import styles from '../../styles/Manageuser.module.css';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { update, updatePGP } from '../../lib/client/userAPI/userapi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Pgp() {

    const [currentUser, setCurrentUser] = useState({});
    const [values, setValues] = useState({
        pgp: '',
        error: '',
        success: false,
        loading: false
    });

    const { pgp, error, success, loading } = values;

    const { user, token } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickPGP = event => {

        event.preventDefault();

        const { pgp } = values;

        setValues({ ...values, error: false, loading: true });

        updatePGP(currentUser._id, token, { pgp })
            .then((data) => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setValues({
                        ...values,
                        error: data.msg,
                        loading: false
                    });
                } else {
                    update(data, () => {
                        setValues({
                            ...values,
                            pgp: data.pgp,
                            success: true
                        });
                    });
                }
            });
    }

    const showError = () => (
        <div style={{ display: error ? "" : "none", fontSize: 'smaller', color: 'red', margin: '5px' }}>
            <span>{error}</span>
        </div>
    );

    const showLoading = () => (
        loading && <h4 style={{ margin: '5px', textAlign: 'center', color: 'rgba(0, 0, 0, 0.6)' }}><i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span></h4>
    );

    const showSuccess = () => (
        <div className={styles.showSuccess} style={{ display: success ? '' : 'none', fontSize: 'smaller', color: 'red', margin: '5px' }}>
            pgp public key updated
        </div>
    );

    return (
        <div className={styles.pgp}>
            <h4 className={styles.pgpForm} style={{ color: 'rgba(7, 8, 9, 0.755)' }}>PGP</h4>

            {showError()}
            {showLoading()}
            {showSuccess()}

            <form className={styles.pgpForm}>
                <label style={{ color: 'green' }}>Public key:</label>
                <textarea
                    className={styles.pgpKey}
                    value={pgp}
                    onChange={handleChange('pgp')}
                    placeholder={currentUser.pgp}
                />
            </form>

            <button type="button" onClick={clickPGP} style={{ padding: '3px', cursor: 'pointer', color: 'green' }}>Save changes</button>
        </div>
    );
}