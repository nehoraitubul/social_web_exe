import {BASE_URL, TOGGLE_LIKE} from "../config/config.js";
import axios from "axios";

export const likeToggleRequest = async (postId, userId) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("postId", postId);

    const postHeaders = { "Content-Type": "multipart/form-data" };
    if (BASE_URL.includes("ngrok")) postHeaders["ngrok-skip-browser-warning"] = "true";

    try {
        const res = await axios.post(BASE_URL + TOGGLE_LIKE,
            formData,
            { headers: postHeaders });

        return res.data;
    } catch (err) {
        console.error(err);
        return { success: false };
    }
};