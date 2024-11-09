import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Card.module.css';
import ReactStars from 'react-stars';
import { isAuthenticated } from '../lib/client/auth';
import { useState, useEffect } from 'react';
import { getReviews } from '../lib/client/reviewsAPI/reviewsapi';


export default function Card({ product }) {

  const [currentUser, setCurrentUser] = useState({});
  const [reviews, setReviews] = useState([]);

  const { user } = isAuthenticated();

  useEffect(() => setCurrentUser(user), []);

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

  const productReviews = reviews.filter((review) => review.productId === product._id && review);
  const productRating = productReviews.map(pr => pr.rating);

  let sum = 0;

  for (let i = 0; i < productRating.length; i++) {
    sum += productRating[i];
  }

  const averageRating = Math.round(sum / productRating.length);

  return (
    <div className={styles.card}>

      <Link href={`/product/${product._id}`}>
        <Image
          src={`/api/product/photo/${product._id}`}
          width={230}
          height={0}
          alt=""
          className={styles.smallScreen}
          style={{ width: '230', height: '218' }}
        />
      </Link>

      <div className={styles.cardBody}>
        <p>{product.title.toUpperCase()}</p>

        <div className={styles.rightRating}>
          <ReactStars
            count={5}
            size={24}
            value={averageRating || 0}
            half={false}
            color2={'#ffd700'} />
        </div>

        <p style={{ padding: '0 0 7px', }}><Link href={`/product/${product._id}`} style={{ color: 'rgba(250, 0, 0, 0.821)' }}>Buy Now</Link>: <sup>$</sup><strong>{product.price}</strong></p>
        <p style={{ padding: '0 0 7px', color: 'rgba(0, 0, 250, 0.421)' }}><Link href={`/review/${currentUser._id}/${product._id}`}>Ratings and Reviews</Link></p>
        <p>{product.description && product.description.slice(0, 15)}...<Link href={`/product/${product._id}`} style={{ color: 'grey' }}>see more</Link> </p>
      </div>

    </div>
  );
}