

export const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) {
        return (minutes === 1) ? "1 minute ago" : `${minutes} minutes ago`;
    }

    if (hours < 24) {
        return (hours === 1) ? "1 hour ago" : `${hours} hours ago`;
    }

    if (days < 7) {
        return (days === 1) ? "1 day ago" : `${days} days ago`;
    }


    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();

    return `${d}/${m}/${y}`;
};