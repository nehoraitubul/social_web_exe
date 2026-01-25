import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './Feed.module.css';
import {UserContext} from "../context/UserContext.js";
import {BASE_URL, GET_USER_FEED_ENDPOINT} from "../config/config.js";
import axios from "axios";
import Post from "../components/feed/Post.jsx";
import {likeToggleRequest} from "../services/LikeRequest.js";
import PostModal from "../components/modals/PostModal.jsx";

const Feed = () => {
    const { user } = useContext(UserContext);

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);


    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);



    const requestHeaders = {};
    if (BASE_URL.includes("ngrok")) {
        requestHeaders["ngrok-skip-browser-warning"] = "true";
    }

    useEffect(() => {
        setIsLoading(true);

        axios.get(BASE_URL + GET_USER_FEED_ENDPOINT, {
            headers: requestHeaders,
            params: {
                userId: user.id,
                page: page
            }
        })
            .then(res => {
                if (res.data.success){
                    if (res.data.posts.length === 0) {
                        setHasMore(false);
                    }

                    setPosts(prev => {
                        if (page === 1) return [...res.data.posts];

                        const newPosts = res.data.posts.filter(n => !prev.some(p => p.id === n.id));
                        return [...prev, ...newPosts];
                    });
                }
            })
            .catch((err)=>{
                if (!axios.isCancel(err)) console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
                setInitialLoadComplete(true);
            });
    }, [page]);


    useEffect(() => {
        if (!initialLoadComplete) return;

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
    }, [hasMore, isLoading, posts.length, initialLoadComplete]);


    const handleLikeToggle = async (postId) => {
        const response = await likeToggleRequest(postId, user.id)
        if (response && response.success) {
            const isLikedNow = response.liked;

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
    };


    const handleCommentAdded = (postId) => {

        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    commentCount: post.commentCount + 1
                };
            }
            return post;
        }));

        if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(prev => ({
                ...prev,
                commentCount: prev.commentCount + 1
            }));
        }
    };




    const suggestedUsers = [
        { name: "Mark Davis", username: "markd", img: "https://i.pravatar.cc/150?u=mark" },
        { name: "Elena Rodriguez", username: "elenadev", img: "https://i.pravatar.cc/150?u=elena" },
        { name: "James Wilson", username: "jwilson", img: "https://i.pravatar.cc/150?u=james" },
    ];


    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* === Center Feed === */}
                <main className={styles.mainContent}>

                    {/* Feed Stream */}
                    <div className={styles.feedStream}>
                        {posts.length > 0 &&
                            posts.map((post) => {
                                return(
                                    <Post
                                        key={post.id}
                                        details={post}
                                        onCommentClick={() => setSelectedPost(post)}
                                        onLike={handleLikeToggle}/>
                                )
                            })
                        }
                    </div>


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


                    {!hasMore && posts.length > 0 && (
                        <div className={styles.feedMessage}>
                            <span className="material-symbols-outlined">check_circle</span>
                            <p>You're all caught up!</p>
                        </div>
                    )}

                    {!hasMore && posts.length === 0 && !isLoading && (
                        <div className={styles.feedMessage}>
                            <span className="material-symbols-outlined">post_add</span>
                            <p>No posts yet</p>
                            <p style={{fontSize: '12px', opacity: 0.7}}>
                                Looks like you’re all caught up. Follow more users to discover new posts.
                            </p>
                        </div>
                    )}



                </main>

                {/* === Right Sidebar === */}
                <aside className={styles.rightSidebar}>

                    {/* Who to follow */}
                    <div className={styles.suggestionsCard}>
                        <h3 className={styles.cardTitle}>Who to follow</h3>

                        <div className={styles.suggestionList}>
                            {suggestedUsers.map((u, i) => (
                                <div key={i} className={styles.userRow}>
                                    <div className={styles.userDetails}>
                                        <img src={u.img} alt={u.username} className={styles.smallAvatar} />
                                        <div className={styles.texts}>
                                            <span className={styles.name}>{u.name}</span>
                                            <span className={styles.username}>@{u.username}</span>
                                        </div>
                                    </div>
                                    <button className={styles.followBtnSmall}>Follow</button>
                                </div>
                            ))}
                        </div>

                        <button className={styles.showMore}>Show more suggestions</button>
                    </div>

                    {/* Footer Links */}
                    <div className={styles.footerLinks}>
                        <a href="#" className={styles.footerLink}>About</a>
                        <a href="#" className={styles.footerLink}>Help Center</a>
                        <a href="#" className={styles.footerLink}>Privacy</a>
                        <a href="#" className={styles.footerLink}>Terms</a>
                        <span className={styles.footerLink}>© 2026 DEVSOCIAL</span>
                    </div>

                </aside>
            </div>

            {selectedPost && (

                <PostModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onLike={handleLikeToggle}
                    onCommentAdded={handleCommentAdded}
                />
            )}

        </div>
    );
};

export default Feed;