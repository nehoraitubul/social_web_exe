import styles from './CreatePostModal.module.css';
import {useContext, useRef, useState} from 'react';
import { UserContext } from '../../context/UserContext.js';
import EmojiPicker from "emoji-picker-react";
import {BASE_URL, CREATE_POST_ENDPOINT} from "../../config/config.js";
import axios from "axios"; // ודא שהנתיב נכון

const CreatePostModal = ({ onClose }) => {
    const { user } = useContext(UserContext);
    const [postContent, setPostContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [postImage, setPostImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const [id, setId] = useState(user.id)




    const addPost = () =>{
        if (isLoading) return;

        const requestHeaders = {
            "Content-Type": "multipart/form-data"
        };

        if (BASE_URL.includes("ngrok")) {
            requestHeaders["ngrok-skip-browser-warning"] = "true";
        }
        const formData = new FormData();
        formData.append("userId" , id )
        if (postContent.trim().length > 0 || postImage){
            setIsLoading(true);
            if (postContent.trim().length > 0){
                formData.append("content" , postContent)
            }
            if(postImage){
                formData.append("file" , postImage)
            }
            axios.post(BASE_URL + CREATE_POST_ENDPOINT , formData,{
                headers: requestHeaders,
            })
                .then((res) =>{
                    if(res.data.success){
                        onClose();
                        const event = new CustomEvent('new-post-created', {
                            detail: res.data.post
                        });
                        window.dispatchEvent(event);
                    }
                })
                .catch((err)=>{
                    console.error(err)
                })
                .finally(() => {
                    setIsLoading(false);
                })
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPostImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    }

    const removeImage = () => {
        setPostImage(null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const onEmojiClick = (emojiObject) => {
        setPostContent(prev => prev + emojiObject.emoji);
    };


    return (
        <div className={styles.overlay} onClick={onClose}>

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Create Post</h2>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* User Info */}
                <div className={styles.userInfo}>
                    <img
                        src={user.pictureUrl}
                        alt={user.username}
                        className={styles.avatar}
                    />
                    <p className={styles.userName}>
                        {user.firstName} {user.lastName}
                    </p>
                </div>

                {/* Input Area */}
                <div className={styles.inputSection}>
          <textarea
              className={styles.textarea}
              placeholder={`What's on your mind, ${user.firstName}?`}
              value={postContent}
              onChange={e => {
                  if (e.target.textLength <= 500){
                      setPostContent(e.target.value)
                  }
              }}

          ></textarea>

                    <div className={styles.toolbar}>
                        <button
                            className={styles.iconBtn}
                            title="Add Emoji"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEmojiPicker(!showEmojiPicker);
                            }}
                        >
                            <span className="material-symbols-outlined"
                                  style={{color: showEmojiPicker ? '#fbbf24' : ''}}>
                                sentiment_satisfied
                            </span>
                        </button>

                        {showEmojiPicker && (
                            <div className={styles.emojiPopover} onClick={(e) => e.stopPropagation()}>
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
                </div>

                {previewUrl ? (
                    <div className={styles.previewContainer}>
                        <img
                            src={previewUrl}
                            className={styles.previewImage}
                            alt="Preview" />
                        <button
                            className={styles.removeImageBtn}
                            onClick={removeImage}>
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>close</span>
                        </button>
                    </div>
                ) : (
                    <div className={styles.addToPost}>
                        <div
                            className={styles.imageUploadBtn}
                            onClick={triggerFileInput}>
                            <span className={`material-symbols-outlined ${styles.imageIcon}`}>image</span>
                            <span className={styles.uploadText}>Add Photo</span>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                />

                <div className={styles.footer}>
                    <span className={styles.charCount}>{postContent.length}/500</span>
                    <button
                        className={styles.postBtn}
                        disabled={!postImage && postContent.trim().length === 0 || isLoading}
                        onClick={addPost}>
                        {isLoading ? "Posting..." : "Post"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreatePostModal;