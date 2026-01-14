import {Link, useNavigate} from 'react-router-dom';
import Button from '../ui/Button';
import styles from './Navbar.module.css';
import {useContext} from "react";
import {UserContext} from "../../context/UserContext.js";

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();


    if (!user.id) {
        return (
            <header className={styles.header}>
                <div className={styles.container}>

                    {/* צד שמאל: לוגו */}
                    <Link to="/" className={styles.logoLink}>
                        <a href="#" className={styles.brand}>
                            <div className={styles.logoIcon}>
                                {/* SVG של הלוגו */}
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <h1 className={styles.brandName}>SocialLoop</h1>
                        </a>
                    </Link>

                    {/* צד ימין: כפתורים */}
                    <div className={styles.actions}>

                        {/* כפתור התחברות - משני */}
                        <Link to="/login" className={styles.linkWrapper}>
                            <Button variant="secondary">
                                Log In
                            </Button>
                        </Link>

                        {/* כפתור הרשמה - ראשי */}
                        <Link to="/register" className={styles.linkWrapper}>
                            <Button variant="primary">
                                Join Now
                            </Button>
                        </Link>

                    </div>

                </div>
            </header>
        );
    }
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>

                {/* צד שמאל: לוגו */}
                <Link to="/" className={styles.brand}>
                    {/* ... ה-SVG נשאר אותו דבר ... */}
                    <div className={styles.logoIcon}>
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h1 className={styles.brandName}>SocialLoop</h1>
                </Link>

                {/* אמצע: חיפוש (נשאר אותו דבר) */}
                <div className={styles.searchContainer}>
                    <label className={styles.searchLabel}>
                        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search for creators, posts, or tags..."
                        />
                    </label>
                </div>

                {/* צד ימין: פעולות */}
                <div className={styles.actions}>

                    {/* כפתור הבית - הפכתי ל-Link */}
                    <Link to="/" className={styles.homeBtn} title="Home">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>home</span>
                    </Link>

                    {/* כפתור יצירת פוסט */}
                    <button className={styles.createBtn}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                        <span className={styles.createBtnText}>Create Post</span>
                    </button>

                    <div className={styles.divider}></div>

                    {/* כפתור פרופיל - התיקון הגדול! */}
                    <Link to={`/profile/${user.username}`} className={styles.profileBtn}>

                        <div className={styles.avatarWrapper}>
                            {/* שימוש בתגית IMG אמיתית עם ה-SRC הדינמי */}
                            <img
                                src={user.imageUrl}
                                alt={user.username}
                                className={styles.avatar}
                            />
                        </div>

                        <div className={styles.onlineBadge}></div>
                    </Link>

                </div>

            </div>
        </nav>
    );
};

export default Navbar;