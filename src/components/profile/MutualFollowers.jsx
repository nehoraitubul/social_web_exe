import styles from './MutualFollowers.module.css';
import { Link } from 'react-router-dom';
import {useState} from "react";
import MutualFollowersModal from "./MutualFollowersModal.jsx";
const MutualFollowers = ({ users }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!users || users.length === 0) return null;

    return (
        <div className={styles.container}>

            <h4 className={styles.title}>Mutual Followers</h4>

            <div className={styles.row}>

                <div className={styles.avatarGroup}>
                    {users.slice(0, 3).map((user) => (
                        <Link
                            key={user.id}
                            to={`/profile/${user.username}`}
                            className={styles.circle}
                            title={user.firstName + " " + user.lastName}
                        >
                            <img
                                src={user.pictureUrl || "https://robohash.org/" + user.username}
                                alt={user.username}
                                className={styles.innerImage}
                            />
                        </Link>
                    ))}

                    {users.length > 3 && (
                        <div
                            className={`${styles.circle} ${styles.counter}`}
                            onClick={() => setIsModalOpen(true)}
                            style={{ cursor: 'pointer' }}
                        >
                            +{users.length - 3}
                        </div>
                    )}
                </div>


            </div>
            {isModalOpen && (
                <MutualFollowersModal
                    users={users}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default MutualFollowers;