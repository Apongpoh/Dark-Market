import Image from "next/image";
import Link from "next/link";
import Menu from "../../../components/menu";
import moment from "moment";
import styles from "../../../styles/Reviews.module.css";
import ReactStars from 'react-stars';
import { getCategories } from "../../../lib/client/productAPI/productapi";
import { getProduct } from "../../../lib/client/productAPI/productapi";
import { getUsers } from "../../../lib/client/userAPI/userapi";
import { useRouter } from 'next/router';
import { getReviews, createReview } from "../../../lib/client/reviewsAPI/reviewsapi";
import { isAuthenticated, signOut } from "../../../lib/client/auth";
import { useState, useEffect } from "react";


export default function Message() {

    const [currentUser, setCurrentUser] = useState({});
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [values, setValues] = useState({
        rating: 0,
        reviewText: "",
        error: "",
        loading: false,
        formData: new FormData()
    });

    const { rating, reviewText, loading, error, formData } = values;

    const { user, token } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    const productId = globalThis.window?.location.pathname.split("/").pop();

    useEffect(() => {
        const loadSingleProduct = productId => {
            getProduct(productId)
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        router.push('/user-auth/signin')
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
        const loadAllUsers = () => {
            getUsers()
                .then(data => {

                    if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                        signOut();
                        router.push('/user-auth/signin');
                    }

                    if (data.msg) {
                        setError({ error: data.msg });
                    } else {
                        setUsers(data);
                    }
                });
        };
        loadAllUsers();
    }, []);

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

    const handleChange = name => event => {
        const value = event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    }

    const clickSubmit = event => {
        event.preventDefault();

        setValues({ ...values, error: '', loading: true });

        createReview(currentUser._id, productId, token, formData)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setValues({ ...values, error: data.msg, loading: false });
                } else {
                    setValues({ ...values, subject: '', text: '', loading: '', error: '' });
                    router.reload();
                }
            });
    };

    useEffect(() => {
        getReviews()
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.error) {
                    setError({ error: data.error });
                } else {
                    setReviews(data);
                }
            });
    }, []);

    const buyerReviews = reviews.filter((review) => review.productId === productId && review);

    const productReviews = reviews.filter((review) => review.productId === product._id && review);
    const productRating = productReviews.map(pr => pr.rating);

    let sum = 0;

    for (let i = 0; i < productRating.length; i++) {
        sum += productRating[i];
    }

    const averageRating = Math.round(sum / productRating.length);

    const showError = () => (
        <div style={{ display: error ? "" : "none", fontSize: 'large', color: 'red', margin: '8px', padding: '5px', borderRadius: '5px', backgroundColor: 'rgba(135, 35, 12, 0.164)' }}>
            <span>{error}</span>
        </div>
    );

    const showLoading = () => (
        loading && <h4 style={{ color: 'rgba(0, 0, 0, 0.6)', padding: '5px', textAlign: 'center' }}><i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span></h4>
    );

    return (
        <div>
            <Menu />
            <div className={styles.reviewBody}>
                <div className={styles.container}>
                    <div className={styles.rowLeft} style={{ padding: '0 0 20px' }}>
                        <Image
                            src={`/api/product/photo/${product._id}`}
                            width={235}
                            height={260}
                            alt=""
                            style={{ borderRadius: '5px' }}
                        />
                        <div style={{ position: 'relative', zIndex: '-1' }}>
                            <ReactStars
                                count={5}
                                size={20}
                                value={averageRating}
                                half={false}
                                edit={false}
                            />
                        </div>
                        <p>{buyerReviews.length} reviews</p>

                    </div>
                    <div className={styles.rowRight}>

                        {
                            categories.map(category => category._id === product.category && (
                                <div key={category._id} style={{ padding: '0 0 10px' }}>
                                    <p><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Category</strong> <strong>{category.title}</strong></p>
                                </div>
                            ))
                        }

                        <p style={{ padding: '0 0 10px' }}><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Title</strong> <strong>{product.title} . {product.quantity > 50 ? <span style={{ color: 'green' }}>In stock</span> : <span style={{ color: 'red' }}>Limited Stock</span>}</strong></p>
                        <p style={{ padding: '0 0 10px' }}><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Price</strong> <strong>${product.price} USD</strong></p>
                        <p style={{ padding: '0 0 10px' }}><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Shipping</strong> <strong>{product.shipping === true ? 'YESS' : 'NO'}</strong></p>
                        <p style={{ padding: '0 0 10px' }}><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Escrow</strong> <strong>YESS</strong></p>
                        <p style={{ padding: '0 0 10px' }}><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Description</strong> <strong>{product.description}</strong></p>
                        <p style={{ padding: '0 0 10px' }}><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Published</strong> <strong>{moment(product.createdAt).fromNow()}</strong></p>
                        <p style={{ padding: '0 0 10px' }}><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Last update</strong> <strong>{moment(product.updatedAt).fromNow()}</strong></p>

                        {
                            users.map(user => user._id === product.user && (
                                <div key={user._id} style={{ padding: '0 0 10px' }}>
                                    <p><strong style={{ color: 'rgba(0, 0, 0, 0.6)' }}>By</strong> <Link href={`/user-vendor/${user._id}`} style={{ color: 'rgba(0, 0, 200, 0.621)' }}><strong>{user.username}</strong></Link></p>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div style={{ padding: '0 0 20px' }}>
                    <h2 style={{ padding: '0 0 5px' }}>Rate this listing and it's vendor</h2>
                    <p style={{ padding: '0 0 20px', width: '39%' }}>Tell others what you think. Reviews are public and include your username and profile picture.</p>

                    <div style={{ width: '39%', }}>
                        {showLoading()}
                        {showError()}
                    </div>

                    <form onSubmit={clickSubmit}>
                        <div style={{ padding: '0 0 10px' }}>
                            <input
                                style={{ padding: '5px 5px 5px 5px', width: '39%' }}
                                type="number"
                                min={0}
                                max={5}
                                value={rating}
                                onChange={handleChange('rating')}
                            />
                        </div>
                        <div style={{ padding: '0 0 10px' }}>
                            <textarea
                                style={{ padding: '0 5px', width: '39%', height: '100px' }}
                                rows="15"
                                type="textArea"
                                maxLength={500}
                                value={reviewText}
                                onChange={handleChange('reviewText')}
                                placeholder='Describe your experience (optional)'
                            />
                            <p style={{ textAlign: 'end', width: '39%' }}>{reviewText.length}/500</p>
                        </div>
                        <div>
                            <button style={{ padding: '5px', color: 'red', width: '39%', cursor: 'pointer' }}>Post</button>
                        </div>
                    </form>
                </div>
                <div>
                    <h2 style={{ padding: '0 0 5px' }}>Rating and reviews</h2>
                    <ul>
                        {
                            buyerReviews.map(review => (
                                <div key={review._id}>
                                    <br></br>
                                    {
                                        users.map(user => user._id === review.userId && (
                                            <div className={styles.container} key={user._id}>
                                                <p>
                                                    {
                                                        user.profilePicture?.ContentType === 'my profile photo' ?
                                                            <Image
                                                                src={'/terre.png'}
                                                                alt=''
                                                                width={30}
                                                                height={30}
                                                                style={{ borderRadius: '50%', border: '3px solid white' }}
                                                            /> :
                                                            <Image
                                                                src={`/api/user-manage/profile-picture/${user._id}`}
                                                                alt=''
                                                                width={30}
                                                                height={30}
                                                                style={{ borderRadius: '50%', border: '3px solid white' }}
                                                            />
                                                    }
                                                </p>
                                                <p style={{ padding: '7px', color: 'rgba(80, 80, 80)' }}>{user.username}</p>
                                            </div>
                                        ))
                                    }
                                    <div style={{ position: 'relative', zIndex: '-1', padding: '0 0 3px' }}>
                                        <ReactStars
                                            count={5}
                                            size={11}
                                            value={review.rating}
                                            half={false}
                                            edit={false}
                                        />
                                    </div>
                                    <p style={{ padding: '0 0 5px' }}>{review.reviewText}</p>
                                    <p style={{ color: 'grey', fontSize: '11px', padding: '0 0 10px' }}>Posted {moment(review.createdAt).fromNow()}</p>
                                </div>
                            ))
                        }
                    </ul>
                </div>
            </div >
        </div >
    );
}