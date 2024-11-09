import Link from 'next/link';
import Menu from '../../components/menu';
import styles from '../../styles/Vendor.module.css';
import { fiatToBitcoin } from 'bitcoin-conversion';
import { useEffect, useState } from 'react';


export default function Sales() {

    const [btc, setBtc] = useState();

    useEffect(() => {
        const conv = async () => {
            const paymentInBtcFromUsd = await fiatToBitcoin('200', 'USD');
            setBtc(paymentInBtcFromUsd);
        };

        conv();
    }, []);

    return (
        <div>
            <Menu />
            <div className={styles.misc}>
                <h2 style={{ textAlign: 'center', color: 'black' }}>Vendor Rules</h2>
                <p>Here you can activate your vendor account. Take time to read the vendor rules below, check the box, and click the payment button. After that, you will be able to create listings and start selling here. Be careful to acknowledge the rules, as breaching them may result in account suspension.</p>
                <p><span style={{ fontWeight: 'bold' }}>#1</span>: There is a $200 USD vendor bond ({btc?.toFixed(8)} BTC).</p>
                <p><span style={{ fontWeight: 'bold' }}>#2</span>: All sellers must have a PGP key in their profile before starting to sell</p>
                <p><span style={{ fontWeight: 'bold' }}>#3</span>: Sharing any 3rd party contact information: ICQ, JABBER, TELEGRAM, WICKR etc... is <span style={{ color: 'red' }}>not permitted</span>. Asking vendor/customer for his ICQ, JABBER, TELEGRAM, WICKR or any other direct contact is also <span style={{ color: 'red' }}>not permitted</span>. Doing so will result in removal and immediate ban of your account.</p>
                <p><span style={{ fontWeight: 'bold' }}>#4</span>: If you get too many scam reports, we may revoke your vendor account at any time.</p>
                <p><span style={{ fontWeight: 'bold' }}>#5</span>: Prostitution, child porn, fentanyl, and murder services are <span style={{ color: 'red' }}>not permitted.</span></p>
                <p><span style={{ fontWeight: 'bold' }}>#6</span>: Weapons are <span style={{ color: 'red' }}>not permitted</span> to be sold. Any weapons listed will result in removal and immediate vendor ban.</p>
                <p><span style={{ fontWeight: 'bold' }}>#7</span>: Vendors must accurately describe their products in their listings.</p>
                <p><span style={{ fontWeight: 'bold' }}>#8</span>: Digital orders auto-finalize after 48 hours, and physical orders auto-finalize after 14 days.</p>
                <p><span style={{ fontWeight: 'bold' }}>#9</span>: The vendor fee is not refundable. This is to protect the market from scammers.</p>
                <p><span style={{ fontWeight: 'bold' }}>#10</span>: Any dox threat will result in an immediate ban.</p>
                <p><span style={{ fontWeight: 'bold' }}>#11</span>: Padding feedback is <span style={{ color: 'red' }}>not permitted</span>.</p>
                <p><span style={{ fontWeight: 'bold' }}>#12</span>: Sharing or selling links that are not those of Terre Market is <span style={{ color: 'red' }}>not permitted.</span></p>
                <p><Link href='/wallet'><button type="button" style={{ padding: '3px', cursor: 'pointer', color: 'green' }}>Pay with Bitcoin</button></Link></p>
            </div>
        </div>
    );
}