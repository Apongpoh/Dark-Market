import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import styles from '../../styles/Authuser.module.css';
import { authenticate, isAuthenticated } from "../../lib/client/auth";
import { useRouter } from 'next/navigation';
import { useState } from "react";


export default function Signin() {
    const [values, setValues] = useState({
        username: "",
        password: "",
        error: "",
        loading: false,
        naviateToReferrer: false
    });

    const { username, password, loading, error, naviateToReferrer } = values;

    const router = useRouter();

    const handleChange = name => event => setValues({ ...values, error: false, [name]: event.target.value })

    /* API function */
    const signin = async user => {
        return await axios.post('/api/user-auth/signin', user)
            .then(({ data }) => data)
            .catch(err => console.error(err));
    };

    const clickSubmit = event => {

        event.preventDefault();

        setValues({ ...values, error: false, loading: true });

        signin({ username, password })
            .then(data => {
                if (data.msg) {
                    setValues({ ...values, error: data.msg, loading: false });
                } else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            naviateToReferrer: true
                        });
                    });
                }
            });
    };

    const signinForm = () => (
        <form className={styles.authForm} onSubmit={clickSubmit}>
            <input
                type="text"
                placeholder='Username'
                value={username}
                onChange={handleChange("username")}
                className={styles.authInput}
                name="_csrf"
            />

            <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={handleChange("password")}
                className={styles.authInput}
                name="_csrf"
            />

            <p><button type="buttom" className={styles.authInput} style={{ color: 'green', cursor: 'pointer' }}>Sign In</button></p>
            <p>Don't have an account? <Link href='/user-auth/signup' style={{ textDecoration: 'none', color: 'blue' }}><span>Sign Up</span></Link></p>

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

    const redirectUser = () => {
        if (naviateToReferrer && isAuthenticated()) {
            return router.push('/marketplace');
        }
    };

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
                <h3>Sign In</h3>
                {showLoading()}
                {showError()}
                {signinForm()}
                {redirectUser()}
            </div>
            <div className={styles.rowRight}>
            </div>
        </div>
    );
}