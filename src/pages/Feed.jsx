import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './Feed.module.css';
import {UserContext} from "../context/UserContext.js";
import {BASE_URL, GET_USER_FEED_ENDPOINT} from "../config/config.js";
import axios from "axios";
import Post from "../components/feed/Post.jsx";
import {likeToggleRequest} from "../services/LikeRequest.js";
import PostModal from "../components/modals/PostModal.jsx";
import SuggestedUser from "../components/suggestions/SuggestedUser.jsx";
import {Link} from "react-router-dom";

const Feed = () => {
    const { user } = useContext(UserContext);

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([])


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
                    if (res.data.suggestions && res.data.suggestions.length > 0) {
                        setSuggestedUsers(res.data.suggestions)
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

    const handleDeletePost = (postId) => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    };


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
                                        onLike={handleLikeToggle}
                                        onDelete={handleDeletePost}/>
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
                        <h3 className={styles.cardTitle}>Suggested follow</h3>

                        <div className={styles.suggestionList}>
                            {suggestedUsers.map((u, i) => (

                                <SuggestedUser
                                    key={i}
                                    name={u.firstName + " " + u.lastName}
                                    username={u.username} // חשוב: מעבירים את ה-username כדי שנוכל לבנות לינק
                                    img={u.pictureUrl ? u.pictureUrl : "https://robohash.org/" + u.username}
                                    user_id={u.id}
                                />


                            ))}
                        </div>

                        <button className={styles.showMore}>Show more suggestions</button>
                    </div>

                    {/* Footer Links */}
                    <div className={styles.footerLinks}>
                        <a href="https://github.com/liorshaya" className={styles.footerLink} >LiorGit</a>
                        <a href="https://github.com/nehoraitubul" className={styles.footerLink}>NehoraiGit</a>
                        <a href="https://vroomspark.com" className={styles.footerLink}>Promote</a>
                    </div>
                    <div className={styles.footerLinks}>
                        <span className={styles.footerLink}>© 2026 LNSTORES</span>
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