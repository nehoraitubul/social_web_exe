import styles from './Post.module.css';
import {useContext, useState} from "react";
import axios from "axios";
import {BASE_URL, TOGGLE_LIKE} from "../../config/config.js";
import {UserContext} from "../../context/UserContext.js";

const Post = (props) => {
    const { user } = useContext(UserContext)
    const [liked, setLiked] = useState(props.details.liked || false)
    const [likeCount, setLikeCount] = useState(props.details.likeCount)


    const requestHeaders = {
        "Content-Type": "multipart/form-data"
    };

    if (BASE_URL.includes("ngrok")) {
        requestHeaders["ngrok-skip-browser-warning"] = "true";
    }



    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // בדיקה האם יש תמונה בפוסט הזה
    const hasImage = props.details.pictureUrl && props.details.pictureUrl !== "";

    // בדיקה האם יש טקסט
    const hasText = props.details.content && props.details.content !== "";

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return "Just now";
        if (minutes < 60) {
            return (minutes === 1) ? "1 minute ago" : `${minutes} minutes ago`;
        }

        if (hours < 24) {
            return (hours === 1) ? "1 hour ago" : `${hours} hours ago`;
        }

        if (days < 7) {
            return (days === 1) ? "1 day ago" : `${days} days ago`;
        }


        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();

        return `${d}/${m}/${y}`;
    };

    const relativeTime = formatTimeAgo(props.details.createdAt);



    const handleLikeClick = () =>{
        const formData = new FormData();
        formData.append("userId" , user.id)
        formData.append("postId", props.details.id)

        axios.post(BASE_URL + TOGGLE_LIKE ,formData,
            {
                headers: requestHeaders,

            })
            .then((res)=>{
                if(res.data.success){
                    if(res.data.liked){
                        setLiked(true)
                        setLikeCount(perv => perv + 1)
                    }
                    else {
                        setLiked(false)
                        setLikeCount(perv => perv - 1)
                    }
                }
            })
            .catch((err)=>{
                console.error(err)
            })
    }

    return (
        <article className={styles.card}>

            {/* === Header === */}
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    {/* תמונת פרופיל של כותב הפוסט */}
                    <img
                        src={props.details.authorProfileImage ? props.details.authorProfileImage : "https://robohash.org/" + props.details.authorUsername.charAt(0)}
                        alt={props.details.authorFirstName}
                        className={styles.avatar}
                    />
                    <div className={styles.userMeta}>
                        <h4 className={styles.userName}>{props.details.authorFirstName + " " + props.details.authorLastName}</h4>
                        <span className={styles.timestamp}>{relativeTime}</span>
                    </div>
                </div>

                {/* כפתור שלוש נקודות + דרופ-דאון */}
                <div className={styles.menuWrapper}>
                    <button
                        className={styles.moreBtn}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="material-symbols-outlined">more_horiz</span>
                    </button>

                    {/* התפריט שנפתח */}
                    {isMenuOpen && (
                        <div className={styles.menuDropdown}>
                            <button className={styles.deleteBtn} onClick={() => {
                                // כאן תבוא הלוגיקה של המחיקה (מהאבא)
                                console.log("Delete clicked");
                                setIsMenuOpen(false);
                            }}>
                                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>delete</span>
                                Delete Post
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* === Body Content === */}

            {/* מקרה 1: טקסט רגיל (כי יש גם תמונה מתחתיו) */}
            {hasText && hasImage && (
                <div className={styles.regularText}>
                    {props.details.content}
                </div>
            )}

            {/* מקרה 2: רק טקסט (בלי תמונה) - מציגים את הרקע המיוחד */}
            {hasText && !hasImage && (
                <div className={styles.fancyTextContainer}>
                    <p className={styles.fancyText}>
                        {props.details.content}
                    </p>
                </div>
            )}

            {/* מקרה 3: תמונה (אם קיימת) */}
            {hasImage && (
                <div className={styles.mediaContainer}>
                    <img
                        src={props.details.pictureUrl}
                        alt="Post content"
                        className={styles.postImage}
                    />
                </div>
            )}

            {/* === Footer / Actions === */}
            <div className={styles.footer}>
                <div className={styles.actionsLeft}>

                    <button
                        className={`${styles.actionBtn} ${styles.likeBtn} ${liked ? styles.liked : ''}`}
                        onClick={handleLikeClick}>
                        <span className={`material-symbols-outlined ${styles.icon}`}>favorite</span>
                        <span>{likeCount || 0}</span>
                    </button>

                    {/*<button className={styles.actionBtn}>*/}
                    {/*    <span className={`material-symbols-outlined ${styles.icon}`}>chat_bubble</span>*/}
                    {/*    <span>{props.details.commentCount || 0}</span>*/}
                    {/*</button>*/}

                </div>

            </div>

        </article>
    );
};

export default Post;