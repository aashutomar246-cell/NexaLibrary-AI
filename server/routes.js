const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');

// 1. Student Registration Route
router.post('/auth/register', async (req, res) => {
    try {
        const { full_name, email, mobile, college_id, password, role } = req.body;
        
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO users (full_name, email, mobile, college_id, password_hash, role, is_verified)
            VALUES ($1, $2, $3, $4, $5, $6, TRUE)
            RETURNING id, full_name, email, role;
        `;
        const values = [full_name, email, mobile, college_id, password_hash, role || 'student'];
        
        const result = await db.query(query, values);
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('Registration error:', err);
        res.json({ success: false, message: err.message });
    }
});

// 2. Student / Admin Login Route
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const query = `SELECT * FROM users WHERE email = $1;`;
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            return res.json({ success: false, message: 'User not found!' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.json({ success: false, message: 'Invalid credentials!' });
        }

        res.json({ 
            success: true, 
            user: { id: user.id, name: user.full_name, email: user.email, role: user.role } 
        });
    } catch (err) {
        console.error('Login error:', err);
        res.json({ success: false, message: err.message });
    }
});

// 3. Get All Books Route (Catalogue)
router.get('/books', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books ORDER BY id ASC;');
        res.json({ success: true, books: result.rows });
    } catch (err) {
        console.error('Error fetching books:', err);
        res.json({ success: false, message: err.message });
    }
});

// 4. Request Book Loan Route
router.post('/loans/request', async (req, res) => {
    try {
        const { user_id, book_id } = req.body;
        const issueToken = 'TOKEN-' + Math.random().toString(36).substring(2, 9).toUpperCase();

        const query = `
            INSERT INTO loans (user_id, book_id, issue_token, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING *;
        `;
        const result = await db.query(query, [user_id, book_id, issueToken]);

        res.json({ success: true, token: issueToken, loan: result.rows[0] });
    } catch (err) {
        console.error('Loan request error:', err);
        res.json({ success: false, message: err.message });
    }
});

// 5. ChatGPT-Style Lumi AI Chat Assistant Endpoint
router.post('/lumi/chat', async (req, res) => {
    try {
        const { prompt, book_title } = req.body;
        const query = prompt ? prompt.toLowerCase() : '';

        let reply = `Lumi: Main aapki ${book_title || 'engineering book'} se jude har sawal me madad karne ke liye taiyar hu. Aap mujhse kisi bhi concept ke baare me pooch sakte hain!`;

        if (query.includes('array') || query.includes('memory')) {
            reply = "Lumi: Arrays store elements in contiguous memory locations, allowing O(1) random access time. Unlike linked lists, they have a fixed static size allocated during initialization.";
        } else if (query.includes('math') || query.includes('equation') || query.includes('calculus')) {
            reply = "Lumi: Higher engineering mathematics involves solving higher-order differential equations using auxiliary equations, matrix analysis, and Laplace transforms.";
        } else if (query.includes('algorithm') || query.includes('complexity')) {
            reply = "Lumi: Algorithm efficiency is evaluated using Big-O notation, analyzing both Time Complexity (execution speed) and Space Complexity (memory footprint).";
        } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
            reply = "Lumi: Hello Aashu! Main aapka AI study assistant hu. Aaj aap kaunsa chapter ya book padh rahe hain?";
        }

        res.json({ success: true, reply });
    } catch (err) {
        console.error('Lumi AI Error:', err);
        res.json({ success: false, reply: "Lumi: Server connection error. Please try again." });
    }
});

module.exports = router;