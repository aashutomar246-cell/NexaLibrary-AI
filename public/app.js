let loggedInUser = null;
let currentBookId = null;

// Role-based LocalStorage Initializations
let savedNoticesArray = JSON.parse(localStorage.getItem('nexa_notices_data') || JSON.stringify([
    { id: 1, text: "📢 Notice: Library will remain open from 6:00 AM onwards for early study sessions and B.Tech exam preparation.", time: "Today, 06:00 AM" },
    { id: 2, text: "📚 New Arrival: Advanced Generative AI & LLM Systems volume added to AIML section.", time: "Yesterday" }
]));

// Default 40 Books Dataset merged with Admin Uploads from LocalStorage
const defaultBooks = [
    // B.Tech CSE (10 Books)
    { id: 1, title: "Data Structures & Algorithms", author: "Core CSE Dept", category: "CSE", rating: "4.9 ★", format: "Hardcover & PDF", feature: "Includes 30-Page Trace Diagrams & Big-O Proofs", desc: "Covers memory management, stack, queue, trees, graphs and asymptotic runtime bounds." },
    { id: 2, title: "Operating System Principles", author: "Galvin & Silberschatz", category: "CSE", rating: "4.8 ★", format: "PDF Reader Available", feature: "Process Synchronization & Semaphore Codes", desc: "Detailed breakdown of deadlocks, paging, virtual memory, and kernel CPU scheduling." },
    { id: 3, title: "Database Management Systems", author: "Korth & Sudarshan", category: "CSE", rating: "4.7 ★", format: "Hardcover & PDF", feature: "Neon PostgreSQL & SQL Normalization Rules", desc: "Relational algebra, ACID properties, indexing, B-Trees, and transaction logging." },
    { id: 4, title: "Computer Networks & Protocols", author: "Andrew S. Tanenbaum", category: "CSE", rating: "4.9 ★", format: "PDF Reader Available", feature: "TCP/IP Layer State Diagrams & Socket Prog.", desc: "OSI 7 layers, packet switching, routing algorithms, sub-netting, and HTTP/DNS protocols." },
    { id: 5, title: "Compiler Design & Construction", author: "Aho & Ullman", category: "CSE", rating: "4.6 ★", format: "Hardcover & PDF", feature: "Lexical Analyzer & Syntax Tree Blueprints", desc: "Parsing techniques, intermediate code generation, symbol tables, and code optimization." },
    { id: 6, title: "Software Engineering & Agile", author: "Roger S. Pressman", category: "CSE", rating: "4.7 ★", format: "PDF Reader Available", feature: "SDLC Models & UML Software Design", desc: "Agile sprints, requirement engineering, testing strategies, and software maintenance." },
    { id: 7, title: "Theory of Computation (TOC)", author: "Michael Sipser", category: "CSE", rating: "4.8 ★", format: "Hardcover & PDF", feature: "DFA/NFA State Transition Diagrams", desc: "Finite Automata, Turing machines, Context-Free Grammars, and NP-completeness proofs." },
    { id: 8, title: "Design & Analysis of Algorithms", author: "Cormen (CLRS)", category: "CSE", rating: "5.0 ★", format: "Hardcover & PDF", feature: "Dynamic Programming & Greedy Proofs", desc: "Divide and conquer, Bellman-Ford, Dijkstra, Floyd-Warshall, and NP-Hard problems." },
    { id: 9, title: "Computer System Architecture", author: "M. Morris Mano", category: "CSE", rating: "4.6 ★", format: "PDF Reader Available", feature: "ALU Micro-operations & Pipelining Setup", desc: "Register transfer logic, CPU instruction cycles, memory hierarchy, and I/O organization." },
    { id: 10, title: "Object-Oriented Java Programming", author: "Herbert Schildt", category: "CSE", rating: "4.8 ★", format: "Hardcover & PDF", feature: "Multithreading & JVM Architecture", desc: "Inheritance, Polymorphism, Collection Framework, Exception Handling, and I/O Streams." },

    // AI & Machine Learning (10 Books)
    { id: 11, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", category: "AIML", rating: "5.0 ★", format: "Hardcover & PDF", feature: "Heuristic Search & Knowledge Graphs", desc: "A* search, minimax algorithm, constraint satisfaction, logic, and intelligent agents." },
    { id: 12, title: "Pattern Recognition & Machine Learning", author: "Christopher Bishop", category: "AIML", rating: "4.9 ★", format: "PDF Reader Available", feature: "Bayesian Models & Linear Regression Proofs", desc: "Supervised and unsupervised learning, decision trees, SVMs, clustering, and PCA." },
    { id: 13, title: "Deep Learning Fundamentals", author: "Ian Goodfellow", category: "AIML", rating: "4.9 ★", format: "Hardcover & PDF", feature: "PyTorch Neural Net Backpropagation Formulas", desc: "Feedforward networks, CNNs for vision, RNNs, LSTMs, Autoencoders, and GANs." },
    { id: 14, title: "Natural Language Processing (NLP)", author: "Dan Jurafsky", category: "AIML", rating: "4.7 ★", format: "PDF Reader Available", feature: "Transformer & Attention Mechanism Blueprints", desc: "Tokenization, N-grams, Word2Vec, BERT models, LLM architecture, and sentiment analysis." },
    { id: 15, title: "Reinforcement Learning: An Intro", author: "Richard S. Sutton", category: "AIML", rating: "4.8 ★", format: "Hardcover & PDF", feature: "Q-Learning & Markov Decision Processes", desc: "Temporal difference learning, Bellman equations, policy gradients, and Deep Q-Networks." },
    { id: 16, title: "Computer Vision & Processing", author: "Richard Szeliski", category: "AIML", rating: "4.6 ★", format: "PDF Reader Available", feature: "OpenCV Edge Detection & Object Tracking", desc: "Image filtering, feature extraction, convolutional feature maps, and 3D reconstruction." },
    { id: 17, title: "Applied Data Science with Python", author: "Jake VanderPlas", category: "AIML", rating: "4.8 ★", format: "Hardcover & PDF", feature: "Pandas, NumPy & Scikit-Learn Notebooks", desc: "Data wrangling, statistical plotting, feature engineering, and model validation." },
    { id: 18, title: "Neural Networks & Deep Learning", author: "Michael Nielsen", category: "AIML", rating: "4.7 ★", format: "PDF Reader Available", feature: "Loss Gradient Derivations & Activation Maths", desc: "Sigmoid, ReLU, Softmax mathematics, cross-entropy loss, and gradient descent optimization." },
    { id: 19, title: "Big Data Analytics & Spark", author: "Tom White", category: "AIML", rating: "4.6 ★", format: "Hardcover & PDF", feature: "Hadoop Distributed File System Layouts", desc: "MapReduce paradigm, PySpark streaming, NoSQL databases, and scalable ETL pipelines." },
    { id: 20, title: "Generative AI & LLM Systems", author: "Nexa AI Labs", category: "AIML", rating: "5.0 ★", format: "Hardcover & PDF", feature: "Prompt Engineering & RAG Vector Database Setup", desc: "Fine-tuning models, vector embeddings, LangChain integration, and AI safety protocols." },

    // Internet of Things (IoT) (10 Books)
    { id: 21, title: "Internet of Things Architecture", author: "Arshdeep Bahga", category: "IOT", rating: "4.7 ★", format: "Hardcover & PDF", feature: "Raspberry Pi & ESP32 Circuit Wiring Diagram", desc: "IoT reference model, sensor nodes, edge gateways, cloud connectivity, and API endpoints." },
    { id: 22, title: "Wireless Sensor Networks & Protocols", author: "Holger Karl", category: "IOT", rating: "4.6 ★", format: "PDF Reader Available", feature: "MQTT, CoAP & HTTP Packet Inspection", desc: "Zigbee, Bluetooth Low Energy (BLE), LoRaWAN protocols, and low-power mesh networks." },
    { id: 23, title: "Embedded Systems & Microcontrollers", author: "Raj Kamal", category: "IOT", rating: "4.8 ★", format: "Hardcover & PDF", feature: "ARM Cortex Assembly & Timers Integration", desc: "8051, AVR, ARM architectures, interrupt handlers, RTOS concepts, and GPIO interfacing." },
    { id: 24, title: "IoT Security & Cryptography", author: "Brian Russell", category: "IOT", rating: "4.7 ★", format: "PDF Reader Available", feature: "Hardware TLS Key Storage & Firmware Security", desc: "Device authentication, firmware encryption, side-channel attack prevention, and IoT firewalls." },
    { id: 25, title: "Industrial IoT (IIoT) & Smart Grid", author: "Giacomo Veneri", category: "IOT", rating: "4.5 ★", format: "Hardcover & PDF", feature: "SCADA & Modbus Gateway Interfacing", desc: "Smart manufacturing, predictive maintenance, automated sensor monitoring, and telemetry." },
    { id: 26, title: "Edge Computing & Fog Architecture", author: "Buyya & Srirama", category: "IOT", rating: "4.8 ★", format: "PDF Reader Available", feature: "Latency Reduction & Local Edge Analytics", desc: "Distributing workloads between cloud servers and IoT edge devices for real-time response." },
    { id: 27, title: "Arduino & Robotics Sensor Lab", author: "Massimo Banzi", category: "IOT", rating: "4.9 ★", format: "Hardcover & PDF", feature: "Complete C++ Code for Ultrasonic & Gyro Sensors", desc: "Analog-to-digital converters (ADC), PWM motor control, serial communications, and shields." },
    { id: 28, title: "Smart City & Intelligent Systems", author: "Fadi Al-Turjman", category: "IOT", rating: "4.6 ★", format: "PDF Reader Available", feature: "Traffic Control & Environmental Sensor Blueprints", desc: "Intelligent transportation systems, water monitoring networks, and energy-efficient lighting." },
    { id: 29, title: "Cloud Computing for IoT Devices", author: "Thomas Erl", category: "IOT", rating: "4.7 ★", format: "Hardcover & PDF", feature: "AWS IoT Core & Azure Device Hub Protocols", desc: "Cloud telemetry ingestion, serverless lambda functions, device shadows, and webhooks." },
    { id: 30, title: "Wearable & Medical IoT Electronics", author: "Torkbagly & Co.", category: "IOT", rating: "4.8 ★", format: "Hardcover & PDF", feature: "ECG Sensor Signal Processing & Bio-telemetry", desc: "Low-power wearable sensors, health telemetry, signal noise removal, and battery optimization." },

    // Electronics & Communication - ECE (10 Books)
    { id: 31, title: "Digital Signal Processing (DSP)", author: "John G. Proakis", category: "ECE", rating: "4.9 ★", format: "Hardcover & PDF", feature: "FFT, DFT & Butterworth Filter Equations", desc: "Discrete-time signals, Z-Transforms, FIR/IIR filter design, and spectral analysis." },
    { id: 32, title: "VLSI Circuit Design & CMOS", author: "Neil Weste", category: "ECE", rating: "4.8 ★", format: "PDF Reader Available", feature: "Transistor Layout & Verilog HDL Codes", desc: "MOSFET physics, CMOS logic gates, silicon layout rules, delay calculations, and FPGA setup." },
    { id: 33, title: "Analog & Digital Communications", author: "Simon Haykin", category: "ECE", rating: "4.7 ★", format: "Hardcover & PDF", feature: "AM/FM Modulation Waveforms & PCM Diagrams", desc: "Amplitude modulation, frequency modulation, pulse code modulation, and BER analysis." },
    { id: 34, title: "Microprocessor Architecture (8085/8086)", author: "Ramesh Gaonkar", category: "ECE", rating: "4.9 ★", format: "PDF Reader Available", feature: "Complete Assembly Language Code Examples", desc: "Instruction set, timing diagrams, memory interfacing, 8255 PPI, and interrupt controllers." },
    { id: 35, title: "Electromagnetic Field Theory", author: "Sadiku", category: "ECE", rating: "4.6 ★", format: "Hardcover & PDF", feature: "Maxwell Equations & Waveguides Derivation", desc: "Vector calculus, Electrostatics, Magnetostatics, Poynting vector, and plane wave propagation." },
    { id: 36, title: "Control Systems Engineering", author: "I.J. Nagrath & M. Gopal", category: "ECE", rating: "4.8 ★", format: "PDF Reader Available", feature: "Bode Plots, Nyquist & Root Locus Steps", desc: "Transfer functions, block diagram reduction, stability analysis, and PID controller tuning." },
    { id: 37, title: "Microwave Engineering & Antennas", author: "David M. Pozar", category: "ECE", rating: "4.7 ★", format: "Hardcover & PDF", feature: "S-Parameters & Dipole Antenna Radiation", desc: "Transmission lines, Smith Chart matching, microstrip patch antennas, and radar fundamentals." },
    { id: 38, title: "Optical Fiber Communications", author: "Gerd Keiser", category: "ECE", rating: "4.6 ★", format: "PDF Reader Available", feature: "Fiber Attenuation & Laser Diode Physics", desc: "Total internal reflection, single-mode fiber, optical transmitters, photodetectors, and WDM." },
    { id: 39, title: "Electronic Devices & Circuit Theory", author: "Boylestad & Nashelsky", category: "ECE", rating: "4.8 ★", format: "Hardcover & PDF", feature: "BJT, FET Biasing & Op-Amp Schematics", desc: "Diode clippers, BJT amplifiers, operational amplifier circuits, active filters, and oscillators." },
    { id: 40, title: "Wireless 5G/6G Networks", author: "Theodore S. Rappaport", category: "ECE", rating: "5.0 ★", format: "Hardcover & PDF", feature: "MIMO Antenna Array & Beamforming Models", desc: "Cellular concepts, fading channels, OFDM multi-carrier modulation, and 5G NR architecture." }
];

let allBooks = JSON.parse(localStorage.getItem('nexa_custom_books') || JSON.stringify(defaultBooks));

// Load saved theme accent on startup
const savedAccent = localStorage.getItem('nexa_theme_accent') || '#7c3aed';
document.documentElement.style.setProperty('--primary', savedAccent);

function toggleAuthMode(mode) {
    const loginSec = document.getElementById('login-section');
    const regSec = document.getElementById('register-section');
    if (mode === 'register') {
        if (loginSec) loginSec.style.display = 'none';
        if (regSec) regSec.style.display = 'block';
    } else {
        if (regSec) regSec.style.display = 'none';
        if (loginSec) loginSec.style.display = 'block';
    }
}

function getTokenStorageKey() {
    if (!loggedInUser) return 'nexa_student_tokens';
    return loggedInUser.role === 'admin' ? 'nexa_admin_tokens' : 'nexa_student_tokens';
}

function getStoredTokens() {
    return JSON.parse(localStorage.getItem(getTokenStorageKey()) || '[]');
}

async function handleLogin(event) {
    event.preventDefault();
    
    const userSelectElem = document.getElementById('login-user-select');
    const passwordElem = document.getElementById('login-password');

    const roleChoice = userSelectElem ? userSelectElem.value : 'admin';
    const password = passwordElem ? passwordElem.value : '';

    if (!password) {
        alert('Please enter your password.');
        return;
    }

    let uName = (roleChoice === 'admin') ? "Aashu Tomar (Admin)" : "Gaurav Mittal (Student)";
    let uEmail = (roleChoice === 'admin') ? "aashutomar246@gmail.com" : "gauravmittal1198141@gmail.com";

    loggedInUser = {
        name: uName,
        email: uEmail,
        role: roleChoice
    };

    const authWrapper = document.getElementById('auth-wrapper');
    const appWrapper = document.getElementById('app-wrapper');
    const nameDisplay = document.getElementById('logged-user-name');

    if (authWrapper) authWrapper.style.display = 'none';
    if (appWrapper) appWrapper.style.display = 'flex';
    if (nameDisplay) nameDisplay.innerText = `${loggedInUser.name}`;

    const setNameInput = document.getElementById('set-name');
    if (setNameInput) setNameInput.value = loggedInUser.name;

    const defStream = localStorage.getItem('nexa_default_stream') || 'All';
    const streamSelect = document.getElementById('set-default-stream');
    if (streamSelect) streamSelect.value = defStream;

    const accentSelect = document.getElementById('set-theme-accent');
    if (accentSelect) accentSelect.value = localStorage.getItem('nexa_theme_accent') || '#7c3aed';

    const reminderToggle = document.getElementById('set-reminder-toggle');
    if (reminderToggle) reminderToggle.checked = localStorage.getItem('nexa_reminders') === 'true';

    updateTokensCounterUI();
    renderBooks(allBooks);
    renderNotices();
    renderAdminControlPanel();
}

async function handleRegister(event) {
    event.preventDefault();
    alert('✅ Account Created Successfully! Please Sign In.');
    toggleAuthMode('login');
}

function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.style.display = 'block';

    if (element) {
        element.classList.add('active');
        const titleElem = document.getElementById('tab-title');
        if (titleElem) titleElem.innerText = element.innerText;
    }

    if (tabId === 'catalogue-tab') {
        const defStream = localStorage.getItem('nexa_default_stream') || 'All';
        filterBooks(defStream);
    }
    if (tabId === 'tokens-tab') renderSavedTokens();
    if (tabId === 'members-tab') loadMembers();
}

