import styles from './Post.module.css';
import {useContext, useState} from "react";
import axios from "axios";
import {BASE_URL, TOGGLE_LIKE , DELETE_POST_ENDPOINT} from "../../config/config.js";
import {UserContext} from "../../context/UserContext.js";
import {formatTimeAgo} from "../../utils/timeUtils.js";
import {useNavigate} from "react-router-dom";

const Post = (props) => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const isOwner = user.id === props.details.authorId


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

    const handleProfileClick = (e) => {
        e.stopPropagation();
        navigate(`/profile/${props.details.authorUsername}`);
    };

    const relativeTime = formatTimeAgo(props.details.createdAt);

    const handleDeleteClick = () => {
        setIsMenuOpen(false);

        axios.delete(BASE_URL + DELETE_POST_ENDPOINT, {
            headers: requestHeaders,
            params: {
                postId: props.details.id,
                userId: user.id
            }
        })
            .then((res) => {
                if (res.data.success) {
                    if (props.onDelete) {
                        props.onDelete(props.details.id);
                    }
                } else {
                    alert("Failed to delete post");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Error occurred while deleting post");
            });
    };

    return (
        <article className={styles.card}>

            {/* === Header === */}
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    {/* תמונת פרופיל של כותב הפוסט */}
                    <img
                        src={props.details.authorProfileImage ? props.details.authorProfileImage : "https://robohash.org/" + props.details.authorUsername.charAt(0)}
                        alt={props.details.authorFirstName}
                        className={`${styles.avatar} ${styles.clickable}`}
                        onClick={handleProfileClick}
                    />
                    <div className={styles.userMeta}>
                        <h4
                            className={`${styles.userName} ${styles.clickable}`}
                            onClick={handleProfileClick}
                        >
                            {props.details.authorFirstName + " " + props.details.authorLastName}
                        </h4>
                        <span className={styles.timestamp}>{relativeTime}</span>
                    </div>
                </div>

                {/* כפתור שלוש נקודות + דרופ-דאון */}
                {isOwner && (
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
                                <button
                                    className={styles.deleteBtn}
                                    onClick={handleDeleteClick}
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>delete</span>
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
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
                        className={`${styles.actionBtn} ${styles.likeBtn} ${props.details.liked ? styles.liked : ''}`}
                        onClick={() => props.onLike(props.details.id)}>
                        <span className={`material-symbols-outlined ${styles.icon}`}>favorite</span>
                        <span>{props.details.likeCount || 0}</span>
                    </button>

                    <button
                        className={styles.actionBtn}
                        onClick={props.onCommentClick}>
                        <span className={`material-symbols-outlined ${styles.icon}`}>chat_bubble</span>
                        <span>{props.details.commentCount || 0}</span>
                    </button>

                </div>

            </div>

        </article>
    );
};

export default Post;