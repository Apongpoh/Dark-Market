import Information from './user-manage/information';
import Image from 'next/image';
import Link from 'next/link';
import Password from './user-manage/password';
import Pgp from './user-manage/pgp';
import styles from '../styles/Menu.module.css';
import { isAuthenticated, signOut } from '../lib/client/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


export default function Menu() {

    const [currentUser, setCurrentUser] = useState({});
    const [info, setInfo] = useState(true);
    const [pgp, setPgp] = useState(false);
    const [password, setPassword] = useState(false);
    const [colors, setColors] = useState({
        color1: 'blue',
        color2: 'green',
        color3: 'green'
    });

    const { color1, color2, color3 } = colors;

    const { user } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const handleInfo = event => {
        event.preventDefault();

        setInfo(true);
        setColors({
            color1: 'blue',
            color2: 'green',
            color3: 'green',
        });
        setPgp(false);
        setPassword(false);
    };

    const handlePgp = event => {
        event.preventDefault();

        setPgp(true);
        setColors({
            color1: 'green',
            color2: 'blue',
            color3: 'green',
        });
        setInfo(false);
        setPassword(false);
    };

    const handlePassword = event => {
        event.preventDefault();

        setPassword(true);
        setColors({
            color1: 'green',
            color2: 'green',
            color3: 'blue',
        });
        setPgp(false);
        setInfo(false);
    };

    const signout = () => {
        signOut();
        router.push('/user-auth/signin');
    };

    return (
        <nav className={styles.navbar}>
            {/* LOGO */}
            <Link href='/marketplace'><span className={styles.logo}><strong>
                <Image
                    priority
                    src="/image/terre-logo.svg"
                    height={50}
                    width={50}
                    alt="Follow us on Twitter"
                />
            </strong></span></Link>

            {/* NAVIGATION MENU */}
            <ul className={styles.navLinks}>

                {/* USING CHECKBOX HACK */}
                <input type="checkbox" id="checkbox_toggle" className={styles.checkboxInput} />
                <label htmlFor="checkbox_toggle" className={styles.hamburger}>&#9776;</label>

                {/* NAVIGATION MENUS */}
                <div className={styles.menu}>
                    <Link href='/marketplace'><li className={styles.listItem}>Marketplace</li></Link>

                    <div className={styles.dropdowm}>
                        <li className={styles.listItem}>Vendor</li>
                        <ul className={styles.dropdownContent}>
                            {
                                currentUser.role === 0 && <p>
                                    <Link href="/vendor/become-a-vendor"><li><span style={{ color: 'red' }}>|</span>Become A Vendor</li></Link>
                                </p>
                            }
                            {
                                currentUser.role === 1 && <p>
                                    <Link href="/vendor/manage-listing"><li><span style={{ color: 'red' }}>|</span>Manage listing</li></Link>
                                </p>
                            }
                        </ul>
                    </div>

                    <Link href='/rules'><li className={styles.listItem}>Rules</li></Link>

                    <div className={styles.dropdowm}>
                        <li className={styles.listItem}>Support</li>
                        <ul className={styles.dropdownContent} style={{ fontSize: 'medium' }}>
                            <Link href="/support/faq"><li><span style={{ color: 'red' }}>|</span>FAQ</li></Link>
                            <br></br>
                            <Link href={`/support/create-ticket/${currentUser._id}`}><li><span style={{ color: 'green' }}>|</span>Create Ticket</li></Link>
                            <br></br>
                            <Link href="/support/disputes"><li><span style={{ color: 'blue' }}>|</span>Disputes</li></Link>
                            <br></br>
                            <Link href="/support/about-us"><li><span style={{ color: 'green' }}>|</span>About Us</li></Link>
                        </ul>
                    </div>

                    <Link href='/wallet'><li className={styles.listItem}>Wallet</li></Link>

                    <li className={styles.listItem} onClick={signout}>Sign Out</li>

                    <li style={{ padding: '10px' }}>
                        <div>
                            <a href={`#${currentUser.username}=account`}>
                                {
                                    currentUser.profilePicture?.ContentType === 'my profile photo' ?
                                        <Image
                                            src={'/terre.png'}
                                            width={50}
                                            height={50}
                                            alt=''
                                            style={{ borderRadius: '50%' }}
                                        /> :
                                        <Image
                                            src={`/api/user-manage/profile-picture/${currentUser._id}`}
                                            width={50}
                                            height={50}
                                            alt=''
                                            style={{ borderRadius: '50%' }}
                                        />
                                }
                            </a>
                        </div>
                        <div id={`${currentUser.username}=account`} className={styles.modal}>
                            <div className={styles.modalContent}>
                                <div className={styles.modalLeft}>
                                    <h4 className={styles.modalHeadings} style={{ color: 'rgba(7, 8, 9, 0.755)' }}>Edit Profile</h4>
                                    <ul className={styles.modalHeadings}>
                                        <li className={styles.modalItems} style={{ color: `${color1}`, cursor: 'pointer' }} onClick={handleInfo}>Information</li>
                                        <li className={styles.modalItems} style={{ color: `${color2}`, cursor: 'pointer' }} onClick={handlePgp}>PGP</li>
                                        <li className={styles.modalItems} style={{ color: `${color3}`, cursor: 'pointer' }} onClick={handlePassword}>Password</li>
                                    </ul>
                                </div>
                                <div className={styles.modalRight}>
                                    <ul className={styles.modalHeadings}>
                                        <li className={styles.modalItems}>{info && <Information />}</li>
                                        <li className={styles.modalItems}>{pgp && <Pgp />}</li>
                                        <li className={styles.modalItems}>{password && <Password />}</li>
                                    </ul>
                                </div>
                                <a href="/marketplace" className={styles.modalClose}>&times;</a>
                            </div>
                        </div>
                    </li>
                </div>
            </ul>
        </nav>
    );
}