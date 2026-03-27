const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const scoreValue = document.getElementById('scoreValue');
const crackTime = document.getElementById('crackTime');
const strengthLabel = document.getElementById('strengthLabel');
const suggestionsList = document.getElementById('suggestionsList');
const toggleBtn = document.getElementById('togglePassword');
const generateBtn = document.getElementById('generateBtn');
const breachCheckBtn = document.getElementById('breachCheckBtn');
const breachResult = document.getElementById('breachResult');

function calculateStrength(password) {
    let score = 0;
    let suggestions = [];
    
    if (!password) {
        return { score: 0, suggestions: ['>_ ENTER PASSWORD TO INITIATE SCAN'], label: 'NO DATA', time: '—' };
    }
    
    // Length checks
    if (password.length >= 8) score += 20;
    else suggestions.push('>_ INSUFFICIENT LENGTH — USE AT LEAST 8 CHARACTERS');
    
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 15;
    else suggestions.push('>_ NO LOWERCASE DETECTED — ADD LOWERCASE LETTERS');
    
    if (/[A-Z]/.test(password)) score += 15;
    else suggestions.push('>_ NO UPPERCASE DETECTED — ADD UPPERCASE LETTERS');
    
    if (/[0-9]/.test(password)) score += 15;
    else suggestions.push('>_ NO NUMERIC DETECTED — INCLUDE NUMBERS');
    
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    else suggestions.push('>_ NO SPECIAL CHARACTERS — USE !@#$%&* TO ENHANCE');
    
    // Common password penalty
    const common = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 'abc123'];
    if (common.some(p => password.toLowerCase().includes(p))) {
        score -= 20;
        suggestions.push('>_ VULNERABILITY DETECTED — AVOID COMMON PASSWORD PATTERNS');
    }
    
    score = Math.min(100, Math.max(0, score));
    
    // Determine label and crack time
    let label, time;
    if (score < 30) {
        label = 'CRITICAL';
        time = 'INSTANTANEOUS (< 1 SECOND)';
    } else if (score < 50) {
        label = 'WEAK';
        time = 'MINUTES TO HOURS';
    } else if (score < 70) {
        label = 'MODERATE';
        time = 'DAYS TO WEEKS';
    } else if (score < 90) {
        label = 'STRONG';
        time = 'YEARS (2-50 YEARS)';
    } else {
        label = 'QUANTUM GRADE';
        time = 'CENTURIES (> 100 YEARS)';
    }
    
    if (suggestions.length === 0) {
        suggestions = ['>_ PASSWORD STRENGTH: OPTIMAL — SYSTEM FORTIFIED', '>_ RECOMMENDATION: USE UNIQUE PASSWORDS PER SERVICE'];
    }
    
    return { score, suggestions, label, time };
}

function updateStrength() {
    const password = passwordInput.value;
    const { score, suggestions, label, time } = calculateStrength(password);
    
    scoreValue.textContent = score;
    strengthLabel.textContent = label;
    crackTime.textContent = time;
    strengthBar.style.width = score + '%';
    
    // Green gradient based on score
    if (score < 30) strengthBar.style.background = '#33aa33';
    else if (score < 50) strengthBar.style.background = '#55cc55';
    else if (score < 70) strengthBar.style.background = '#77ee77';
    else if (score < 90) strengthBar.style.background = '#aaffaa';
    else strengthBar.style.background = '#00ff66';
    
    suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
}

// Toggle password visibility
toggleBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
});

// Generate strong password
function generatePassword() {
    const length = 16;
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*?';
    
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    const all = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    passwordInput.value = password;
    updateStrength();
}

// Breach check simulation
function checkBreach() {
    const password = passwordInput.value;
    if (!password) {
        breachResult.innerHTML = '⚠️ NO INPUT DETECTED — ENTER PASSWORD TO SCAN BREACH DATABASE';
        breachResult.className = 'breach-result breached';
        return;
    }
    
    const breached = ['password', '123456', '12345678', 'qwerty', 'abc123', 'admin', 'letmein', 'welcome', 'passw0rd'];
    
    if (breached.includes(password.toLowerCase())) {
        breachResult.innerHTML = '⚠️ ALERT — PASSWORD FOUND IN DATA BREACH DATABASE. DO NOT USE. GENERATE A NEW PASSWORD.';
        breachResult.className = 'breach-result breached';
    } else {
        breachResult.innerHTML = '✓ PASSWORD NOT FOUND IN KNOWN BREACHES. STATUS: CLEAN. REMAIN VIGILANT.';
        breachResult.className = 'breach-result safe';
    }
    
    setTimeout(() => {
        breachResult.innerHTML = '';
        breachResult.className = 'breach-result';
    }, 5000);
}

generateBtn.addEventListener('click', generatePassword);
breachCheckBtn.addEventListener('click', checkBreach);
passwordInput.addEventListener('input', updateStrength);

// Initial update
updateStrength();