function filterAndOpenCatalogue(streamCategory) {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems[1]) switchTab('catalogue-tab', navItems[1]);
    filterBooks(streamCategory);
}

function filterBooks(category) {
    if (category === 'All') {
        renderBooks(allBooks);
    } else {
        const filtered = allBooks.filter(b => b.category === category);
        renderBooks(filtered);
    }
}

// RENDER BOOKS WITH ADMIN DELETE BUTTON
function renderBooks(books) {
    const list = document.getElementById('books-list');
    if (!list) return;

    const isAdmin = loggedInUser && loggedInUser.role === 'admin';

    list.innerHTML = books.map(b => `
        <div class="book-card">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.7rem; background: rgba(124,58,237,0.25); color: #c4b5fd; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${b.category}</span>
                    <span style="font-size: 0.8rem; color: #f59e0b; font-weight: bold;">${b.rating}</span>
                </div>
                <h4 style="margin: 0 0 0.3rem; color: #f8fafc; font-size: 1rem; line-height: 1.3;">${b.title}</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 0.6rem;">By ${b.author}</p>
                
                <div style="background: #0f172a; border: 1px solid #1e293b; padding: 0.6rem; border-radius: 6px; font-size: 0.75rem; margin-bottom: 0.8rem; color: #cbd5e1;">
                    <strong style="color: #a78bfa;">✨ Key Feature:</strong> ${b.feature}<br>
                    <span style="color: #94a3b8; font-size: 0.7rem;">Formats: ${b.format}</span>
                </div>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-top: auto;">
                <button onclick="readBook(${b.id})" style="flex: 1; background: var(--primary); border: none; color: white; padding: 0.55rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">📖 Read (30 Pgs)</button>
                <button onclick="requestToken(${b.id})" style="background: #1e293b; border: 1px solid var(--border-color); color: #cbd5e1; padding: 0.55rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">Token</button>
                ${isAdmin ? `<button onclick="deleteBook(${b.id})" style="background: #ef4444; border: none; color: white; padding: 0.55rem 0.7rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold;" title="Delete Book">🗑️</button>` : ''}
            </div>
        </div>
    `).join('');
}

