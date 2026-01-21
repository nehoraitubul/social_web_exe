import styles from './PostModal.module.css';
import {formatTimeAgo} from "../../utils/timeUtils.js";
import {useContext, useEffect, useState,} from "react";
import {BASE_URL, GET_POST_COMMENTS_ENDPOINT} from "../../config/config.js";
import {UserContext} from "../../context/UserContext.js";
import axios from "axios";
import Comment from "../comments/Comment.jsx";

const PostModal = ({ onClose, post , onLike}) => {
    const { user } = useContext(UserContext);


    const hasImage = post.pictureUrl && post.pictureUrl !== "";
    const hasText = post.content && post.content !== "";

    const relativeTime = formatTimeAgo(post.createdAt);
    const [comments, setComments] = useState([])


    const requestHeaders = {
        "Content-Type": "multipart/form-data"
    };

    if (BASE_URL.includes("ngrok")) {
        requestHeaders["ngrok-skip-browser-warning"] = "true";
    }

    useEffect(() => {
        axios.get(BASE_URL + GET_POST_COMMENTS_ENDPOINT ,{
            headers: requestHeaders,
            params: {
                postId: post.id
            }
        })
            .then((res) =>{
                if(res.data.success){
                    console.log(res.data)
                    setComments(res.data.commentDtoList)
                }
            })
            .catch((err)=>{
                console.error(err)
            })
    }, []);



    return (
        <div className={styles.overlay} onClick={onClose}>

            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                {/* כפתור סגירה */}
                <button
                    className={styles.closeBtn}
                    onClick={onClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className={styles.scrollContent}>

                    <div className={styles.postWrapper}>

                        <div className={styles.header}>
                            <div className={styles.userInfo}>
                                <img src={post.authorProfileImage ? post.authorProfileImage : "https://robohash.org/" + post.authorUsername.charAt(0)} alt="User" className={styles.avatar} />
                                <div>
                                    <h4 className={styles.userName}>{post.authorFirstName + " " + post.authorLastName}</h4>
                                    <span className={styles.timestamp}>@{post.authorUsername} • {relativeTime}</span>
                                </div>
                            </div>
                            <button className={styles.actionBtn}>
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>


                        {hasText && hasImage && (
                            <div className={styles.regularText}>
                                {post.content}
                            </div>
                        )}

                        {hasText && !hasImage && (
                            <div className={styles.fancyTextContainer}>
                                <p className={styles.fancyText}>
                                    {post.content}
                                </p>
                            </div>
                        )}

                        {hasImage && (
                            <div className={styles.mediaContainer}>
                                <img
                                    src={post.pictureUrl}
                                    alt="Post Content"
                                    className={styles.postImage}
                                />
                            </div>
                        )}

                        <div className={styles.postActions}>
                            <div className={styles.actionsGroup}>
                                <button
                                    className={`${styles.actionBtn} ${styles.likeBtn} ${post.liked ? styles.liked : ''}`}
                                    onClick={() => onLike(post.id)}>
                                    <span className="material-symbols-outlined">favorite</span>
                                    <span>{post.likeCount}</span>
                                </button>

                                <button className={`${styles.actionBtn}`} style={{color: 'var(--primary)'}}>
                                    <span className="material-symbols-outlined">chat_bubble</span>
                                    <span>{post.commentCount}</span>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* === אזור התגובות === */}
                    <div className={styles.commentsSection}>
                        <h5 className={styles.commentsTitle}>Comments</h5>

                        <div className={styles.commentsList}>
                            {comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    data={comment} />
                            ))}
                        </div>

                    </div>

                </div>

                {/* === Footer - Input === */}
                <div className={styles.inputSection}>
                    <div className={styles.inputWrapper}>
                        <button className={styles.emojiBtn}>
                            <span className="material-symbols-outlined">mood</span>
                        </button>
                        <input
                            type="text"
                            className={styles.commentInput}
                            placeholder="Add a comment..."
                        />
                        <button className={styles.postCommentBtn}>Post</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PostModal;