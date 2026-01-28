import {Link, useNavigate} from 'react-router-dom';
import Button from '../ui/Button';
import styles from './Navbar.module.css';
import {useContext, useState, useEffect} from "react";
import {UserContext} from "../../context/UserContext.js";
import CreatePostModal from "../modals/CreatePostModal.jsx";
import {BASE_URL, SEARCH_USER_ENDPOINT} from "../../config/config.js";
import axios from "axios";

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);

    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const navigate = useNavigate();
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (search.trim() === "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            performSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const performSearch = async () => {
        setIsSearching(true);
        setShowResults(true);

        const requestHeaders = {};
        if (BASE_URL.includes("ngrok")) {
            requestHeaders["ngrok-skip-browser-warning"] = "true";
        }

        try {
            const res = await axios.get(BASE_URL + SEARCH_USER_ENDPOINT, {
                headers: requestHeaders,
                params: { query: search }
            });

            if (res.data.success) {
                setSearchResults(res.data.userSearchDtos || []);
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleUserClick = (username) => {
        setSearch("");
        setShowResults(false);
        navigate(`/profile/${username}`);
    };

    if (!user.id) {
        return (
            <header className={styles.header}>
                <div className={styles.container}>

                    {/* צד שמאל: לוגו */}
                    {/* צד שמאל: לוגו (למשתמש לא מחובר) */}
                    <Link to="/" className={styles.logoLink}>
                        {/* הורדתי את ה- <a href> */}
                        <div className={styles.logoIcon}>
                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h1 className={styles.brandName}>Clusters</h1>
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
                <Link to="/feed" className={styles.brand}>
                    <div className={styles.logoIcon}>
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h1 className={styles.brandName}>Clusters</h1>
                </Link>

                {/* אמצע: חיפוש (נשאר אותו דבר) */}
                <div className={styles.searchContainer}>
                    <label className={styles.searchLabel}>
                        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
                        <input
                            type="text"
                            value={search}
                            className={styles.searchInput}
                            placeholder="Search users..."
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => { if (search) setShowResults(true); }}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        />
                    </label>

                    {/* --- דרופ-דאון תוצאות --- */}
                    {showResults && search.length > 0 && (
                        <div className={styles.searchResultsDropdown}>
                            {isSearching ? (
                                <div className={styles.searchMessage}>Searching...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((resultUser) => (
                                    <div
                                        key={resultUser.id}
                                        className={styles.resultItem}
                                        onClick={() => handleUserClick(resultUser.username)}
                                    >
                                        <img
                                            src={resultUser.pictureUrl || "https://robohash.org/" + resultUser.username}
                                            alt={resultUser.username}
                                            className={styles.resultAvatar}
                                        />
                                        <div className={styles.resultInfo}>
                                            <span className={styles.resultName}>
                                                {resultUser.firstName} {resultUser.lastName}
                                            </span>
                                            <span className={styles.resultUsername}>
                                                @{resultUser.username}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.searchMessage}>No users found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* צד ימין: פעולות */}
                <div className={styles.actions}>

                    {/* כפתור הבית - הפכתי ל-Link */}
                    <Link to="/feed" className={styles.homeBtn} title="Home">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>home</span>
                    </Link>

                    {/* כפתור יצירת פוסט */}
                    <button
                        className={styles.createBtn}
                        onClick={() => setIsPostModalOpen(true)}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                        <span className={styles.createBtnText}>Create Post</span>
                    </button>

                    <div className={styles.divider}></div>

                    {/* כפתור פרופיל - התיקון הגדול! */}
                    <Link to={`/profile/${user.username}`} className={styles.profileBtn}>

                        <div className={styles.avatarWrapper}>
                            {/* שימוש בתגית IMG אמיתית עם ה-SRC הדינמי */}
                            <img
                                src={user.pictureUrl}
                                alt={user.username}
                                className={styles.avatar}
                            />
                        </div>

                        <div className={styles.onlineBadge}></div>
                    </Link>

                </div>

            </div>

            {isPostModalOpen &&
                <CreatePostModal onClose={() => setIsPostModalOpen(false)} />
            }

        </nav>
    );
};

export default Navbar;