// ADMIN FEATURE: DELETE BOOK FROM CATALOGUE
function deleteBook(bookId) {
    if (!loggedInUser || loggedInUser.role !== 'admin') {
        alert('❌ Access Denied: Only Admin can delete books.');
        return;
    }

    const bookToDelete = allBooks.find(b => b.id === bookId);
    if (!bookToDelete) return;

    const confirmDelete = confirm(`Are you sure you want to delete "${bookToDelete.title}" from the catalogue?`);
    if (!confirmDelete) return;

    allBooks = allBooks.filter(b => b.id !== bookId);
    localStorage.setItem('nexa_custom_books', JSON.stringify(allBooks));

    renderBooks(allBooks);
    alert(`🗑️ Book "${bookToDelete.title}" has been removed from the catalogue.`);
}

// ADMIN FEATURE: UPLOAD NEW BOOK / EDITION
function handleAdminBookUpload(event) {
    event.preventDefault();
    if (!loggedInUser || loggedInUser.role !== 'admin') {
        alert('❌ Access Denied: Only Admin can upload books.');
        return;
    }

    const title = document.getElementById('admin-book-title').value.trim();
    const author = document.getElementById('admin-book-author').value.trim();
    const category = document.getElementById('admin-book-category').value;
    const feature = document.getElementById('admin-book-feature').value.trim();
    const desc = document.getElementById('admin-book-desc').value.trim();

    if (!title || !author) {
        alert('Please fill in the required book title and author fields.');
        return;
    }

    const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        category: category,
        rating: "5.0 ★",
        format: "Hardcover & PDF",
        feature: feature || "Newly Uploaded Admin Edition",
        desc: desc || "Newly added physical library volume with full 30-page digital reader support."
    };

    allBooks.unshift(newBook);
    localStorage.setItem('nexa_custom_books', JSON.stringify(allBooks));

    document.getElementById('admin-book-form').reset();
    renderBooks(allBooks);
    alert(`✅ Success! Book "${title}" uploaded successfully to the ${category} stream catalogue.`);
}

