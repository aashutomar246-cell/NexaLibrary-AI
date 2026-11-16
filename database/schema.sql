-- NexaLibrary AI - Neon PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    college_id VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    profile_photo TEXT DEFAULT '',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    isbn VARCHAR(50) UNIQUE NOT NULL,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    description TEXT,
    cover_image TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    issue_token VARCHAR(64) UNIQUE NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issue_date TIMESTAMP,
    due_date TIMESTAMP,
    return_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'issued', 'rejected', 'returned')),
    book_condition VARCHAR(20) DEFAULT 'Good' CHECK (book_condition IN ('Good', 'Damaged', 'Lost')),
    fine_amount DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS key_points (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    chapter_title VARCHAR(150),
    summary_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Admin & Books
INSERT INTO users (full_name, email, mobile, college_id, password_hash, role, is_verified)
VALUES 
('System Administrator', 'admin@nexalibrary.ai', '9876543210', 'ADM-001', '$2b$10$wT8hS...demo_hashed_pwd', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO books (title, author, category, isbn, total_copies, available_copies, description, cover_image, pdf_url)
VALUES 
('Data Structures & Algorithms', 'Narasimha Karumanchi', 'Computer Science', '978-8192107592', 5, 4, 'Master DSA with C/C++ examples and practical solutions.', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
('Artificial Intelligence: A Modern Approach', 'Stuart Russell', 'AI & ML', '978-0134610993', 3, 3, 'Comprehensive guide to AI, neural networks, and modern agents.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
ON CONFLICT (isbn) DO NOTHING;