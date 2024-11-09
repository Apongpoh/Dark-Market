import Link from 'next/link';
import ShowImage from '../showImage';
import styles from '../../styles/Vendor.module.css';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { deleteProduct, getProducts } from '../../lib/client/productAPI/productapi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export default function ListProducts() {

    const [currentUser, setCurrentUser] = useState({});
    const [products, setProducts] = useState([]);
    const [values, setValues] = useState({
        error: "",
        success: false,
        loading: false,
    });

    const { user, token } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const loadProducts = () => {
        getProducts().then(data => {

            if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                signOut();
                router.push('/user-auth/signin');
            }
            
            if (data.msg) {
                console.log(data.msg);
            } else {
                setProducts(data);
            }
        });
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const destroy = productId => {
        setValues({ ...values, error: false, loading: true });
        deleteProduct(productId, currentUser._id, token).then(data => {

            if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                signOut();
                router.push('/user-auth/signin');
            }

            router.reload();

            if (data.msg) {
                setValues({ ...values, error: data.msg, success: false, loading: false });
            } else {
                setValues({
                    ...values,
                    error: '',
                    success: true
                });
            }
        });
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}><strong>Your Listings</strong></h2>
            {
                products ? <ul className={styles.productList}>
                    {products.map(product => (
                        (product.user === currentUser._id) && (<div
                            key={product._id}
                            className={styles.productItem}
                        >
                            <span title={product.title}><ShowImage item={product} url="product" />{product.title.split(' ')[0].slice(0, 4)}...</span>

                            <button style={{ border: "#e6edee", borderRadius: '3px' }} className={styles.btn} title='Listing details'>
                                <Link href={`/product/${product._id}`}>
                                    View
                                </Link>
                            </button>

                            <button style={{ color: '#e6edee', backgroundColor: 'rgba(9, 9, 226, 0.6)', border: "#e6edee", borderRadius: '3px' }} className={styles.btn} title='Update listing'>
                                <a href={`/vendor/manage-listing/${product._id}`}>
                                    Edit
                                </a>
                            </button>

                            <button style={{ color: '#e6edee', backgroundColor: 'rgba(226, 9, 9, 0.6)', border: "#e6edee", borderRadius: '3px', cursor: 'pointer' }} className={styles.btn} onClick={() => destroy(product._id)} title='Delete listing permanently'>
                                Delete
                            </button>

                        </div>)
                    ))}
                </ul> : <div className={styles}>No listing yet</div>
            }
        </div>
    );
}