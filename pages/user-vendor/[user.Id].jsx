import Link from 'next/link';
import Menu from '../../components/menu';
import moment from 'moment';
import ShowImage from '../../components/showImage';
import styles from '../../styles/User-Vendor.module.css';
import { getUser } from '../../lib/client/userAPI/userapi';
import { getProducts } from '../../lib/client/productAPI/productapi';
import { signOut } from '../../lib/client/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function User() {

    const [vendor, setVendor] = useState({});
    const [error, setError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [products, setProducts] = useState([]);

    const vendorId = globalThis.window?.location.pathname.split("/").pop();

    const router = useRouter();

    useEffect(() => {
        const loadSingleUser = userId => {
            getUser(userId)
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        signOut();
                        router.push('/user-auth/signin');
                    }

                    if (data.msg && userId === 'undefined') {
                        setError({ error: data.msg });
                    } else {
                        setVendor(data);
                    }
                });
        };

        loadSingleUser(vendorId);

    }, [vendorId, error]);

    const pgpStr = String.raw`${vendor.pgp}`;

    const copyText = (entryText) => {

        navigator.clipboard.writeText(entryText);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 5000);
    };



    const loadProducts = () => {
        getProducts()
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    router.push('/user-auth/signin')
                }
                
                if (data.msg) {
                    console.log(data.msg);
                } else {
                    setProducts(data);
                }
            });

    };

    useEffect(() => { loadProducts(); }, []);

    return (

        <div>
            <Menu />
            <div className={styles.container}>
                <div className={styles.header}>
                    {
                        vendor.coverPhoto?.ContentType === 'my cover photo' ?
                            <img
                                src={'/terre.png'}
                                alt=''
                                className={styles.coverImg1}
                            /> :
                            <img
                                src={`/api/user-manage/cover-picture/${vendor._id}`}
                                alt=''
                                className={styles.coverImg}
                            />

                    }

                </div>

                <div className={styles.body}>
                    <div style={{ padding: '0 0 15px' }}>
                        <h2 style={{ padding: '0 0 5px' }}>{vendor.username}</h2>
                        <p style={{ padding: '0 0 5px' }}>Joined <strong style={{ color: 'grey' }}>{moment(vendor.createdAt).fromNow()}</strong></p>
                        <p style={{ padding: '0 0 15px' }}>Last update <strong style={{ color: 'grey' }}>{moment(vendor.updatedAt).fromNow()}</strong></p>
                        <p>{vendor.about}</p>

                    </div>

                    <div style={{ padding: '0 0 30px' }}>
                        <p className={styles.tooltip} style={{ fontSize: '20px' }} onClick={() => copyText(pgpStr)}>
                            <span style={{ position: 'relative', zIndex: '-1', color: 'rgba(0, 0, 200, 0.421)' }}>PGP key</span>
                            <span className={styles.tooltiptext} style={{ fontSize: '15px' }}>{isCopied ? 'Copied to clipboard!' : 'Copy'}</span>
                        </p>
                        <pre>{pgpStr}</pre>
                    </div>

                    <div style={{ padding: '0 0 50px' }}>

                        <h2 style={{ padding: '0 0 5px' }}>Active Listing</h2>

                        {

                            products ? <ul className={styles.productList}>

                                {products.map(product => (

                                    (product.user === vendor._id) && (<div
                                        key={product._id}
                                        className={styles.productItem}
                                    >
                                        <span title={product.title}><ShowImage item={product} url="product" />{product.title.split(' ')[0].slice(0, 4)}...</span>
                                        <button style={{ border: "#e6edee", borderRadius: '3px' }} className={styles.btn} title='Listing details'>
                                            <Link href={`/product/${product._id}`}>
                                                View
                                            </Link>

                                        </button>
                                    </div>)
                                ))}
                            </ul> : <div>No listing yet</div>
                        }
                    </div>
                </div>
            </div>
        </div>

    );

}