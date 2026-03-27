// Password strength calculation
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
        return { score: 0, suggestions: ['Enter a password to begin'] };
    }
    
    // Length check
    if (password.length >= 8) score += 20;
    else if (password.length > 0) suggestions.push('Use at least 8 characters');
    
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    // Lowercase
    if (/[a-z]/.test(password)) score += 15;
    else suggestions.push('Add lowercase letters');
    
    // Uppercase
    if (/[A-Z]/.test(password)) score += 15;
    else suggestions.push('Add uppercase letters');
    
    // Numbers
    if (/[0-9]/.test(password)) score += 15;
    else suggestions.push('Add numbers');
    
    // Special characters
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    else suggestions.push('Add special characters (!@#$% etc.)');
    
    // No common patterns
    const common = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (common.some(p => password.toLowerCase().includes(p))) {
        score -= 20;
        suggestions.push('Avoid common passwords like "password" or "123456"');
    }
    
    // No repeated characters
    if (/(.)\1{2,}/.test(password)) {
        score -= 10;
        suggestions.push('Avoid repeating characters (aaa, 111)');
    }
    
    // Cap at 100
    score = Math.min(100, Math.max(0, score));
    
    // Determine strength label and crack time
    let label, time;
    if (score < 30) {
        label = 'Very Weak';
        time = 'Instantly';
    } else if (score < 50) {
        label = 'Weak';
        time = 'Minutes to hours';
    } else if (score < 70) {
        label = 'Moderate';
        time = 'Days to weeks';
    } else if (score < 90) {
        label = 'Strong';
        time = 'Years';
    } else {
        label = 'Very Strong';
        time = 'Centuries';
    }
    
    if (!suggestions.length) {
        suggestions = ['Great password! Keep it safe and unique.'];
    }
    
    return { score, suggestions, label, time };
}

function updateStrength() {
    const password = passwordInput.value;
    const { score, suggestions, label, time } = calculateStrength(password);
    
    // Update UI
    scoreValue.textContent = score;
    strengthLabel.textContent = label;
    crackTime.textContent = time;
    strengthBar.style.width = score + '%';
    
    // Color based on score
    if (score < 30) strengthBar.style.background = '#dc3545';
    else if (score < 50) strengthBar.style.background = '#fd7e14';
    else if (score < 70) strengthBar.style.background = '#ffc107';
    else if (score < 90) strengthBar.style.background = '#20c997';
    else strengthBar.style.background = '#28a745';
    
    // Update suggestions
    suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
}

// Toggle password visibility
toggleBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
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

generateBtn.addEventListener('click', generatePassword);

// Simulated breach check (using local logic to keep it client-side)
function checkBreach() {
    const password = passwordInput.value;
    if (!password) {
        breachResult.innerHTML = 'Enter a password first';
        breachResult.className = 'breach-result';
        return;
    }
    
    // Common breached passwords (simulated for demo)
    const breachedPasswords = [
        'password', '123456', '12345678', 'qwerty', 'abc123',
        'admin', 'letmein', 'welcome', 'monkey', 'dragon'
    ];
    
    if (breachedPasswords.includes(password.toLowerCase())) {
        breachResult.innerHTML = '⚠️ This password appears in known data breaches. DO NOT use it!';
        breachResult.className = 'breach-result breached';
    } else {
        breachResult.innerHTML = '✅ This password was not found in common breach databases. Still, use unique passwords for each site.';
        breachResult.className = 'breach-result safe';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (breachResult.innerHTML) {
            breachResult.innerHTML = '';
            breachResult.className = 'breach-result';
        }
    }, 5000);
}

breachCheckBtn.addEventListener('click', checkBreach);

// Real-time updates
passwordInput.addEventListener('input', updateStrength);

// Initial state
updateStrength();
