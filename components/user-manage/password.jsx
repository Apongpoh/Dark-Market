import styles from '../../styles/Manageuser.module.css';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { update, updatePassword } from '../../lib/client/userAPI/userapi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Password() {

    const [currentUser, setCurrentUser] = useState({});
    const [values, setValues] = useState({
        password: '',
        error: '',
        success: false,
        loading: false
    });

    const { error, success, loading } = values;

    const { user, token } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickPassword = event => {
        event.preventDefault();

        const { oldPassword, newPassword, confirmNewPassword } = values;

        setValues({ ...values, error: false, loading: true });

        // upate password
        updatePassword(currentUser._id, token, { oldPassword, newPassword, confirmNewPassword })
            .then((data) => {
                
                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setValues({
                        ...values,
                        error: data.msg,
                        success: false,
                        loading: false
                    });
                } else {
                    update(data, () => {
                        setValues({
                            ...values,
                            oldPassword: data.oldPassword,
                            newPassword: data.newPassword,
                            confirmNewPassword: data.confirmNewPassword,
                            success: true,
                        });
                    });
                }
            });
    }

    const showError = () => (
        <div style={{ display: error ? "" : "none", fontSize: 'smaller', color: 'red', padding: '0 0 5px' }}>
            <span>{error}</span>
        </div>
    );

    const showLoading = () => (
        loading && <h4 style={{ margin: '5px', textAlign: 'center', color: 'rgba(0, 0, 0, 0.6)' }}><i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span></h4>
    );

    const showSuccess = () => (
        <div className={styles.showSuccess} style={{ display: success ? '' : 'none', fontSize: 'smaller', color: 'red', padding: '0 0 5px' }}>
            Password updated
        </div>
    );

    return (
        <div className={styles.password}>
            <h4 className={styles.passwordForm} style={{ color: 'rgba(7, 8, 9, 0.755)' }}>Password</h4>

            {showError()}
            {showLoading()}
            {showSuccess()}

            <form className={styles.authForm}>
                <input
                    className={styles.authInput}
                    type="password"
                    placeholder='Current password'
                    onChange={handleChange('oldPassword')}
                />

                <input
                    className={styles.authInput}
                    type="password"
                    placeholder='New password'
                    onChange={handleChange('newPassword')}
                />

                <input
                    className={styles.authInput}
                    type="password"
                    placeholder='Confirm password'
                    onChange={handleChange('confirmNewPassword')}
                />
            </form>

            <button type="button" onClick={clickPassword} style={{ padding: '3px', cursor: 'pointer', color: 'green' }}>Save changes</button>
        </div>
    );
}