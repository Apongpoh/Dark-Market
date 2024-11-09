import CreateProd from '../../../components/vendor-manage/create-product';
import ListProducts from '../../../components/vendor-manage/read-delete-product';
import Menu from '../../../components/menu';
import styles from '../../../styles/Vendor.module.css';
import UpdateProduct from '../../../components/vendor-manage/update-product';


export default function ManageProd() {

    const productID = globalThis.window?.location.pathname.split("/").pop();

    return (
        <div>
            <Menu />
            <div className={styles.vendor}>
                    <div className={styles.vendorLeft}>
                        <CreateProd />
                    </div>

                    <div className={styles.vendorMiddle}>
                        <ListProducts />
                    </div>

                    <div className={styles.vendorRight}>
                        <UpdateProduct productId={productID} />
                    </div>
            </div>
        </div>
    );
}