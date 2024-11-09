import Menu from '../../components/menu';
import styles from '../../styles/Vendor.module.css';


export default function Disputes() {
    return (
        <div>
            <Menu />
            <div className={styles.tablecontainer}>
                <table className={styles.table}>
                    <tr className={styles.tr}>
                        <th className={styles.th}>DisputeId</th>
                        <th className={styles.th}>PaymentId</th>
                        <th className={styles.th}>Amount</th>
                        <th className={styles.th}>Type</th>
                        <th className={styles.th}>Respond In</th>
                        <th className={styles.th}>Created At</th>
                        <th className={styles.th}>Status</th>
                    </tr>
                    <tr className={styles.tr}>
                        <td className={styles.td}>Empty</td>
                        <td className={styles.td}>Empty</td>
                        <td className={styles.td}>Empty</td>
                        <td className={styles.td}>Empty</td>
                        <td className={styles.td}>Empty</td>
                        <td className={styles.td}>Empty</td>
                        <td className={styles.td}>Empty</td>
                    </tr>
                </table>
            </div>
        </div>
    );
}