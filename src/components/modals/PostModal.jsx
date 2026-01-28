import styles from './PostModal.module.css';
import {formatTimeAgo} from "../../utils/timeUtils.js";
import {useContext, useEffect, useRef, useState,} from "react";
import {ADD_COMMENT_ENDPOINT, BASE_URL, GET_POST_COMMENTS_ENDPOINT} from "../../config/config.js";
import {UserContext} from "../../context/UserContext.js";
import axios from "axios";
import Comment from "../comments/Comment.jsx";
import EmojiPicker from "emoji-picker-react";

const PostModal = ({ onClose, post , onLike, onCommentAdded}) => {
    const { user } = useContext(UserContext);

    const commentsEndRef = useRef(null);
    const shouldScrollRef = useRef(false);


    const hasImage = post.pictureUrl && post.pictureUrl !== "";
    const hasText = post.content && post.content !== "";

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const relativeTime = formatTimeAgo(post.createdAt);
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [length, setLength] = useState(500 - (newComment || "").length);
    const [isLoading, setIsLoading] = useState(true);


    const requestHeaders = {};

    if (BASE_URL.includes("ngrok")) {
        requestHeaders["ngrok-skip-browser-warning"] = "true";
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        axios.get(BASE_URL + GET_POST_COMMENTS_ENDPOINT ,{
            headers: requestHeaders,
            params: {
                postId: post.id
            }
        })
            .then((res) =>{
                if(res.data.success){
                    setComments(res.data.commentDtoList)
                }
            })
            .catch((err)=>{
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);


    const addComment = () =>{
        axios.post(BASE_URL + ADD_COMMENT_ENDPOINT,{
            userId: user.id,
            postId: post.id,
            content: newComment
        },{
            headers: requestHeaders,
        })
            .then((res) =>{
                if(res.data.success){
                    setNewComment("")
                    setComments((perv) => {
                        return[...perv, res.data.comment]
                    })
                    shouldScrollRef.current = true;
                    onCommentAdded(post.id);
                }
            })
            .catch((err) =>{
                console.error(err)
            })
    }


    const handleInputResize = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    const onEmojiClick = (emojiObject) => {
        if (newComment.length + emojiObject.emoji.length <= 500) {
            const updatedComment = newComment + emojiObject.emoji;
            setNewComment(updatedComment);
            setLength(500 - updatedComment.length);
        }
    };

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (shouldScrollRef.current) {
            scrollToBottom();
            shouldScrollRef.current = false;
        }
    }, [comments]);



    return (
        <div className={styles.overlay} onClick={onClose}>

            <div
                className={styles.modal}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker(false);
                }}>

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
                                <img src={post.authorProfileImage ? post.authorProfileImage : "https://robohash.org/" + post.authorUsername} alt="User" className={styles.avatar} />
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

                            {/* מצב 1: טעינה */}
                            {isLoading && (
                                <div className={styles.loaderContainer}>
                                    <span className={`material-symbols-outlined ${styles.spinner}`}>
                                        refresh
                                    </span>
                                </div>
                            )}

                            {/* מצב 2: סיימנו לטעון ויש תגובות (הרגיל) */}
                            {!isLoading && comments.length > 0 && (
                                <>
                                    {comments.map((comment) => (
                                        <Comment
                                            key={comment.id}
                                            data={comment}
                                            onClose = {onClose}/>
                                    ))}
                                    {/* העוגן לגלילה נמצא רק כשיש תגובות */}
                                    <div ref={commentsEndRef} />
                                </>
                            )}

                            {/* מצב 3: סיימנו לטעון ואין תגובות (ריק) */}
                            {!isLoading && comments.length === 0 && (
                                <div className={styles.emptyState}>
                                    <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
                                        chat_bubble_outline
                                    </span>
                                    <p className={styles.emptyTitle}>No comments yet</p>
                                    <p className={styles.emptySubtitle}>
                                        Start the conversation.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* === Footer - Input === */}
                <div className={styles.inputSection}>
                    <div className={styles.inputWrapper}>
                        <div className={styles.emojiWrapper}>
                            <button
                                className={styles.emojiBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEmojiPicker(!showEmojiPicker);
                                }}
                            >
                        <span
                            className="material-symbols-outlined"
                            style={{color: showEmojiPicker ? '#fbbf24' : ''}}
                        >
                            mood
                        </span>
                            </button>

                            {showEmojiPicker && (
                                <div
                                    className={styles.emojiPopover}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        theme="dark"
                                        width={300}
                                        height={350}
                                        searchDisabled={false}
                                        skinTonesDisabled={true}
                                        previewConfig={{ showPreview: false }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* השינוי ל-textarea */}
                        <textarea
                            onClick={() => setShowEmojiPicker(false)}
                            value={newComment}
                            className={styles.commentInput}
                            placeholder="Add a comment..."
                            rows={1}
                            onChange={(e) => {
                                if (e.target.value.length <= 500) {
                                    setNewComment(e.target.value);
                                    setLength((500 - e.target.value.length));
                                    handleInputResize(e);
                                }
                            }}
                        />

                        {/* מונה תווים */}
                        <span className={`${styles.charCount} ${newComment.length >= 500 ? styles.limitReached : ''}`}>
                            {newComment.length}/500
                        </span>

                        <button className={styles.postCommentBtn}
                        onClick={addComment}>
                            Post
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PostModal;