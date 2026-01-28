import styles from './MutualFollowersModal.module.css';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom'; // 1. ייבוא הפורטל

const MutualFollowersModal = ({ users, onClose }) => {
    if (!users) return null;

    // 2. השימוש בפורטל
    // הפרמטר הראשון: ה-JSX שלנו (המודל)
    // הפרמטר השני: המיקום שאליו "משגרים" אותו (document.body)
    return createPortal(
        <div className={styles.overlay} onClick={onClose}>

            <div className={styles.content} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <h3 className={styles.title}>Mutual Followers</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className={styles.list}>
                    {users.map((user) => (
                        <Link
                            key={user.id}
                            to={`/profile/${user.username}`}
                            className={styles.userItem}
                            onClick={onClose}
                        >
                            <img
                                src={user.pictureUrl || "https://robohash.org/" + user.username}
                                alt={user.username}
                                className={styles.avatar}
                            />
                            <div className={styles.userInfo}>
                                <span className={styles.name}>{user.firstName} {user.lastName}</span>
                                <span className={styles.username}>@{user.username}</span>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>,
        document.body // כאן אנחנו אומרים לו: "תצייר את זה ישירות על הגוף של האתר"
    );
};

export default MutualFollowersModal;