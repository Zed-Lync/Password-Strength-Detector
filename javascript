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
        return { score: 0, suggestions: ['Enter a password to get started'], label: 'Very Weak', time: '—' };
    }
    
    if (password.length >= 8) score += 20;
    else suggestions.push('Use at least 8 characters');
    
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    if (/[a-z]/.test(password)) score += 15;
    else suggestions.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 15;
    else suggestions.push('Add uppercase letters');
    
    if (/[0-9]/.test(password)) score += 15;
    else suggestions.push('Add numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    else suggestions.push('Add special characters (!@#$% etc.)');
    
    const common = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
    if (common.some(p => password.toLowerCase().includes(p))) {
        score -= 20;
        suggestions.push('Avoid common passwords');
    }
    
    score = Math.min(100, Math.max(0, score));
    
    let label, time;
    if (score < 30) { label = 'Very Weak'; time = 'Instantly'; }
    else if (score < 50) { label = 'Weak'; time = 'Minutes to hours'; }
    else if (score < 70) { label = 'Moderate'; time = 'Days to weeks'; }
    else if (score < 90) { label = 'Strong'; time = 'Years'; }
    else { label = 'Very Strong'; time = 'Centuries'; }
    
    if (suggestions.length === 0) {
        suggestions = ['Great password! Keep it safe and unique.'];
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
    
    if (score < 30) strengthBar.style.background = '#dc3545';
    else if (score < 50) strengthBar.style.background = '#fd7e14';
    else if (score < 70) strengthBar.style.background = '#ffc107';
    else if (score < 90) strengthBar.style.background = '#20c997';
    else strengthBar.style.background = '#28a745';
    
    suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
}

toggleBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
});

function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';
    let password = '';
    for (let i = 0; i < 16; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    passwordInput.value = password;
    updateStrength();
}

function checkBreach() {
    const password = passwordInput.value;
    if (!password) {
        breachResult.innerHTML = '⚠️ Enter a password first';
        breachResult.className = 'breach-result breached';
        return;
    }
    
    const breached = ['password', '123456', '12345678', 'qwerty', 'abc123', 'admin', 'letmein', 'welcome'];
    
    if (breached.includes(password.toLowerCase())) {
        breachResult.innerHTML = '⚠️ This password appears in known data breaches! DO NOT use it.';
        breachResult.className = 'breach-result breached';
    } else {
        breachResult.innerHTML = '✅ This password was not found in common breach databases. Still, use unique passwords for each site.';
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

updateStrength();
