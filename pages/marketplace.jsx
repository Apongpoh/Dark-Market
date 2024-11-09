import Card from "../components/card";
import Checkbox from "../components/shop/checkbox";
import Menu from "../components/menu";
import RadioBox from "../components/shop/radiobox";
import styles from "../styles/Shop.module.css";
import { isAuthenticated, signOut } from "../lib/client/auth";
import { prices } from '../lib/client/fixedPrices';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCategories, filterProducts, searchProduct } from "../lib/client/productAPI/productapi";


export default function Shop() {

    const [currentUser, setCurrentUser] = useState({});
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);
    const [data, setData] = useState({ search: "", results: [], searched: false });
    const [myFilters, setMyFilters] = useState({ filters: { category: [], price: [] } });

    const limit = 6;
    const { search, results, searched } = data;

    const { user } = isAuthenticated();
    const router = useRouter();

    useEffect(() => { setCurrentUser(user) }, []);

    // get categories
    const init = () => {
        getCategories()
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.error) {
                    setError({ error: data.error });
                } else {
                    setCategories(data);
                }
            });
    };

    // filter products
    const loadFilteredResults = newFilters => {
        filterProducts(skip, newFilters)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }
                
                if (data.error) {
                    setError({ error: data.error });
                } else {
                    setFilteredResults(data.data);
                    setSize(data.size);
                    setSkip(0);
                }
            });
    };

    // show filtered results base on their categories
    useEffect(() => {
        init();
        loadFilteredResults(skip, myFilters.filters);
    }, []);

    const handleFilters = (filters, filterBy) => {
        const newFilters = { ...myFilters };
        newFilters.filters[filterBy] = filters;

        if (filterBy === "price") {
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }
        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    };

    const handlePrice = value => {
        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    };

    // search products
    const searchData = () => {
        if (search) {
            searchProduct({ search: search || undefined })
                .then(res => {
                    if (res.error) {
                        setError({ error: res.error })
                    } else {
                        setData({ ...data, results: res, searched: true });
                    }
                });
        }
    };

    const searchSubmit = event => {
        event.preventDefault();
        searchData();
    };

    const handleChange = name => event => {
        setData({ ...data, [name]: event.target.value, searched: false });
    };

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            return <span className={styles.headings}><strong>Search results <span className={styles.bagde}>{results.length}</span></strong></span>
        }
        if (searched && results.length < 1) {
            return <span className={styles.headings}><strong>Products not found</strong></span>;
        }
    };

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h4 style={{ padding: '0 0 10px' }}>
                    {searchMessage(searched, results)}
                </h4>

                <div className={styles.gridShopSearch}>
                    {results.map(product => (
                        <div key={product._id} style={{ padding: '0 0 20px' }}>
                            <Card product={product} />
                        </div>
                    ))}
                </div>

            </div>
        );
    };

    return (
        <div>
            <Menu />
            <div className={styles.container}>

                <div className={styles.rowLeft}>
                    <form style={{ padding: '0 0 15px' }}>
                        <input
                            className={styles.searchInput}
                            onChange={handleChange("search")}
                            type="search"
                            placeholder="Search..."
                        />
                        <button className={styles.seachBox} type="submit" onClick={searchSubmit}><i className="fa fa-search"></i></button>
                    </form>

                    <div style={{ padding: '0 0 15px' }}>
                        <p><strong>Categories</strong></p>
                        <ul className={styles.list}>
                            <Checkbox
                                categories={categories}
                                handleFilters={filters => handleFilters(filters, "category")}
                            />
                        </ul>
                    </div>

                    <div style={{ padding: '0 0 15px' }}>
                        <p><strong>Price range</strong></p>
                        <ul className={styles.list}>
                            <RadioBox
                                prices={prices}
                                handleFilters={filters => handleFilters(filters, "price")}
                            />
                        </ul>
                    </div>

                </div>

                <div className={styles.rowRight} onScroll={() => size > 0 && size <= limit}>

                    <div  style={{textAlign: 'center'}}>
                        <h1><span style={{color: 'grey'}}>{currentUser.username},</span> welcome to Terre Market</h1>
                    </div>

                    <div style={{ padding: '0 0 15px' }}>
                        {searchedProducts(results)}
                    </div>

                    <p className={styles.headings} style={{ padding: '0 0 10px' }}><strong>Featured Listing <span className={styles.bagde}>{filteredResults.length}</span></strong></p>

                    <div className={styles.gridShopContainer}>
                        {filteredResults.map(product => (
                            <div key={product._id}>
                                <Card product={product} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}