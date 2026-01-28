import {useContext, useEffect, useState} from "react";
import {BASE_URL, FOLLOW_USER_ENDPOINT, UNFOLLOW_USER_ENDPOINT} from "../../config/config.js";
import axios from "axios";
import {UserContext} from "../../context/UserContext.js";


const FollowButton = ({ targetUserId, initialIsFollow, onSuccess, className, followContent = "Follow", unfollowContent = "Unfollow"}) => {
    const { user, setUser } = useContext(UserContext)

    const [isFollow, setIsFollow] = useState(initialIsFollow);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsFollow(initialIsFollow);
    }, [initialIsFollow]);

    const handleClick = () => {
        if (isLoading) return;
        setIsLoading(true);

        const requestHeaders = {};
        if (BASE_URL.includes("ngrok")) {
            requestHeaders["ngrok-skip-browser-warning"] = "true";
        }
        const endpoint = isFollow ? UNFOLLOW_USER_ENDPOINT : FOLLOW_USER_ENDPOINT;

        axios.post(BASE_URL + endpoint,
            {
                followerUserId: user.id,
                targetUserId: targetUserId,
            },
            {
                headers: requestHeaders,
            })
            .then((res)=>{
                if(res.data.success) {
                    const newStatus = !isFollow;
                    setIsFollow(newStatus);
                    if (onSuccess) {
                        onSuccess(newStatus);
                        setIsLoading(false);
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            }).finally(() => {
            setIsLoading(false);
        })

        }

    return (

        <button
            className={className}
            onClick={handleClick}
            disabled={isLoading}
            data-following={isFollow}
        >
            {isLoading ? "..." : (isFollow ? unfollowContent : followContent)}
        </button>

    )

}

export default FollowButton