import Image from 'next/image';
import moment from 'moment';
import styles from '../../styles/Manageuser.module.css';
import { isAuthenticated, signOut } from '../../lib/client/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { update, profileImg, coverImg, updateAbout } from '../../lib/client/userAPI/userapi';


export default function Information() {

    const [currentUser, setCurrentUser] = useState({});
    const [values, setValues] = useState({
        about: '',
        profilePicture: '',
        coverPhoto: '',
        formData: new FormData(),
        error: '',
        loading: false
    });

    const router = useRouter();

    const { user, token } = isAuthenticated();

    const { about, profilePicture, coverPhoto, error, formData, loading } = values;

    useEffect(() => setCurrentUser(user), []);

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const handleChangePhoto = name => event => {
        const value = name === 'profilePicture' || 'coverPhoto' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const clickAbout = () => {

        const { about } = values;

        setValues({ ...values, error: false, loading: true });

        updateAbout(currentUser._id, token, { about })
            .then((data) => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setValues({
                        ...values,
                        error: data.msg,
                        success: false,
                        loading: false
                    });
                } else {
                    update(data, () => {
                        setValues({
                            ...values,
                            about: data.about,
                            success: true
                        });
                    });
                }
            });
    };

    const clickProfileImg = () => {
        const { formData } = values;

        profileImg(currentUser._id, token, formData)
            .then(data => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }

                if (data.msg) {
                    setValues({
                        ...values,
                        error: data.msg,
                        success: false,
                        loading: false
                    });
                } else {
                    update(data, () => {
                        setValues({
                            ...values,
                            profilePicture: data.profilePicture,
                            success: true
                        });
                    });
                }
            });
    };

    const clickCoverImg = () => {
        const { formData } = values;

        coverImg(currentUser._id, token, formData)
            .then((data) => {

                if (data.msg === 'Invalid or expired signature. Redirecting to sign in page...') {
                    signOut();
                    router.push('/user-auth/signin');
                }
                
                if (data.msg) {
                    setValues({
                        ...values,
                        error: data.msg,
                        success: false,
                        loading: false
                    });
                } else {
                    update(data, () => {
                        setValues({
                            ...values,
                            coverPhoto: data.coverPhoto,
                            success: true
                        });
                    });
                }
            });
    };

    const clickSubmit = () => {

        if (about) {
            clickAbout();
        } else if (profilePicture) {
            clickProfileImg();
        } else if (coverPhoto) {
            clickCoverImg();
        } else {
            router.reload();
        }
    };

    const showError = () => (
        <div style={{ display: error ? "" : "none", fontSize: 'smaller', color: 'red', margin: '5px' }}>
            <span>{error}</span>
        </div>
    );

    const showLoading = () => (
        loading && <h4 style={{ margin: '5px', textAlign: 'center', color: 'rgba(0, 0, 0, 0.6)' }}><i className="fa fa-spinner fa-spin fa-fw"></i><span className="sr-only">Loading...</span></h4>
    );

    return (
        <div>
            <h4 className={styles.modalHeadings}>Information</h4>

            {showError()}
            {showLoading()}

            <div className={styles.photo}>
                {
                    currentUser.coverPhoto?.ContentType === 'my cover photo' ?
                        <Image
                            src={'/terre.png'}
                            width={350}
                            height={145}
                            alt=''
                            className={styles.coverImg}
                        /> :
                        <Image
                            src={`/api/user-manage/cover-picture/${currentUser._id}`}
                            width={350}
                            height={145}
                            alt=''
                            className={styles.coverImg}
                        />
                }
                <input type='file' className={styles.hideCover} onChange={handleChangePhoto('coverPhoto')} />
                <span className={styles.cameraCover}><i className="fa fa-camera" aria-hidden="true"></i></span>
            </div>

            <div>
                {
                    currentUser.profilePicture?.ContentType === 'my profile photo' ?
                        <Image
                            src={'/terre.png'}
                            width={70}
                            height={70}
                            alt=''
                            className={styles.profileImg}
                        /> :
                        <Image
                            src={`/api/user-manage/profile-picture/${currentUser._id}`}
                            width={70}
                            height={70}
                            alt=''
                            className={styles.profileImg}
                        />
                }
                <input type='file' className={styles.hideProfile} onChange={handleChangePhoto('profilePicture')} />
                <span className={styles.cameraProfile}><i className="fa fa-camera" aria-hidden="true"></i></span>
            </div>

            <div className={styles.info}>
                <p className={styles.username}>{currentUser.username}</p>
                <div>

                    <p style={{ padding: '0 0 10px' }}><span style={{ color: 'green' }}>Joined</span> <strong>{moment(currentUser.createdAt).fromNow()}</strong></p>
                    <p style={{ padding: '0 0 10px' }}><span style={{ color: 'green' }}>Last update</span> <strong>{moment(currentUser.updatedAt).fromNow()}</strong></p>
                    <p style={{ padding: '0 0 10px' }}><span style={{ color: 'green' }}>About me</span> <strong>{currentUser.about}</strong></p>

                    <form>
                        <textarea
                            className={styles.about}
                            minLength={10}
                            maxLength={150}
                            value={about}
                            onChange={handleChange('about')}
                            placeholder="Edit about me (optional). Remember don't! put information that will reveal your true identity."
                        />
                        <p style={{ textAlign: 'end', padding: '0 0 5px' }}>{about.length}/150</p>
                    </form>
                    <button type="button" onClick={clickSubmit} style={{ padding: '3px', cursor: 'pointer', color: 'green' }}>Save changes</button>
                </div>
            </div>

        </div >
    );
}