import styles from './Profile.module.css';
import {useEffect, useState, useMemo, useContext} from "react";
import {BASE_URL, FOLLOWERS_COUNT_ENDPOINT, FOLLOWING_COUNT_ENDPOINT, PROFILE_ENDPOINT} from "../config/config.js";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {UserContext} from "../UserContext.jsx";

const Profile = () => {
    const { user, setUser } = useContext(UserContext)

    const [firstName,setFirstName] = useState("")
    const [lastName,setLastName] = useState("")
    const [username,setUsername] = useState("")
    const [createdAt, setCreatedAt] = useState("")
    const [description,setDescription] = useState("")
    const [city,setCity] = useState("")
    const [country, setCountry] = useState("")
    const [imageProfile,setImageProfile] = useState("")
    const [id,setId] = useState(0)
    const [isFollowing,setIsFollowing] = useState(false)
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);

    const [errorCode, setErrorCode] = useState(null)

    //PARAMS (USERNAME)
    const { usernameParam } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const requestHeaders = {};
        if (BASE_URL.includes("ngrok")) {
            requestHeaders["ngrok-skip-browser-warning"] = "true";
        }

        axios.get(BASE_URL + PROFILE_ENDPOINT, {
            headers: requestHeaders,
            params: {
                myUserId: 23,
                targetUserId: "23"
            }
        })
            .then((res) => {
            if (res.data.success){
                setUser({
                    firstName: res.data.user.firstName,
                    lastName: res.data.user.lastName,
                    username: res.data.user.username,
                    description: res.data.user.description,
                    city: res.data.user.city,
                    country: res.data.user.country,
                    id: res.data.user.id,
                    imageUrl: res.data.user.pictureUrl ? res.data.user.pictureUrl : "https://robohash.org/" + res.data.user.username.charAt(0)

                })
                setCreatedAt(res.data.user.createdAt)
                setFollowers(res.data.followersCount)
                setFollowing(res.data.followingCount)
                setIsFollowing(res.data.following)

            }
            else {
                setErrorCode(res.data.errorCode)
            }
        })
            .catch((err)=>{
                console.error(err)
            })

    }, []);




    const formatedCreatedAt = useMemo(() => {
        if (!createdAt) return "";

        const date = new Date(createdAt);
        if (isNaN(date.getTime())) return "";

        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${year}`;
    }, [createdAt]);

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
                                    src={user.imageUrl}
                                    alt={user.firstName + " " + user.lastName}
                                    className={styles.avatar}
                                />
                                <div className={styles.onlineBadge}></div>
                            </div>

                            <h1 className={styles.userName}>{user.firstName + " " + user.lastName}</h1>
                            <p className={styles.userHandle}>@{user.username}</p>

                            <p className={styles.userBio}>
                                {user.description}
                            </p>

                            <div className={styles.actionsRow}>

                                {usernameParam === id ?

                                <>
                                    <button className={styles.followBtn}>
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>{isFollowing? "person_off" : "person_add"}</span>
                                        {isFollowing? "Unfollow" : "Follow"}
                                    </button>

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
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{followers}</span>
                                    <span className={styles.statLabel}>Followers</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{following}</span>
                                    <span className={styles.statLabel}>Following</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>89</span>
                                    <span className={styles.statLabel}>Posts</span>
                                </div>
                            </div>
                        </div>

                        {/* כרטיס מידע נוסף */}
                        <div className={styles.infoCard}>
                            <h3 className={styles.sectionTitle}>About</h3>

                            {(user.city || user.country ) &&
                            <div className={styles.infoRow}>
                                <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>location_on</span>
                                <span style={{fontSize: '14px'}}>{user.city + ", " + user.country}</span>
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

                {/* === צד ימין: ה-Feed === */}
                <section className={styles.feedSection}>

                    {/* טאבים */}
                    <div className={styles.tabs}>
                        <button className={`${styles.tabBtn} ${styles.activeTab}`}>Posts</button>
                        <button className={styles.tabBtn}>About</button>
                        <button className={styles.tabBtn}>Friends</button>
                        <button className={styles.tabBtn}>Photos</button>
                    </div>

                    {/* כאן היה ה-Input של יצירת פוסט ומחקתי אותו כבקשתך */}

                    {/* גריד הפוסטים */}
                    <div className={styles.postsGrid}>

                        {/* Post 1: Image Heavy */}
                        <article className={styles.postCard}>
                            <div className={styles.postHeader}>
                                <div className={styles.authorInfo}>
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64" className={styles.authorAvatar} alt="User" />
                                    <div>
                                        <h4 className={styles.authorName}>Jane Doe</h4>
                                        <span className={styles.postTime}>2 hours ago</span>
                                    </div>
                                </div>
                                <button className={styles.moreBtn}>
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>

                            <div className={styles.postText}>
                                Just finished working on a new design system concept. What do you think about these colors? 🎨✨
                            </div>

                            <div className={styles.postImageContainer}>
                                <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800" className={styles.postImage} alt="Post" />
                            </div>

                            <div className={styles.postFooter}>
                                <div className={styles.interactions}>
                                    <button className={`${styles.actionBtn} ${styles.likeBtn}`}>
                                        <span className="material-symbols-outlined">favorite</span> 243
                                    </button>
                                    <button className={styles.actionBtn}>
                                        <span className="material-symbols-outlined">chat_bubble</span> 18
                                    </button>
                                </div>
                                <button className={styles.actionBtn}>
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </article>

                        {/* Post 2: Quote */}
                        <article className={styles.postCard}>
                            <div className={styles.postHeader}>
                                <div className={styles.authorInfo}>
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64" className={styles.authorAvatar} alt="User" />
                                    <div>
                                        <h4 className={styles.authorName}>Jane Doe</h4>
                                        <span className={styles.postTime}>5 hours ago</span>
                                    </div>
                                </div>
                                <button className={styles.moreBtn}>
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>

                            <div className={styles.quoteContainer}>
                                <p className={styles.quoteText}>
                                    "Design is not just what it looks like and feels like. Design is how it works."
                                </p>
                            </div>
                            <div className={styles.quoteAuthor}>— Steve Jobs</div>

                            <div className={styles.postFooter}>
                                <div className={styles.interactions}>
                                    <button className={`${styles.actionBtn} ${styles.likeBtn}`}>
                                        <span className="material-symbols-outlined">favorite</span> 856
                                    </button>
                                    <button className={styles.actionBtn}>
                                        <span className="material-symbols-outlined">chat_bubble</span> 42
                                    </button>
                                </div>
                                <button className={styles.actionBtn}>
                                    <span className="material-symbols-outlined">bookmark</span>
                                </button>
                            </div>
                        </article>

                        {/* Post 3: Project (Span Two Columns) */}
                        <article className={`${styles.postCard} ${styles.spanTwo}`}>
                            <div className={styles.postHeader}>
                                <div className={styles.authorInfo}>
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64" className={styles.authorAvatar} alt="User" />
                                    <div>
                                        <h4 className={styles.authorName}>Jane Doe</h4>
                                        <span className={styles.postTime}>1 day ago</span>
                                    </div>
                                </div>
                                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                    <span style={{background: 'rgba(91, 19, 236, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'}}>PROJECT</span>
                                    <button className={styles.moreBtn}>
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.projectLayout}>
                                <div className={styles.projectImageWrapper}>
                                    <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800" className={styles.postImage} alt="Project" />
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                    <h3 className={styles.projectTitle}>Revamping the Dashboard UI</h3>
                                    <p style={{fontSize: '14px', color: '#d1d5db', lineHeight: '1.6'}}>
                                        Spent the last weekend optimizing the rendering performance of our main dashboard. Achieved a 40% reduction in load time! 🚀
                                    </p>
                                    <div className={styles.projectTags}>
                                        <span className={styles.tag}>#ReactJS</span>
                                        <span className={styles.tag}>#Performance</span>
                                        <span className={styles.tag}>#WebDev</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.postFooter}>
                                <div className={styles.interactions}>
                                    <button className={`${styles.actionBtn} ${styles.likeBtn}`}>
                                        <span className="material-symbols-outlined">favorite</span> 1.4k
                                    </button>
                                    <button className={styles.actionBtn}>
                                        <span className="material-symbols-outlined">chat_bubble</span> 89
                                    </button>
                                </div>
                                <button className={styles.actionBtn}>
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </article>

                        {/* Post 4: Gallery */}
                        <article className={styles.postCard}>
                            <div className={styles.postHeader}>
                                <div className={styles.authorInfo}>
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64" className={styles.authorAvatar} alt="User" />
                                    <div>
                                        <h4 className={styles.authorName}>Jane Doe</h4>
                                        <span className={styles.postTime}>3 days ago</span>
                                    </div>
                                </div>
                                <button className={styles.moreBtn}>
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>

                            <div className={styles.postText}>
                                Workspace vibes today. ☕️🎧
                            </div>

                            <div className={styles.galleryGrid}>
                                <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=400" className={styles.postImage} alt="Workspace" />
                                <img src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=400" className={styles.postImage} alt="Code" />
                            </div>

                            <div className={styles.postFooter}>
                                <div className={styles.interactions}>
                                    <button className={`${styles.actionBtn} ${styles.likeBtn}`}>
                                        <span className="material-symbols-outlined">favorite</span> 512
                                    </button>
                                    <button className={styles.actionBtn}>
                                        <span className="material-symbols-outlined">chat_bubble</span> 34
                                    </button>
                                </div>
                                <button className={styles.actionBtn}>
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </article>

                    </div>

                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '32px'}}>
                        <span className="material-symbols-outlined" style={{animation: 'spin 1s linear infinite', color: 'var(--primary)', fontSize: '32px'}}>refresh</span>
                    </div>

                </section>

            </div>
        </div>
    );
};

export default Profile;