// ADMIN FEATURE: POST LIBRARY NOTICE / ANNOUNCEMENT
function handleAdminNoticePost(event) {
    event.preventDefault();
    if (!loggedInUser || loggedInUser.role !== 'admin') {
        alert('❌ Access Denied: Only Admin can post notices.');
        return;
    }

    const noticeInput = document.getElementById('admin-notice-input');
    if (!noticeInput || !noticeInput.value.trim()) return;

    const newNotice = {
        id: Date.now(),
        text: noticeInput.value.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString()
    };

    savedNoticesArray.unshift(newNotice);
    localStorage.setItem('nexa_notices_data', JSON.stringify(savedNoticesArray));

    noticeInput.value = '';
    renderNotices();
    alert('✅ Notice posted successfully and broadcasted to all student dashboards!');
}

function deleteNotice(noticeId) {
    if (!loggedInUser || loggedInUser.role !== 'admin') return;
    savedNoticesArray = savedNoticesArray.filter(n => n.id !== noticeId);
    localStorage.setItem('nexa_notices_data', JSON.stringify(savedNoticesArray));
    renderNotices();
}

// RENDER NOTICE BOARD
function renderNotices() {
    const container = document.getElementById('library-notice-board');
    if (!container) return;

    if (savedNoticesArray.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">No active notices or announcements.</p>`;
        return;
    }

    container.innerHTML = savedNoticesArray.map(n => `
        <div style="background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3); padding: 0.8rem; border-radius: 8px; margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
            <div>
                <p style="margin: 0 0 0.3rem 0; color: #f8fafc; font-size: 0.9rem;">${n.text}</p>
                <span style="font-size: 0.75rem; color: #a78bfa;">Posted at: ${n.time}</span>
            </div>
            ${loggedInUser && loggedInUser.role === 'admin' ? `<button onclick="deleteNotice(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;" title="Delete Notice">✕</button>` : ''}
        </div>
    `).join('');
}

