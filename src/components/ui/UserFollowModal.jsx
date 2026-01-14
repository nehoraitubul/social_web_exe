import styles from "./UserFollowModal.module.css"
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import FollowButton from "./FollowButton.jsx";
import {UserContext} from "../../context/UserContext.js";
import {BASE_URL, REMOVE_FOLLOWER_ENDPOINT} from "../../config/config.js";
import axios from "axios";

const UserFollowModal = (props) => {
    const { user, setUser } = useContext(UserContext);
    const [isFollow, setIsFollow] = useState(props.isFollow);
    const [isVisible, setIsVisible] = useState(true)

    // סטייט חדש לשליטה על הפופ-אפ של ההסרה
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    const navigate = useNavigate();

    const handleUserClick = () => {
        if (props.onClose) {
            props.onClose();
        }
        navigate(`/profile/${props.username}`);
    }

    const handleSuccess = (isNowFollow, removeFollower) => {
        setIsFollow(isNowFollow)
        props.onSuccess(isNowFollow, removeFollower)
    }

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        setShowRemoveConfirm(true);
    }

    const handleConfirmRemove = () => {
        const requestHeaders = {};
        if (BASE_URL.includes("ngrok")) {
            requestHeaders["ngrok-skip-browser-warning"] = "true";
        }
        console.log(user.id + "--" + props.id)

        axios.post(BASE_URL + REMOVE_FOLLOWER_ENDPOINT,
            {
                followerUserId: user.id,
                targetUserId: props.id,
            },
            {
                headers: requestHeaders,
            })
            .then((res)=>{
                if(res.data.success) {
                    setIsVisible(false)
                    handleSuccess(false, true)
                }
            })
            .catch((err) => {
                console.error(err);
            }).finally(() => {

        })


        setShowRemoveConfirm(false);
    }

    if (!isVisible) return null

    return(
        <>
            <div className={styles.userRow}>
                <div
                    onClick={handleUserClick}
                    className={styles.userInfo}>
                    <img src={props.image} className={styles.avatar} alt="User" />
                    <div className={styles.userDetails}>
                        <p className={styles.username}>{props.username}</p>
                        <p className={styles.fullname}>{props.firstName + " " + props.lastName}</p>
                    </div>
                </div>

                <div className={styles.actionsWrapper}>

                    {user.id !== props.id &&
                        <>
                            {isFollow ?
                                <FollowButton
                                    targetUserId={props.id}
                                    initialIsFollow={props.isFollow}
                                    className={styles.btnFollowing}
                                    onSuccess={handleSuccess}
                                    unfollowContent = {props.isFollowingModal && props.isLoggedUserProfile ? "Unfollow" : "Following"}
                                />
                                :
                                <FollowButton
                                    targetUserId={props.id}
                                    initialIsFollow={props.isFollow}
                                    className={styles.btnFollow}
                                    onSuccess={handleSuccess}
                                    followContent = {props.isLoggedUserProfile && !props.isFollowingModal? "Follow Back" : "Follow"}
                                />
                            }
                        </>
                    }

                    {!props.isFollowingModal && props.isLoggedUserProfile && (
                        <button
                            className={styles.removeBtn}
                            onClick={handleRemoveClick}
                            title="Remove Follower"
                        >
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>close</span>
                        </button>
                    )}
                </div>
            </div>

            {showRemoveConfirm && (
                <div className={styles.confirmOverlay} onClick={() => setShowRemoveConfirm(false)}>
                    <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>

                        <img src={props.image} className={styles.confirmAvatar} alt="User" />

                        <h3 className={styles.confirmTitle}>Remove follower?</h3>
                        <p className={styles.confirmText}>
                            SocialApp won't tell <strong>{props.username}</strong> they were removed from your followers.
                        </p>

                        <div className={styles.confirmActions}>
                            <button className={styles.btnConfirmRemove} onClick={handleConfirmRemove}>
                                Remove
                            </button>
                            <button className={styles.btnCancel} onClick={() => setShowRemoveConfirm(false)}>
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default UserFollowModal;