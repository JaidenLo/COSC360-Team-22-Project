import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import {
    Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, Legend, ResponsiveContainer,
    LineChart
} from "recharts";

function AdminDashboard({ userId, usertype }) {
    const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [threads, setThreads] = useState([]);
    const [search, setSearch] = useState("");

    const [records, setRecords] = useState([]);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;
        if (usertype !== 'admin') {
            alert('Access denied: Admins only');
            navigate('/');
            return;
        }

        fetch(`/api/users/admin-dashboard?adminId=${userId}`)
            .then(res => res.json())
            .then(data => {
                setName(data.name || "");
                console.log('Admin dashboard data:', data);
                setUsers(Array.isArray(data.users) ? data.users : []);
                setBooks(Array.isArray(data.books) ? data.books : []);
                setThreads(Array.isArray(data.threads) ? data.threads : []);
            })
            .catch(err => console.error(err));

    }, [userId]);

    const bookCategoryData = books.reduce((acc, book) => {
        const category = book.category || 'Unknown';
        const existing = acc.find(item => item.category === category);
        if (existing) { existing.count++; }
        else { acc.push({ category, count: 1 }); }
        return acc;
    }, []);

    const COLORS = [
    '#1a1a2e',
    '#16213e',
    '#0f3460',
    '#533483',
    '#2b2d42',
    '#8d99ae',
    '#457b9d',
    '#1d3557',
    '#2d6a4f',
    '#40916c',
    '#52b788',
    '#b7e4c7',
    '#e63946',
    '#f4a261',
    '#e9c46a',
    '#2a9d8f',
    '#264653',
    '#6d6875',
    '#b5838d',
    '#e5989b',
];

function getDaysBetween(start, end) {
    const days = [];
    const current = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    while (current <= endDate) {
        days.push(new Date(current).toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return days;
}

function handleSearch(e) {
    e.preventDefault();
    setSearched(true);

    fetch(`/api/users/admin-dashboard/search?search=${search}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setRecords(data);
            } else {
                setRecords([]);
            }
        })
        .catch(err => console.error(err));

    setSearch("");
}

    return (
        <div className="admin-dashboard">
            <div className="admin-container">

                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {name}!</p>
                </div>

                {/* stat cards — now includes user count */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <p className="stat-number">{users.length}</p>
                        <p className="stat-label">Total Users</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-number">{books.length}</p>
                        <p className="stat-label">Total Books</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-number">{threads.length}</p>
                        <p className="stat-label">Total Threads</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-number">{books.filter(b => b.borrowed).length}</p>
                        <p className="stat-label">Borrowed Books</p>
                    </div>
                </div>

                <div className="charts-grid">

                    <div className="chart-card">
                        <h2>Books per category</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={bookCategoryData} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                                    {bookCategoryData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h2>Books status</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={[
                                { status: 'Available', count: books.filter(b => !b.borrowed).length },
                                { status: 'Borrowed', count: books.filter(b => b.borrowed).length }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="status" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#333333" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-card">
                        <h2>Book borrow history</h2>
                                            
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search book by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">Search</button>
                        </form>
                                            
                        {searched && records.length === 0 && (
                            <p style={{ color: '#6b7280', marginTop: '1rem' }}>No borrow history found.</p>
                        )}
                    
                        {records.length > 0 && (
                            <div style={{ marginTop: '1.5rem' }}>
                                {records.map((record, index) => {
                                    const days = getDaysBetween(record.borrowDate, record.returnDate);
                                    return (
                                        <div key={index} style={{ marginBottom: '1rem' }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#333' }}>
                                                {record.userId?.name || 'Unknown User'}
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                                                {days.map((day, i) => (
                                                    <div
                                                        key={i}
                                                        title={day}
                                                        style={{
                                                            width: '12px',
                                                            height: '12px',
                                                            borderRadius: '2px',
                                                            backgroundColor: record.returnDate ? '#333333' : '#888888',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                ))}
                                                <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem', alignSelf: 'center' }}>
                                                    {new Date(record.borrowDate).toLocaleDateString()} →{' '}
                                                    {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : 'Not returned'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                    
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                                    <span>
                                        <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#333', borderRadius: '2px', marginRight: '4px' }} />
                                        Returned
                                    </span>
                                    <span>
                                        <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#888', borderRadius: '2px', marginRight: '4px' }} />
                                        Still borrowed
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    
                    

                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;