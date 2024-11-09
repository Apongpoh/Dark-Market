import Menu from '../components/menu';
import styles from '../styles/Vendor.module.css';
import { fiatToBitcoin } from 'bitcoin-conversion';
import { useEffect, useState } from 'react';


export default function Rules() {

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
                <h2 style={{textAlign: 'center', color: 'black'}}>Market Rules</h2>
                <p>Those are the market rules. Take time to read them. They are for both <strong>vendors</strong> and <strong>buyers.</strong></p>
                <p><span style={{fontWeight: 'bold'}}>#1</span>: There is a $200 USD vendor bond (BTC {btc?.toFixed(3)}).</p>
                <p><span style={{fontWeight: 'bold'}}>#2</span>: All sellers must have a PGP key in their profile before starting to sell.</p>
                <p><span style={{fontWeight: 'bold'}}>#3</span>: Sharing any 3rd party contact information: ICQ, JABBER, TELEGRAM, WICKR etc... is <span style={{ color: 'red' }}>not permitted</span>. Asking vendor/customer for his ICQ, JABBER, TELEGRAM, WICKR or any other direct contact is also <span style={{ color: 'red' }}>not permitted</span>. Doing so will result in removal and immediate ban of your account.</p>
                <p><span style={{fontWeight: 'bold'}}>#4</span>: If you get too many scam reports, we may revoke your vendor account at any time.</p>
                <p><span style={{fontWeight: 'bold'}}>#5</span>: Prostitution, child porn, fentanyl, and murder services are <span style={{ color: 'red' }}>not permitted.</span></p>
                <p><span style={{fontWeight: 'bold'}}>#6</span>: Weapons are <span style={{ color: 'red' }}>not permitted</span> to be sold. Any weapons listed will result in removal and immediate vendor ban.</p>
                <p><span style={{fontWeight: 'bold'}}>#7</span>: Vendors must accurately describe their products in their listings.</p>
                <p><span style={{fontWeight: 'bold'}}>#8</span>: Digital orders auto-finalize after 48 hours, and physical orders auto-finalize after 14 days.</p>
                <p><span style={{fontWeight: 'bold'}}>#9</span>: The vendor fee is not refundable. This is to protect the market from scammers.</p>
                <p><span style={{fontWeight: 'bold'}}>#10</span>: Any dox threat will result in an immediate ban.</p>
                <p><span style={{fontWeight: 'bold'}}>#11</span>: Padding feedback is <span style={{ color: 'red' }}>not permitted</span>.</p>
                <p><span style={{fontWeight: 'bold'}}>#12</span>: Sharing or selling links that are not those of Terre Market is <span style={{ color: 'red' }}>not permitted.</span></p>
                <p><span style={{fontWeight: 'bold'}}>#13</span>: If you are vendor on another market, please contact support. We will waive vendor fees and give you appropriate vendor level.</p>
                <p><span style={{fontWeight: 'bold'}}>#14</span>: Two-factor authentication (2FA) is mandatory for all vendors.</p>
                <p><span style={{fontWeight: 'bold'}}>#15</span>: Weapons/explosives are not permitted to be sold. Any weapons/explosives listed will result in removal and immediate vendor ban.</p>
                <p><span style={{fontWeight: 'bold'}}>#16</span>: All purchases are handled through the Escrow system of the marketplace. Once you submit your purchase, the money will be held in Escrow until you acknowledge satisfactory receipt of the goods. When you receive your item and everything is all right, you will be expected to release Escrow.</p>
                <p><span style={{fontWeight: 'bold'}}>#17</span>: If the received good are not satisfactory, you can choose to dispute the transaction and a moderator will look into it. Please dispute only if you have a good reason; changing your mind is not considered an acceptable reason.</p>
                <p><span style={{fontWeight: 'bold'}}>#18</span>:  Escrow will auto-finalize 48 hours after shipping date for digital goods, and 14 days for physical goods. Once the funds are released, the sale is considered final and the seller can access those funds. If you have not received your goods before that time, please dispute the order, as finalized orders are considered final.</p>
                <p><span style={{fontWeight: 'bold'}}>#19</span>:  Please report the seller if he/she asks for money outside of Escrow, and do not send coins. If you send coins outside our Escrow system, it is entirely at your own risk.</p>
                <p><span style={{fontWeight: 'bold'}}>#20</span>:  It is highly recommended that you PGP encrypt your shipping address yourself. This offers an additional layer of protection for both the buyer and the seller.</p>
                <p><span style={{color: 'green'}}>Market's Goal</span>: Terre Market's goal is to provide a safe environment so that Terre Market users are able to purchase safely, scam-free and away from the street violence, drugs and other items that are more potent, cleaner and safer to use.</p>
            </div>
        </div>
    );
}