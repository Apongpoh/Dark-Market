import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import ShowImage from '../../components/showImage';
import styles from '../../styles/Product.module.css';
import { getCategories } from '../../lib/client/productAPI/productapi';
import { getProduct } from '../../lib/client/productAPI/productapi';
import { getVendorInfo } from '../../lib/client/userAPI/userapi';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { withdrawBtc, getBtcs } from '../../lib/client/walletAPI/btcapi';


export default function Product() {

    const [currentUser, setCurrentUser] = useState({});
    const [product, setProduct] = useState([]);
    const [vendor, setVendor] = useState([]);
    const [categories, setCategories] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [values, setValues] = useState({
        sendToAddress: '',
        amount: Number(0 / 100000000).toFixed(8),
        passphrase: '',
        loading: false,
        success: false,
        error: '',
        formData: new FormData()
    });
    const [btcsAccount, setBtcsAccount] = useState([]);

    const { user, token } = isAuthenticated();

    let { amount, passphrase, success, loading, error, formData } = values;

    const productId = globalThis.window?.location.pathname.split("/").pop();

    const vendorId = product.user;

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const loadBtcs = () => {
        getBtcs()
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setError({ error: data.msg });
                } else {
                    setBtcsAccount(data);
                }
            });
    };

    useEffect(() => loadBtcs(), []);

    const vendorBtcAddr = btcsAccount.map(btcAcc => product.user === btcAcc.user && btcAcc).filter(btcAddr => btcAddr !== false && btcAddr);
    const buyerBtcAddr = btcsAccount.map(btcAcc => currentUser._id === btcAcc.user && btcAcc).filter(btcAddr => btcAddr !== false && btcAddr);

    const btcId = buyerBtcAddr[0]?._id;

    useEffect(() => {
        const loadSingleProduct = productId => {
            getProduct(productId)
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        signOut();
                        router.push('/user-auth/signin');
                    }

                    if (data.msg && productId === 'undefined') {
                        setError({ error: data.msg });
                    } else {
                        setProduct(data);
                    }
                });
        };
        loadSingleProduct(productId);
    }, [productId, error]);

    useEffect(() => {
        const loadSingleUser = userId => {
            getVendorInfo(userId)
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        router.push('/user-auth/signin')
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

    useEffect(() => {
        const loadAllCategories = () => {
            getCategories()
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        signOut();
                        router.push('/user-auth/signin');
                    }

                    if (data.msg) {
                        setError({ error: data.msg });
                    } else {
                        setCategories(data);
                    }
                });
        };
        loadAllCategories();
    }, []);

    const handleQuantityChange = event => {
        event.preventDefault();
        setQuantity(event.target.value);
    };

    const amountToSend = product?.price * quantity;

    // 1 USD = 0.000039 BTC
    const toBtc = amountToSend * 0.000039;

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = event => {
        event.preventDefault();

        setValues({ ...values, error: '', loading: true });

        withdrawBtc(btcId, currentUser._id, token, formData)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setValues({ ...values, error: data.msg });
                } else {
                    setValues({
                        ...values,
                        sendToAddress: '',
                        amount: '',
                        passphrase: '',
                        loading: false,
                        success: true,
                        error: false,
                    });
                }
            });
    };

    const showError = () => (
        <div style={{ display: error ? "" : "none", fontSize: 'large', color: 'red', textAlign: 'center', margin: '8px', padding: '5px', borderRadius: '5px', backgroundColor: 'rgba(135, 35, 12, 0.164)' }}>
            <span>{error}</span>
        </div>
    );

    const showLoading = () => (
        loading && <h4 style={{ color: 'rgba(0, 0, 0, 0.6)', textAlign: 'center' }}><i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span></h4>
    );

    const showSuccess = () => (
        <div style={{ display: success ? '' : 'none', fontSize: 'smaller', color: 'red', margin: '8px', padding: '5px', borderRadius: '5px', backgroundColor: 'rgba(135, 35, 12, 0.164)' }}>
            Success!
        </div>
    );

    return (
        <div>
            <div className={styles.container}>
                <div onClick={() => router.back()} className={styles.closebtn} title='close'>&times;</div>
                <div className={styles.rowLeft} style={{ backgroundImage: `url(/api/product/photo/${product._id})` }}></div>
                <img
                    src={`/api/product/photo/${product._id}`}
                    alt=''
                    className={styles.productImage}
                />
                <div className={styles.rowRight}>

                    {
                        categories.map(category => category._id === product.category && (
                            <div key={category._id} style={{ padding: '0 0 5px' }}>
                                <h2><strong>{category.title}</strong></h2>
                            </div>
                        ))
                    }

                    <p><strong>{product.title} . {product.quantity > 50 ? <span style={{ color: 'green' }}>In stock</span> : <span style={{ color: 'red' }}>Limited Stock</span>}</strong></p>
                    <h3><strong>${product.price} USD</strong></h3>
                    <p><strong>Published</strong> <small style={{ color: '#5e3c58' }}>{moment(product.createdAt).fromNow()}</small></p>
                    <p><strong>Last update</strong> <small style={{ color: '#5e3c58' }}>{moment(product.updatedAt).fromNow()}</small></p>
                    <p><strong>Shipping</strong> <small style={{ color: '#5e3c58' }}>{product.shipping === true ? 'YESS' : 'NO'}</small></p>
                    <p><strong>Escrow</strong> <small style={{ color: '#5e3c58' }}>YESS</small></p>
                    <p><strong>Views</strong> <small style={{ color: '#5e3c58' }}>{product.viewCount}</small></p>

                    <h3>Description</h3>

                    <p><span style={{ whiteSpace: "pre-line" }}>{product.description?.toString()}</span></p>

                    <div style={{ padding: '5px 0px' }}>
                        <h3>Vendor Information</h3>
                        <div className={styles.vendorItem} title='Vendor details'>
                            <p>
                                <Link href={`/user-vendor/${vendorId}`}>
                                    {
                                        vendor.profilePicture?.ContentType === 'my profile photo' ?
                                            <Image
                                                src={'/terre.png'}
                                                alt=''
                                                width={50}
                                                height={50}
                                                className={styles.profileImg}
                                            /> :
                                            <Image
                                                src={`/api/user-manage/profile-picture/${vendorId}`}
                                                alt=''
                                                width={50}
                                                height={50}
                                                className={styles.profileImg}
                                            />
                                    }
                                </Link>
                            </p>
                            <h3 style={{ padding: '10px', color: 'rgba(0, 0, 250, 0.621)' }}><Link href={`/user-vendor/${vendorId}`}>{vendor.username}</Link></h3>
                        </div>
                        <p>Join <strong>Terre Market</strong> in  <small style={{ color: '#5e3c58' }}>{vendor.createdAt?.slice(0, 4)}</small></p>
                    </div>

                    <div>
                        <p><a href={`#${product._id}=product`}><button className={styles.buyBtn}>Buy Now</button></a></p>
                        <p><Link href={`/message/${currentUser._id}/${product.user}`}><button className={styles.msgBtn}>Message</button></Link></p>
                    </div>

                    <div id={`${product._id}=product`} className={styles.modal}>
                        <div className={styles.modalContent}>
                            <div>

                                <h1>Checkout</h1>
                                <p>You are about to purchase the item from the background. Before you submit your purchase, please take note of the following points regarding the purchase rules on this Market for safety for both buyers and sellers.</p>

                                <hr></hr>

                                <p>- All purchases are handled through the Escrow system of the marketplace. Once you submit your purchase, the money will be held in Escrow until you acknowledge satisfactory receipt of the goods. When you receive your item and everything is all right, you will be expected to release Escrow.</p>
                                <p>- If the received good are not satisfactory, you can choose to dispute the transaction and a mediator will look into it. Please dispute only if you have a good reason; changing your mind is not considered an acceptable reason.</p>
                                <p>- Escrow will auto-finalize 48 hours after shipping date for digital goods, and 14 days for physical goods. Once the funds are released, the sale is considered final and the seller can access those funds. If you have not received your goods before that time, please dispute the order, as finalized orders are considered final.</p>
                                <p>- Please report the seller if he/she asks for money outside of Escrow, and do not send coins. If you send coins outside our Escrow system, it is entirely at your own risk.</p>
                                <p>- It is <strong>highly recommended that you PGP encrypt your shipping address yourself. This offers an additional layer of protection for both the buyer and the seller.</strong></p>

                                <hr style={{ margin: '5px' }}></hr>

                                <div>
                                    <h2 style={{ color: 'rgba(0, 0, 0, 0.7)' }}>Review item and shipping</h2>
                                    <ShowImage item={product} url="product" /><span><strong>{product.title}</strong></span>
                                    <p style={{ display: quantity >= product?.quantity ? "" : "none", fontSize: 'large', color: 'red', margin: '8px', padding: '5px', borderRadius: '5px', backgroundColor: 'rgba(135, 35, 12, 0.164)' }}>The seller doesn't have that many left!</p>
                                    <p>Unit sale price: <span style={{ marginLeft: '3%', padding: '1%' }}>$<strong>{product.price?.toFixed(2)} USD / {(product?.price * 0.000039).toFixed(8)} BTC</strong></span></p>
                                    <form>Quantity: <span style={{ marginLeft: '10%', padding: '1%' }}><strong><input type='number' value={quantity} min={1} max={product.quantity} onChange={handleQuantityChange} /></strong></span></form>
                                    <p>Total price: <span style={{ marginLeft: '7%', padding: '1%' }}>$<strong>{(amountToSend).toFixed(2)} USD / {toBtc?.toFixed(8)} BTC</strong></span></p>
                                </div>

                                <div style={{ margin: '10px 0' }}>
                                    <h2 style={{ margin: '0 0 10px', color: 'rgba(0, 0, 0, 0.7)' }}>Confirm and pay</h2>

                                    <div>
                                        {showError()}
                                        {showLoading()}
                                        {showSuccess()}
                                    </div>

                                    <form onSubmit={clickSubmit}>

                                        <div>
                                            <label>Pay to: </label>
                                            <select className={styles.formInputSel} style={{ marginLeft: '13%' }} onChange={handleChange('sendToAddress')}>
                                                <option>Select escrow account</option>
                                                {
                                                    vendorBtcAddr.map(btc => (
                                                        <option key={btc._id} value={btc.address}>
                                                            {btc.address}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div>
                                            <label>Order total: </label>
                                            <input
                                                type="Number"
                                                step={0.00000001}
                                                min={0}
                                                value={amount}
                                                onChange={handleChange('amount')}
                                                className={styles.formInput}
                                                style={{ marginLeft: '8%' }}
                                            />
                                        </div>


                                        <div>
                                            <label>Passphrase: </label>
                                            <input
                                                type="password"
                                                placeholder='Passphrase'
                                                value={passphrase}
                                                onChange={handleChange('passphrase')}
                                                className={styles.formInput}
                                                style={{ marginLeft: '9%' }}
                                            />
                                        </div>

                                        <div>
                                            <label>Confirm purchase: </label>
                                            <button style={{ marginLeft: '3%', color: 'green', cursor: 'pointer' }} className={styles.formInput}>Pay</button>
                                        </div>

                                    </form>
                                </div>
                                <div style={{ margin: '10px 0' }}>
                                    <h2 style={{ margin: '0 0 10px', color: 'rgba(0, 0, 0, 0.7)' }}>Ship to</h2>
                                    <p>After a successful payment, you will see the Transaction ID just below <strong>Confirm and Pay.</strong> Copy the transaction id, together with your encrypted shipping address or encrypted message, <strong><Link href={`/message/${currentUser._id}/${product.user}`} style={{ color: "blueviolet" }}>Send Message</Link></strong> to your vendor.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}