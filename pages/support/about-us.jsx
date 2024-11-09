import Menu from '../../components/menu';
import styles from '../../styles/Vendor.module.css';


export default function AboutUs() {
    return (
        <div>
            <Menu />
            <div className={styles.misc}>
                <h2 style={{textAlign: 'center', color: 'black'}}>Welcome to Terre Market</h2>
                <div style={{textAlign: 'center'}}>
                    <p>We are a anonymous marketplace dedicated to users that follows our market rules.</p>
                    <p>Please consult the FAQ section or open ticket if you have any questions.</p>
                    <p>We guarantee the safety of your funds and the quality of your purchase.</p>
                    <p>We don't keep any logs and your anonymity is our top priority.</p>
                    <p>We provide escrow services to secure your purchases.</p>
                    <p>24/7 Support, offered in english only.</p>
                </div>
            </div>
        </div>
    );
}