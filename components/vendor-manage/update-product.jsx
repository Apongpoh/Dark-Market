import styles from '../../styles/Vendor.module.css';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getCategories, getProduct, updateProduct } from '../../lib/client/productAPI/productapi';


export default function UpdateProduct({ productId }) {

    const [currentUser, setCurrentUser] = useState({});
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState({
        title: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        success: false,
        error: false,
        formData: new FormData()
    });

    const { user, token } = isAuthenticated();

    const router = useRouter();

    useEffect(() => setCurrentUser(user), []);

    let { title, photo, description, price, quantity, loading, success, error, formData } = values;

    const init = productId => {
        getProduct(productId).then(data => {

            if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                signOut();
                router.push('/user-auth/signin');
            }

            if (data.msg) {
                setValues({ ...values, error: data.msg });
            } else {
                // populate the state
                setValues({
                    ...values,
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    shipping: data.shipping,
                    quantity: data.quantity,
                    formData: new FormData()
                });
                // load categories
                initCategories();
            }
        });
    };

    // load categories and set form data
    const initCategories = () => {
        getCategories().then(data => {

            if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                signOut();
                router.push('/user-auth/signin');
            }
            
            if (data.msg) {
                setValues({ ...values, error: data.msg });
            } else {
                setCategories(data);
            }
        });
    };

    useEffect(() => {
        init(productId);
    }, []);

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = event => {
        event.preventDefault();

        setValues({ ...values, error: '', loading: true });

        updateProduct(productId, currentUser._id, token, formData).then(data => {

            if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                signOut();
                router.push('/user-auth/signin');
            }
            
            if (data.msg) {
                setValues({ ...values, error: data.msg });
            } else {
                setValues({
                    ...values,
                    title: '',
                    description: '',
                    photo: '',
                    price: '',
                    quantity: '',
                    success: true,
                    loading: false,
                    error: false
                });
            }
        });
    };

    const showError = () => (
        <div style={{ display: error ? "" : "none", fontSize: 'smaller', color: 'red', margin: '8px', textAlign: 'center' }}>
            <span>{error}</span>
        </div>
    );

    const showLoading = () => (
        loading && <h4 style={{ margin: '8px', textAlign: 'center', color: 'rgba(0, 0, 0, 0.6)' }}><i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span></h4>
    );

    const showSuccess = () => (
        <div className={styles.showSuccess} style={{ display: success ? '' : 'none', fontSize: 'smaller', color: 'red', margin: '8px', textAlign: 'center' }}>
            Listing Updated
        </div>
    );

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}><strong>Update Listing</strong></h2>

            {showError()}
            {showLoading()}
            {showSuccess()}

            <form onSubmit={clickSubmit}>
                <div className={styles.formItem}>
                    <button className={styles.formInput} style={{ color: 'green', cursor: 'pointer' }}><strong>Update</strong></button>
                </div>

                <div className={styles.formItem}>
                    <input
                        className={styles.formInput}
                        style={{ cursor: 'pointer' }}
                        type="file"
                        accept="image/*"
                        onChange={handleChange('photo')}
                    />
                </div>

                <div className={styles.formItem}>
                    <input
                        className={styles.formInput}
                        type="text"
                        minLength={3}
                        maxLength={19}
                        value={title}
                        onChange={handleChange('title')}
                    />
                    <p style={{ textAlign: 'end' }}>{title.length}/19</p>
                </div>

                <div className={styles.formItem}>
                    <textarea
                        style={{ width: '100%', height: '100px', padding: '10px', resize: "none" }}
                        minLength={100}
                        maxLength={500}
                        value={description}
                        onChange={handleChange('description')}
                    />
                    <p style={{ textAlign: 'end' }}>{description.length}/500</p>
                </div>

                <div className={styles.formItem}>
                    <input
                        className={styles.formInput}
                        type="number"
                        min={1}
                        max={1000000}
                        value={quantity}
                        onChange={handleChange('quantity')}
                    />
                </div>

                <div className={styles.formItem}>
                    <input
                        className={styles.formInput}
                        type="number"
                        min={1}
                        max={1000000}
                        step={0.1}
                        value={price}
                        onChange={handleChange('price')}
                    />
                </div>

                <div className={styles.formItem}>
                    <select className={styles.formInput} onChange={handleChange('category')}>
                        <option>Category</option>
                        {categories &&
                            categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.title}
                                </option>
                            ))}
                    </select>
                </div>

                <div className={styles.formItem}>
                    <select className={styles.formInput} onChange={handleChange('shipping')}>
                        <option>Shipping</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>

            </form>
        </div>
    );
}