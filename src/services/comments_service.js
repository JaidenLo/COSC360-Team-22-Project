
async function postComment(comment) {
    if (!comment || !comment.content || !comment.content.trim()) {
        throw new Error('Comment cannot be empty');
    }

    const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    });

    if (!response.ok) {
        throw new Error('Failed to send comment');
    }

    return await response.json();
}

async function getComment(commentId) {
    const response = await fetch(`/api/comments/${commentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get comment');
    }

    return await response.json();
}
async function getCommentsByThread(threadId) {
    const response = await fetch(`/api/threads/${threadId}/comments`);

    if (!response.ok) {
        throw new Error('Failed to get comments for thread');
    }

    return await response.json();
}

export { postComment, getComment, getCommentsByThread };
