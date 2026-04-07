function validateRegister(req, res, next) { // server side validation middleware for registering, book creation, and thread posting. It runs before the controller so bad data is rejected before db hit. 
    const { username, email, password, city } = req.body;

    if (!username || !username.trim()) {
        return res.status(400).json({ message: 'Username is required' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Valid email is required' });
    }
    if (!password || password.length < 5 || !/\d/.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 5 characters and contain a number' });
    }
    if (!city || !city.trim() || !/^[a-zA-Z\s]+$/.test(city.trim())) {
        return res.status(400).json({ message: 'City must contain only letters and spaces' });
    }

    next();
}

function validateBook(req, res, next) {
    const { title, category, description } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
    }
    if (!category || !category.trim()) {
        return res.status(400).json({ message: 'Category is required' });
    }
    if (!description || !description.trim()) {
        return res.status(400).json({ message: 'Description is required' });
    }

    next();
}

function validateThread(req, res, next) {
    const { bookId, username, content } = req.body;

    if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required' });
    }
    if (!username || !username.trim()) {
        return res.status(400).json({ message: 'Username is required' });
    }
    if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Thread content cannot be empty' });
    }
    if (content.length > 2000) {
        return res.status(400).json({ message: 'Thread content cannot exceed 2000 characters' });
    }

    next();
}

module.exports = { validateRegister, validateBook, validateThread };