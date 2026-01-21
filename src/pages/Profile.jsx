import styles from './Profile.module.css';
import {useEffect, useState, useMemo, useContext, useRef} from "react";
import {
    BASE_URL, FOLLOW_USER_ENDPOINT,
    FOLLOWERS_COUNT_ENDPOINT,
    FOLLOWING_COUNT_ENDPOINT, GET_USER_POSTS_ENDPOINT,
    PROFILE_ENDPOINT,
    UNFOLLOW_USER_ENDPOINT,
    TOGGLE_LIKE
} from "../config/config.js";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import FollowModal from "../components/modals/FollowModal.jsx";
import FollowButton from "../components/ui/FollowButton.jsx";
import {UserContext} from "../context/UserContext.js";
import Post from "../components/feed/Post.jsx";
import PostModal from "../components/modals/PostModal.jsx";

const Profile = (props) => {
    const { user } = useContext(UserContext)
    const [isLoggedUserProfile, setIsLoggedUserProfile] = useState(false)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [description, setDescription] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [createdAt, setCreatedAt] = useState("")
    const [id, setId] = useState(props.id ? props.id : null)
    const [isFollowing,setIsFollowing] = useState(false)
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [postCount, setPostCount] = useState(0)

    const [isFollowersOpen, setIsFollowerOpen] = useState(false)
    const [isFollowingModal, setIsFollowingModal] = useState(true);
    const [isFollowModalOwnProfile, setIsFollowModalOwnProfile] = useState(false);


    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);

    const [errorCode, setErrorCode] = useState(null)

    //PARAMS (USERNAME)
    const { username: urlUsername } = useParams();
    const navigate = useNavigate();


    const requestHeaders = {};
    if (BASE_URL.includes("ngrok")) {
        requestHeaders["ngrok-skip-browser-warning"] = "true";
    }

    useEffect(() => {
        // === שלב 1: איפוס אגרסיבי (Kill Switch) ===
        // ברגע שהשם בכתובת משתנה, אנחנו מוחקים את הזהות הקודמת
        setId(null);
        setPosts([]);
        setPage(1);
        setHasMore(true);
        setInitialLoadComplete(false);
        setErrorCode(null);
        window.scrollTo(0, 0);

        // שימוש ב-AbortController לביטול בקשות ישנות אם המשתמש לוחץ מהר
        const controller = new AbortController();


        axios.get(BASE_URL + PROFILE_ENDPOINT, {
            signal: controller.signal, // מחבר את הביטול לריקווסט
            headers: requestHeaders,
            params: {
                myUserId: user.id,
                targetUserId: null,
                targetUsername: urlUsername
            }
        })
            .then((res) => {
                if (res.data.success){
                    // עדכון כל הנתונים הרגילים...
                    setFirstName(res.data.user.firstName);
                    setLastName(res.data.user.lastName);
                    setUsername(res.data.user.username);
                    setDescription(res.data.user.description);
                    setCity(res.data.user.city);
                    setCountry(res.data.user.country);
                    setImageUrl(res.data.user.pictureUrl ? res.data.user.pictureUrl : "https://robohash.org/" + res.data.user.username.charAt(0));
                    setCreatedAt(res.data.user.createdAt);
                    setFollowers(res.data.followersCount);
                    setFollowing(res.data.followingCount);
                    setIsFollowing(res.data.following);
                    setIsLoggedUserProfile(user.id === res.data.user.id);
                    setPostCount(res.data.postCount);

                    // === שלב 2: החייאה ===
                    // רק עכשיו, כשהכל מוכן, אנחנו נותנים ID חדש.
                    // זה הטריגר שיפעיל את הפוסטים.
                    setId(res.data.user.id);
                }
                else {
                    setErrorCode(res.data.errorCode);
                }
            })
            .catch((err)=>{
                if (axios.isCancel(err)) {
                    console.log("Request cancelled due to navigation");
                } else {
                    console.error(err);
                }
            });

        // פונקציית ניקוי: מבטלת את הריקווסט אם המשתמש ברח לפני שזה נגמר
        return () => controller.abort();

    }, [urlUsername, user]); // תלוי רק בשינוי כתובת


    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        setIsLoading(true);

        axios.get(BASE_URL + GET_USER_POSTS_ENDPOINT, {
            signal: controller.signal,
            headers: requestHeaders,
            params: {
                targetUserId: id,
                currentUserId: user.id,
                page: page
            }
        })
            .then((res) => {
                if (res.data.success) {
                    if (res.data.posts.length === 0) {
                        setHasMore(false);
                    }

                    setPosts(prev => {
                        // אם זה עמוד 1, דורסים. אחרת מוסיפים.
                        if (page === 1) return [...res.data.posts];

                        // סינון כפילויות ליתר ביטחון
                        const newPosts = res.data.posts.filter(n => !prev.some(p => p.id === n.id));
                        return [...prev, ...newPosts];
                    });
                }
            })
            .catch((err)=>{
                if (!axios.isCancel(err)) console.error(err);
            })
            .finally(() => {
                // רק אם הריקווסט לא בוטל, נסיים טעינה
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                    setInitialLoadComplete(true);
                }
            });

        return () => controller.abort(); // ביטול ריקווסטים ישנים

    }, [id, page]); // רץ רק כשיש ID ופייג'


    useEffect(() => {
        if (!id || !initialLoadComplete) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading && posts.length > 0) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, isLoading, id, posts.length, initialLoadComplete]);




    const formatedCreatedAt = useMemo(() => {
        if (!createdAt) return "";

        const date = new Date(createdAt);
        if (isNaN(date.getTime())) return "";

        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${year}`;
    }, [createdAt]);


    useEffect(() => {
        const handleNewPostEvent = (event) => {
            const newPost = event.detail;

            if (isLoggedUserProfile) {

                setPosts(prev => [newPost, ...prev]);

                setPostCount(prev => prev + 1);

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        window.addEventListener('new-post-created', handleNewPostEvent);

        return () => {
            window.removeEventListener('new-post-created', handleNewPostEvent);
        };
    }, [isLoggedUserProfile]);

    const handleDeletePost = (postId) => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));

        setPostCount(prev => prev - 1);
    };

    const handleLikeToggle = (postId) => {
        const formData = new FormData();
        formData.append("userId", user.id);
        formData.append("postId", postId);

        const postHeaders = { "Content-Type": "multipart/form-data" };
        if (BASE_URL.includes("ngrok")) postHeaders["ngrok-skip-browser-warning"] = "true";

        axios.post(BASE_URL + TOGGLE_LIKE, formData, { headers: postHeaders })
            .then((res) => {
                if (res.data.success) {
                    const isLikedNow = res.data.liked;

                    setPosts(prevPosts => prevPosts.map(post => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                liked: isLikedNow,
                                likeCount: isLikedNow ? post.likeCount + 1 : post.likeCount - 1
                            };
                        }
                        return post;
                    }));

                    if (selectedPost && selectedPost.id === postId) {
                        setSelectedPost(prev => ({
                            ...prev,
                            liked: isLikedNow,
                            likeCount: isLikedNow ? prev.likeCount + 1 : prev.likeCount - 1
                        }));
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* === צד שמאל: פרופיל ומידע (Sticky) === */}
                <aside className={styles.leftSidebar}>
                    <div className={styles.stickyWrapper}>

                        {/* כרטיס פרופיל */}
                        <div className={styles.profileCard}>
                            <div className={styles.cardDecoration}></div>

                            <div className={styles.avatarContainer}>
                                <img
                                    src={imageUrl}
                                    alt={firstName + " " + lastName}
                                    className={styles.avatar}
                                />
                            </div>

                            <h1 className={styles.userName}>{firstName + " " + lastName}</h1>
                            <p className={styles.userHandle}>@{username}</p>

                            <p className={styles.userBio}>
                                {description}
                            </p>

                            <div className={styles.actionsRow}>

                                {urlUsername !== user.username ?

                                <>
                                        <FollowButton
                                            targetUserId={id}
                                            initialIsFollow={isFollowing}
                                            className={styles.followBtn}
                                            onSuccess={(isNowFollow) => {
                                                setIsFollowing(isNowFollow);
                                                setFollowers(prev => isNowFollow ? prev + 1 : prev - 1);
                                            }}
                                            followContent={
                                                <>
                                                    <span className="material-symbols-outlined" style={{fontSize: '18px'}}>person_add</span>
                                                    Follow
                                                </>
                                            }
                                            unfollowContent={
                                                <>
                                                    <span className="material-symbols-outlined" style={{fontSize: '18px'}}>person_off</span>
                                                    Unfollow
                                                </>
                                            }
                                        />

                                    <button className={styles.messageBtn}>
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>mail</span>
                                        Message
                                    </button>
                                </>
                                :
                                    <>
                                        <button
                                            className={styles.followBtn}
                                            onClick={() =>
                                                navigate("/edit-profile")}>
                                            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>person_edit</span>
                                            Edit Profile
                                        </button>
                                    </>
                                }

                            </div>

                            <div className={styles.statsGrid}>

                                {/* כפתור Followers - לחיץ */}
                                <button
                                    className={`${styles.statItem} ${styles.clickableStat}`}
                                    onClick={() => {
                                        setIsFollowerOpen(true)
                                        setIsFollowingModal(false)
                                        setIsFollowModalOwnProfile(true)
                                    }}
                                >
                                    <span className={styles.statNumber}>{followers}</span>
                                    <span className={styles.statLabel}>Followers</span>
                                </button>

                                {/* כפתור Following - לחיץ */}
                                <button
                                    className={`${styles.statItem} ${styles.clickableStat}`}
                                    onClick={() => {
                                        setIsFollowerOpen(true)
                                        setIsFollowingModal(true)
                                        setIsFollowModalOwnProfile(false)
                                    }}
                                >
                                    <span className={styles.statNumber}>{following}</span>
                                    <span className={styles.statLabel}>Following</span>
                                </button>

                                {/* Posts - לא לחיץ (נשאר DIV רגיל) */}
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{postCount}</span>
                                    <span className={styles.statLabel}>Posts</span>
                                </div>

                            </div>
                        </div>

                        {/* כרטיס מידע נוסף */}
                        <div className={styles.infoCard}>
                            <h3 className={styles.sectionTitle}>About</h3>

                            {(city|| country) &&
                            <div className={styles.infoRow}>
                                <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>location_on</span>
                                <span style={{fontSize: '14px'}}>{city+ ", " + country}</span>
                            </div>
                            }
                            <div className={styles.infoRow}>
                                <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>calendar_month</span>
                                <span style={{fontSize: '14px'}}>Joined at {formatedCreatedAt}</span>
                            </div>

                            <div className={styles.mutualFriends}>
                                <h4 className={styles.sectionTitle} style={{fontSize: '12px', marginBottom: '12px'}}>Mutual Followers</h4>
                                <div className={styles.avatarsGroup}>
                                    <img src="https://i.pravatar.cc/100?img=11" className={styles.friendAvatar} alt="Friend" />
                                    <img src="https://i.pravatar.cc/100?img=12" className={styles.friendAvatar} alt="Friend" />
                                    <img src="https://i.pravatar.cc/100?img=13" className={styles.friendAvatar} alt="Friend" />
                                    <div className={styles.moreFriends}>+5</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </aside>

                <section className={styles.feedSection} key={id}>

                    <div className={styles.postsGrid}>
                        {posts.length > 0 &&
                            posts.map((post) => {
                                return(
                                    <Post
                                        key={post.id}
                                        details={post}
                                        onDelete={handleDeletePost}
                                        onCommentClick={() => setSelectedPost(post)}
                                        onLike={handleLikeToggle}/>
                                )
                            })
                        }
                    </div>

                    {/* === 1. הטוען (Loader) === */}
                    {hasMore && posts.length > 0 && initialLoadComplete && (
                        <div
                            ref={observerTarget}
                            style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '32px'}}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{animation: 'spin 1s linear infinite', color: 'var(--primary)', fontSize: '32px'}}
                            >
                                refresh
                            </span>
                        </div>
                    )}

                    {/* === 2. הודעת סיום (יש פוסטים, אבל הגענו לסוף) === */}
                    {!hasMore && posts.length > 0 && (
                        <div className={styles.feedMessage}>
                            <span className="material-symbols-outlined">check_circle</span>
                            <p>You're all caught up!</p>
                        </div>
                    )}

                    {/* === 3. הודעת "אין פוסטים" (ריק לגמרי ולא בטעינה) === */}
                    {/* הוספנו בדיקה !isLoading כדי שזה לא יהבהב בזמן שטוענים את הראשונים */}
                    {!hasMore && posts.length === 0 && !isLoading && (
                        <div className={styles.feedMessage}>
                            <span className="material-symbols-outlined">post_add</span>
                            <p>No posts yet</p>
                            <p style={{fontSize: '12px', opacity: 0.7}}>
                                {urlUsername === user.username
                                    ? "Share your first moment with the world."
                                    : "This user hasn't posted anything yet."}
                            </p>
                        </div>
                    )}

                </section>

            </div>

            {isFollowersOpen && (
                <>

                    <FollowModal
                        onClose={() => setIsFollowerOpen(false)}
                        isFollowingModal = {isFollowingModal}
                        targetUserId = {id}
                        isFollowModalOwnProfile = {isFollowModalOwnProfile}
                        isLoggedUserProfile = {isLoggedUserProfile}
                        onSuccess = {(isAddFollow, removeFollower = false) => {
                            if (isLoggedUserProfile && !removeFollower){
                                setFollowing(prev => isAddFollow ? Number(prev) + 1 : Number(prev) - 1);
                            }
                            if (isLoggedUserProfile && removeFollower){
                                setFollowers(prev => isAddFollow ? Number(prev) + 1 : Number(prev) - 1);
                            }
                        }}
                    >

                    </FollowModal>
                </>
            )}

            {selectedPost && (

                <PostModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onLike={handleLikeToggle}
                />
            )}

        </div>
    );
};

export default Profile;