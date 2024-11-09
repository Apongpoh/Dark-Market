import axios from "axios";
import Image from 'next/image';
import Link from "next/link";
import styles from '../../styles/Authuser.module.css';
import { useState } from "react";


export default function Signup() {
    const [values, setValues] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        error: "",
        success: false,
        loading: false,
    });

    const { username, password, confirmPassword, loading, error, success } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    /* API function */
    const signup = async user => {
        return await axios.post('/api/user-auth/signup', user)
            .then(({ data }) => data)
            .catch(err => console.error(err));
    };

    const clickSubmit = event => {
        event.preventDefault();

        setValues({ ...values, error: false, loading: true });

        signup({ username, password, confirmPassword })
            .then(data => {
                if (data.msg) {
                    setValues({ ...values, error: data.msg, success: false, loading: false });
                } else {
                    setValues({ ...values, username: '', password: '', confirmPassword: '', error: '', success: true });
                }
            });
    };

    const signupForm = () => (
        <form className={styles.authForm} onSubmit={clickSubmit}>
            <input
                className={styles.authInput}
                type="text"
                minLength={3}
                maxLength={20}
                value={username}
                onChange={handleChange('username')}
                placeholder='Username'
            />

            <input
                className={styles.authInput}
                type="password"
                minLength={8}
                maxLength={50}
                value={password}
                onChange={handleChange('password')}
                placeholder='Password'
            />

            <input
                className={styles.authInput}
                type="password"
                minLength={8}
                maxLength={50}
                value={confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder='Re-enter password'
            />

            <p><button type='buttom' className={styles.authInput} style={{ color: 'green', cursor: 'pointer' }}>Sign Up</button></p>
            <p style={{padding: '0px 0px 10px', color: 'grey'}}>Do you accept the rules of the resources?</p>
            <p>Already have an account? <Link href='/user-auth/signin' style={{ textDecoration: 'none', color: 'blue' }}><span>Sign In</span></Link></p>

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

    const showSuccess = () => (
        <div className={styles.showSuccess} style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link href='/user-auth/signin' style={{ color: 'blue' }}>Sign in</Link>
        </div>
    );

    const showLoading = () => (
        loading && (
            <h4 className={styles.showLoading}>
                <i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span>
            </h4>)
    );

    return (
        <div className={styles.container}>
            <div className={styles.rowLeft}>
                <Image
                    priority
                    src="/image/terre-logo.svg"
                    height={170}
                    width={170}
                    alt="Follow us on Twitter"
                />
                <h3>Create a new account</h3>
                {showLoading()}
                {showError()}
                {showSuccess()}
                {signupForm()}
            </div>
            <div className={styles.rowRight}>
            </div>
        </div>
    );
}