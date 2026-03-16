// In-memory store for comments
let comments = [];

export function getAllComments() {
    return comments;
}

export function getCommentsByThread(threadId) {
    return comments.filter(comment => comment.threadId === threadId);
}

export function getCommentById(id) {
    return comments.find(comment => comment.id === id) || null;
}

export function addComment(commentData) {
    const { content, username, threadId } = commentData;
    const newComment = {
        id: Date.now(),
        content,
        username,
        threadId,
        time: new Date().toLocaleString(),
    };
    comments.push(newComment);
    return newComment;
}

export function deleteComment(id) {
    const index = comments.findIndex(comment => comment.id === id);
    if (index === -1) return null;
    const [removed] = comments.splice(index, 1);
    return removed;
}