// RENDER ADMIN CONTROL PANEL DYNAMICALLY IF ADMIN
function renderAdminControlPanel() {
    const adminPanelContainer = document.getElementById('admin-control-section');
    if (!adminPanelContainer) return;

    if (loggedInUser && loggedInUser.role === 'admin') {
        adminPanelContainer.style.display = 'block';
        adminPanelContainer.innerHTML = `
            <div style="background: var(--bg-card); border: 1px solid var(--primary); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                <h3 style="color: #a78bfa; margin-top: 0; display: flex; align-items: center; gap: 8px;">🛠️ Admin Control Panel (Librarian Access)</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.2rem;">Upload new physical library editions and broadcast live announcements to students.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
                    <!-- Upload Book Form -->
                    <div style="background: #0f172a; padding: 1.2rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="color: #f8fafc; margin-top: 0;">📖 Upload New Book / Edition</h4>
                        <form id="admin-book-form" onsubmit="handleAdminBookUpload(event)" style="display: flex; flex-direction: column; gap: 0.8rem;">
                            <input type="text" id="admin-book-title" placeholder="Book Title (e.g. Advanced React Architecture)" required style="background: var(--bg-main); border: 1px solid var(--border-color); color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;">
                            <input type="text" id="admin-book-author" placeholder="Author Name" required style="background: var(--bg-main); border: 1px solid var(--border-color); color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;">
                            <select id="admin-book-category" style="background: var(--bg-main); border: 1px solid var(--border-color); color: #cbd5e1; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;">
                                <option value="CSE">CSE Stream</option>
                                <option value="AIML">AIML Stream</option>
                                <option value="IOT">IoT Stream</option>
                                <option value="ECE">ECE Stream</option>
                            </select>
                            <input type="text" id="admin-book-feature" placeholder="Key Feature (e.g. Includes 30-Page Diagrams)" style="background: var(--bg-main); border: 1px solid var(--border-color); color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;">
                            <textarea id="admin-book-desc" placeholder="Brief book description and chapter summary..." style="background: var(--bg-main); border: 1px solid var(--border-color); color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.85rem; height: 60px; resize: none;"></textarea>
                            <button type="submit" style="background: var(--primary); color: white; border: none; padding: 0.55rem; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">Upload to Catalogue</button>
                        </form>
                    </div>

                    <!-- Post Notice Form -->
                    <div style="background: #0f172a; padding: 1.2rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="color: #f8fafc; margin-top: 0;">📢 Broadcast Library Notice</h4>
                        <form onsubmit="handleAdminNoticePost(event)" style="display: flex; flex-direction: column; gap: 0.8rem; height: calc(100% - 30px); justify-content: space-between;">
                            <textarea id="admin-notice-input" placeholder="Type notice here (e.g., Library closed on Sunday for maintenance)..." required style="background: var(--bg-main); border: 1px solid var(--border-color); color: white; padding: 0.6rem; border-radius: 6px; font-size: 0.85rem; height: 110px; resize: none;"></textarea>
                            <button type="submit" style="background: #10b981; color: white; border: none; padding: 0.55rem; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">Post Notice Live</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    } else {
        adminPanelContainer.style.display = 'none';
    }
}

// TOKEN GENERATOR & ROLE-BASED LOCALSTORAGE SAVE
function requestToken(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;

    const tokensArray = getStoredTokens();
    const generatedCode = 'TOKEN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTokenRecord = {
        id: Date.now(),
        bookTitle: book.title,
        tokenCode: generatedCode,
        category: book.category,
        time: timestamp,
        status: 'Active'
    };

    tokensArray.unshift(newTokenRecord);
    localStorage.setItem(getTokenStorageKey(), JSON.stringify(tokensArray));

    updateTokensCounterUI();
    renderSavedTokens();

    const remindersEnabled = localStorage.getItem('nexa_reminders') === 'true';
    const reminderMsg = remindersEnabled ? "\n🔔 Due date reminders are ENABLED (14-day alert)." : "";

    alert(`✅ Book Issue Token Generated & Saved!\n\nBook: ${book.title}\nToken Code: ${generatedCode}\nValidity: 14 Days (Limit: 3 per month)\nStatus: Active${reminderMsg}\n\nYou can view and manage this pass in the 'My Saved Tokens' tab.`);
}

// TOGGLE TOKEN STATUS (Active <-> Dead)
function toggleTokenStatus(tokenId) {
    let tokensArray = getStoredTokens();
    const token = tokensArray.find(t => t.id === tokenId);
    if (token) {
        token.status = token.status === 'Active' ? 'Dead' : 'Active';
        localStorage.setItem(getTokenStorageKey(), JSON.stringify(tokensArray));
        renderSavedTokens();
        updateTokensCounterUI();
    }
}

// RENDER SAVED TOKENS LIST
function renderSavedTokens() {
    const container = document.getElementById('saved-tokens-list');
    if (!container) return;

    const tokensArray = getStoredTokens();

    if (tokensArray.length === 0) {
        container.innerHTML = `
            <div style="background: var(--bg-card); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color); text-align: center; color: var(--text-muted);">
                No saved tokens available yet. Go to the Books Catalogue and click the 'Token' button!
            </div>`;
        return;
    }

    container.innerHTML = tokensArray.map(t => {
        const isActive = t.status === 'Active';
        const badgeColor = isActive ? '#10b981' : '#ef4444';
        const statusText = isActive ? '● Active Pass (14 Days)' : '✕ Dead / Expired';
        const actionBtnText = isActive ? 'Mark as Dead' : 'Make Active';

        return `
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-left: 4px solid ${badgeColor}; padding: 1.2rem; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <span style="font-size: 0.7rem; background: rgba(124,58,237,0.25); color: #c4b5fd; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${t.category}</span>
                    <h4 style="margin: 0.4rem 0 0.2rem; color: #f8fafc; font-size: 1rem;">${t.bookTitle}</h4>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Generated at: ${t.time}</span>
                </div>
                <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                    <span style="color: #f59e0b; font-size: 1.15rem; font-weight: bold; letter-spacing: 1px;">${t.tokenCode}</span>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="color: ${badgeColor}; font-size: 0.75rem; font-weight: bold;">${statusText}</span>
                        <button onclick="toggleTokenStatus(${t.id})" style="background: ${isActive ? 'var(--primary)' : '#334155'}; color: white; border: none; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; font-weight: 600;">${actionBtnText}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// UPDATE ACTIVE TOKENS COUNTER
function updateTokensCounterUI() {
    const tokensArray = getStoredTokens();
    const activeCount = tokensArray.filter(t => t.status === 'Active').length;
    const statElem = document.getElementById('stat-tokens');
    if (statElem) statElem.innerText = activeCount;
}

function readBook(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;

    currentBookId = bookId;
    const rTitle = document.getElementById('reader-book-title');
    if (rTitle) rTitle.innerText = `📖 Digital Reader: ${book.title}`;
    
    let optionsHTML = '';
    for (let i = 1; i <= 30; i++) {
        optionsHTML += `<option value="${i}">Page ${i} of 30</option>`;
    }

    const rBox = document.getElementById('reader-box');
    if (rBox) {
        rBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1f293d; padding-bottom: 0.8rem; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2 style="color: #a78bfa; margin: 0 0 0.3rem 0;">${book.title}</h2>
                    <span style="font-size: 0.85rem; color: #94a3b8;">Author: ${book.author} | Stream: ${book.category} | Rating: ${book.rating}</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="navigatePage(-1)" style="background: #1e293b; color: white; border: 1px solid #334155; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">◀ Prev</button>
                    <select id="page-select" onchange="loadSinglePage(parseInt(this.value))" style="background: #0f172a; color: #a78bfa; border: 1px solid #334155; padding: 0.4rem; border-radius: 6px; font-weight: bold; cursor: pointer;">
                        ${optionsHTML}
                    </select>
                    <button onclick="navigatePage(1)" style="background: var(--primary); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">Next ▶</button>
                </div>
            </div>

            <div id="single-page-container" style="line-height: 1.8; color: #cbd5e1; font-size: 0.95rem; min-height: 320px; background: #0b0f19; padding: 1.5rem; border-radius: 8px; border: 1px solid #1e293b;">
            </div>
        `;
    }

    const navItems = document.querySelectorAll('.nav-item');
    if (navItems[4]) switchTab('reader-tab', navItems[4]);
    loadSinglePage(1);
}

function navigatePage(direction) {
    const selector = document.getElementById('page-select');
    if (!selector) return;

    let currentPg = parseInt(selector.value);
    let newPg = currentPg + direction;

    if (newPg >= 1 && newPg <= 30) {
        selector.value = newPg;
        loadSinglePage(newPg);
    }
}

function loadSinglePage(pageNum) {
    const book = allBooks.find(b => b.id === currentBookId);
    const container = document.getElementById('single-page-container');
    if (!container) return;

    const bTitle = book ? book.title : 'Engineering Volume';
    const stream = book ? book.category : 'CSE';

    let moduleName = "Module 1: Fundamental Concepts & Architecture (Pgs 1-10)";
    if (pageNum > 10 && pageNum <= 20) moduleName = "Module 2: Analytical Equations & Code Specs (Pgs 11-20)";
    if (pageNum > 20) moduleName = "Module 3: University Exam Numerical Review (Pgs 21-30)";

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #334155; padding-bottom: 0.5rem; margin-bottom: 1rem;">
            <span style="color: var(--primary); font-weight: bold;">${moduleName}</span>
            <span style="color: #94a3b8; font-size: 0.85rem;">Page ${pageNum} / 30</span>
        </div>

        <h3 style="color: #f8fafc; margin-top: 0;">Chapter ${Math.ceil(pageNum / 3)}: Section ${pageNum} - ${bTitle} (${stream})</h3>
        
        <p><strong>Detailed Notes (Page ${pageNum}):</strong> ${book ? book.desc : 'University course outline.'}</p>
        <p>In this section, we analyze the architectural bounds and theoretical derivations. Topic section ${pageNum} covers practical execution steps, memory bounds, and algorithm optimization.</p>
        
        <p><strong>Key Exam Takeaways on Page ${pageNum}:</strong></p>
        <ul style="line-height: 1.7;">
            <li>Mathematical proof for formula section ${pageNum}.1</li>
            <li>Memory pointer address allocation & heap utilization</li>
            <li>Asymptotic runtime analysis for semester exams</li>
            <li>Key Highlight: ${book ? book.feature : 'Standard textbook section'}</li>
        </ul>

        <blockquote style="border-left: 4px solid var(--primary); padding-left: 1rem; color: #94a3b8; margin: 1.5rem 0; font-style: italic; background: rgba(124,58,237,0.05); padding: 0.8rem;">
            "Exam Tip for Page ${pageNum}: Draw state transition block diagrams for 5-mark short answer checks."
        </blockquote>
    `;
}

function loadMembers() {
    const container = document.getElementById('members-list');
    if (!container || !loggedInUser) return;

    if (loggedInUser.role === 'admin') {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.9rem;">
                <div style="padding: 1rem; background: var(--bg-card); border-radius: 8px; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #a78bfa; font-size: 1rem;">${loggedInUser.name} (You)</strong><br>
                        <span style="font-size: 0.85rem; color: var(--text-muted);">${loggedInUser.email}</span>
                    </div>
                    <span style="background: rgba(124,58,237,0.3); color: #c4b5fd; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">ADMIN (LIBRARIAN)</span>
                </div>

                <div style="padding: 1rem; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #f8fafc; font-size: 1rem;">Gaurav Mittal</strong><br>
                        <span style="font-size: 0.85rem; color: var(--text-muted);">gauravmittal1198141@gmail.com | Student ID: CSE-2026-08</span>
                    </div>
                    <span style="background: #1e293b; color: #94a3b8; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">STUDENT</span>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="padding: 1.5rem; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color);">
                <h4 style="margin: 0 0 0.5rem 0; color: #a78bfa;">👤 My Student Profile</h4>
                <p style="margin: 0.4rem 0; color: #cbd5e1; font-size: 0.9rem;"><strong>Name:</strong> ${loggedInUser.name}</p>
                <p style="margin: 0.4rem 0; color: #cbd5e1; font-size: 0.9rem;"><strong>Email:</strong> ${loggedInUser.email}</p>
                <p style="margin: 0.4rem 0; color: #cbd5e1; font-size: 0.9rem;"><strong>Access Mode:</strong> Student Read-Only (Private Dashboard Access)</p>
            </div>
        `;
    }
}

// SAVE ALL SETTINGS
function saveAllSettings() {
    const nameElem = document.getElementById('set-name');
    const streamElem = document.getElementById('set-default-stream');
    const accentElem = document.getElementById('set-theme-accent');
    const reminderElem = document.getElementById('set-reminder-toggle');

    if (nameElem && loggedInUser) {
        loggedInUser.name = nameElem.value;
        const disp = document.getElementById('logged-user-name');
        if (disp) disp.innerText = `${loggedInUser.name}`;
    }

    if (streamElem) {
        localStorage.setItem('nexa_default_stream', streamElem.value);
    }

    if (accentElem) {
        const chosenColor = accentElem.value;
        localStorage.setItem('nexa_theme_accent', chosenColor);
        document.documentElement.style.setProperty('--primary', chosenColor);
    }

    if (reminderElem) {
        localStorage.setItem('nexa_reminders', reminderElem.checked);
    }

    alert(`✅ Preferences & System Settings Saved Successfully!`);
}

// CLEAR SYSTEM CACHE & RESET
function clearSystemCache() {
    const confirmReset = confirm("⚠️ Warning: This will clear all custom books, saved tokens, notices, and reset your preferences to default. Do you want to proceed?");
    if (!confirmReset) return;

    localStorage.removeItem('nexa_custom_books');
    localStorage.removeItem('nexa_admin_tokens');
    localStorage.removeItem('nexa_student_tokens');
    localStorage.removeItem('nexa_notices_data');
    localStorage.removeItem('nexa_default_stream');
    localStorage.removeItem('nexa_theme_accent');
    localStorage.removeItem('nexa_reminders');

    alert("🔄 System cache cleared successfully! Reloading application...");
    location.reload();
}

function toggleLumiChat() {
    const drawer = document.getElementById('lumi-chat-drawer');
    if (drawer) drawer.style.display = (drawer.style.display === 'flex') ? 'none' : 'flex';
}

// ========================================================
// LUMI AI INTERACTIVE Q&A SUGGESTION PATTERN
// ========================================================

function sendQuickPrompt(promptText) {
    const input = document.getElementById('user-msg-input');
    if (input) {
        input.value = promptText;
        sendLumiMessage();
    }
}

function sendLumiMessage(customText) {
    const input = document.getElementById('user-msg-input');
    const msg = customText || (input ? input.value.trim() : '');
    if (!msg) return;

    const container = document.getElementById('chat-messages');

    if (container) {
        // 1. User Message
        container.innerHTML += `<div style="background: var(--primary); padding: 0.8rem; border-radius: 10px; color: white; align-self: flex-end; max-width: 85%;">${msg}</div>`;
        if (input) input.value = '';
        container.scrollTop = container.scrollHeight;

        // 2. Typing Indicator
        const typingId = 'typing-' + Date.now();
        container.innerHTML += `<div id="${typingId}" style="background: #1e293b; padding: 0.8rem; border-radius: 10px; color: var(--text-muted); max-width: 60%; font-style: italic; font-size: 0.85rem;">🤖 Lumi AI is thinking...</div>`;
        container.scrollTop = container.scrollHeight;

        setTimeout(() => {
            const typingElem = document.getElementById(typingId);
            if (typingElem) typingElem.remove();

            let reply = "";
            let nextSuggestions = [];
            const lowerMsg = msg.toLowerCase();

            // RULE & TOKEN QUESTIONS (Short & Crisp Answers)
            if (lowerMsg.includes('14-day') || lowerMsg.includes('duration') || lowerMsg.includes('kitne din')) {
                reply = "📅 **Issue Duration**: Standard book tokens are valid for **14 days** from the date of generation.";
                nextSuggestions = [
                    "Monthly 3 token limit kaise kaam karti hai?",
                    "Late fee fine (₹10/day) ka kya rule hai?",
                    "Explain Big-O Asymptotic Notation & Cormen Algorithms"
                ];
            }
            else if (lowerMsg.includes('3 token') || lowerMsg.includes('limit') || lowerMsg.includes('per month')) {
                reply = "📚 **Issue Limit**: Each student can hold up to **3 active tokens per month**.";
                nextSuggestions = [
                    "14-day book issue duration kya hai?",
                    "Late fee fine (₹10/day) ka kya rule hai?",
                    "Explain Operating System Deadlocks & Process Synchronization"
                ];
            }
            else if (lowerMsg.includes('₹10') || lowerMsg.includes('fine') || lowerMsg.includes('late fee')) {
                reply = "⚠️ **Late Fee Policy**: A fine of **₹10 per day** is charged if books are returned after the 14-day due date.";
                nextSuggestions = [
                    "14-day book issue duration kya hai?",
                    "Monthly 3 token limit kaise kaam karti hai?",
                    "Explain DBMS Normalization & ACID Properties"
                ];
            }

            // ACADEMIC & BOOK QUESTIONS (Detailed, Broad & Structured Answers)
            else if (lowerMsg.includes('big-o') || lowerMsg.includes('algorithm') || lowerMsg.includes('cormen')) {
                reply = `📖 **Detailed Academic Insight (Design & Analysis of Algorithms - Cormen)**:\n\n` +
                    `* **Core Concept**: Asymptotic notations (Big-O $O$, Omega $\\Omega$, Theta $\\Theta$) formally define the upper, lower, and tight bounds of algorithm runtime efficiency.\n` +
                    `* **Dynamic Programming**: Solves optimization problems by breaking them into overlapping subproblems with optimal substructure (e.g., Dijkstra, Bellman-Ford).\n` +
                    `* **Exam Note**: Always write recurrence relations and solve them using Master's Theorem for 10-mark questions.`;
                nextSuggestions = [
                    "Explain Operating System Deadlocks & Process Synchronization",
                    "Explain DBMS Normalization & ACID Properties",
                    "Explain Generative AI & RAG Architecture"
                ];
            }
            else if (lowerMsg.includes('deadlock') || lowerMsg.includes('operating system') || lowerMsg.includes('galvin')) {
                reply = `📖 **Detailed Academic Insight (Operating System Principles - Galvin)**:\n\n` +
                    `* **Process Synchronization**: Utilizes semaphores, mutex locks, and critical section protocols to prevent race conditions.\n` +
                    `* **Deadlocks**: Occur under 4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Avoided using Banker's Algorithm.\n` +
                    `* **Memory Management**: Virtual memory maps logical addresses to physical RAM frames through paging and page tables.`;
                nextSuggestions = [
                    "Explain Big-O Asymptotic Notation & Cormen Algorithms",
                    "Explain DBMS Normalization & ACID Properties",
                    "Explain IoT MQTT Protocol & Sensor Architecture"
                ];
            }
            else if (lowerMsg.includes('dbms') || lowerMsg.includes('normalization') || lowerMsg.includes('acid')) {
                reply = `📖 **Detailed Academic Insight (Database Management Systems - Korth)**:\n\n` +
                    `* **ACID Properties**: Atomicity, Consistency, Isolation, and Durability guarantee reliable transaction processing in Neon PostgreSQL.\n` +
                    `* **Normalization**: 1NF removes atomic violations, 2NF removes partial functional dependencies, and 3NF removes transitive dependencies to eliminate data redundancy.\n` +
                    `* **Indexing**: B-Trees and B+ Trees optimize data retrieval time from $O(N)$ to $O(\\log N)$.`;
                nextSuggestions = [
                    "Explain Generative AI & RAG Architecture",
                    "Explain IoT MQTT Protocol & Sensor Architecture",
                    "14-day book issue duration kya hai?"
                ];
            }
            else if (lowerMsg.includes('generative ai') || lowerMsg.includes('rag') || lowerMsg.includes('llm')) {
                reply = `🤖 **Detailed Academic Insight (Generative AI & LLM Systems)**:\n\n` +
                    `* **RAG Architecture**: Retrieval-Augmented Generation connects external vector databases with transformer models to fetch accurate contextual data before text generation.\n` +
                    `* **Attention Mechanisms**: Self-attention computes contextual dependencies across token sequences efficiently.\n` +
                    `* **Fine-Tuning**: Customizes pre-trained model weights for specialized domain engineering tasks.`;
                nextSuggestions = [
                    "Explain Big-O Asymptotic Notation & Cormen Algorithms",
                    "Explain DBMS Normalization & ACID Properties",
                    "Late fee fine (₹10/day) ka kya rule hai?"
                ];
            }
            else if (lowerMsg.includes('mqtt') || lowerMsg.includes('iot')) {
                reply = `🌐 **Detailed Academic Insight (Internet of Things)**:\n\n` +
                    `* **MQTT Protocol**: Lightweight publish-subscribe messaging transport protocol designed for low-power IoT sensor nodes.\n` +
                    `* **Architecture**: Operates with a central broker, publishers (ESP32/sensors), and subscribers (Cloud dashboards) with minimal packet overhead.`;
                nextSuggestions = [
                    "Explain Operating System Deadlocks & Process Synchronization",
                    "Monthly 3 token limit kaise kaam karti hai?",
                    "Explain Generative AI & RAG Architecture"
                ];
            }

            // DEFAULT FALLBACK WITH SUGGESTIONS
            else {
                reply = `🤖 **Lumi AI Assistant**: Main aapki library rules aur B.Tech (CSE, AIML, IoT, ECE) academic subjects par detailed guidance de sakta hoon. Niche diye gaye topics me se koi select karein:`;
                nextSuggestions = [
                    "14-day book issue duration kya hai?",
                    "Explain Big-O Asymptotic Notation & Cormen Algorithms",
                    "Explain Operating System Deadlocks & Process Synchronization"
                ];
            }

            // Build interactive chips HTML for next suggestions
            let chipsHTML = '';
            if (nextSuggestions && nextSuggestions.length > 0) {
                chipsHTML = `<div style="margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.4rem;">
                    <span style="font-size: 0.75rem; color: #a78bfa; font-weight: bold;">Suggested Follow-up Questions:</span>
                    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                        ${nextSuggestions.map(s => `<button onclick="sendQuickPrompt('${s}')" style="background: rgba(124,58,237,0.2); border: 1px solid var(--primary); color: #c4b5fd; padding: 5px 10px; border-radius: 12px; font-size: 0.75rem; cursor: pointer; text-align: left;">👉 ${s}</button>`).join('')}
                    </div>
                </div>`;
            }

            container.innerHTML += `<div style="background: #1e293b; padding: 0.9rem; border-radius: 10px; color: #cbd5e1; max-width: 90%; line-height: 1.7; white-space: pre-line;">${reply}${chipsHTML}</div>`;
            container.scrollTop = container.scrollHeight;
        }, 600);
    }
}

function logout() {
    const appWrapper = document.getElementById('app-wrapper');
    const authWrapper = document.getElementById('auth-wrapper');
    if (appWrapper) appWrapper.style.display = 'none';
    if (authWrapper) authWrapper.style.display = 'flex';
}