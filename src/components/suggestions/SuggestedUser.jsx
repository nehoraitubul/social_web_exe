import styles from './SuggestedUser.module.css';
import FollowButton from "../ui/FollowButton.jsx";
import {Link} from "react-router-dom";


const SuggestedUser = ({ name, username, img, user_id }) => {
    return (
        <div className={styles.userRow}>
            <Link to={`/profile/${username}`} className={styles.userDetails}>
                <div className={styles.userDetails}>
                    <img src={img} alt={username} className={styles.smallAvatar} />
                    <div className={styles.texts}>
                        <span className={styles.name}>{name}</span>
                        <span className={styles.username}>@{username}</span>
                    </div>
                </div>
            </Link>

            <FollowButton
                targetUserId={user_id}
                initialIsFollow={false}
                className={styles.followBtnSmall}
            />

        </div>
    );
};

export default SuggestedUser;