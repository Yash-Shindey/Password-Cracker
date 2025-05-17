import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';
import './App.css';

// Type definitions (JSDoc for TypeScript-like hints)
/**
 * @typedef {Object} PasswordResult
 * @property {string} hash - MD5 hash of the password
 * @property {boolean} isCommon - Whether the password is commonly used
 * @property {string} strength - Password strength (weak, medium, strong)
 * @property {number} score - Numeric score of password strength (0-6)
 */

/**
 * @typedef {Object} PasswordAttempt
 * @property {string} id - Unique identifier
 * @property {string} password - The password that was checked
 * @property {string} hash - MD5 hash of the password
 * @property {string} timestamp - When the password was checked
 */

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(/** @type {PasswordResult|null} */ (null));
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recentAttempts, setRecentAttempts] = useState(/** @type {PasswordAttempt[]} */ ([]));
  const [pattern, setPattern] = useState('aA0#');
  const [passwordLength, setPasswordLength] = useState(12);
  const [exportLoading, setExportLoading] = useState(false);

  // API URL - updated to use port 5001
  const API_URL = 'http://localhost:5001';

  useEffect(() => {
    fetchRecentAttempts();
  }, []);

  /**
   * Fetch recent password check attempts from Supabase
   */
  const fetchRecentAttempts = async () => {
    try {
      const { data, error } = await supabase
        .from('password_attempts')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setRecentAttempts(data || []);
    } catch (error) {
      console.error('Error fetching recent attempts:', error);
    }
  };

  /**
   * Check password strength and commonality
   */
  const checkPassword = async () => {
    if (!password) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/check-password`, { password });
      setResult(response.data);
      
      // Fetch recent attempts after submitting
      fetchRecentAttempts();
    } catch (error) {
      console.error('Error checking password:', error);
      setResult({ error: 'Failed to check password' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate a password based on pattern
   */
  const generatePassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/generate-password`, { 
        pattern, 
        length: passwordLength 
      });
      
      setPassword(response.data.password);
      setResult(response.data);
    } catch (error) {
      console.error('Error generating password:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export password data as CSV
   */
  const exportPasswords = async () => {
    setExportLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/export-passwords`);
      const data = response.data;
      
      if (data && data.length > 0) {
        // Convert to CSV
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item => Object.values(item).join(','));
        const csv = [headers, ...rows].join('\n');
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'password_data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting passwords:', error);
    } finally {
      setExportLoading(false);
    }
  };

  /**
   * Get color for strength indicator
   * @param {string} strength - Password strength
   * @returns {string} CSS color
   */
  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return 'green';
      case 'medium': return 'orange';
      case 'weak': return 'red';
      default: return 'gray';
    }
  };

  /**
   * Calculate progress percentage based on score
   * @param {number} score - Password score
   * @returns {number} Percentage (0-100)
   */
  const calculateProgress = (score) => {
    return score ? (score / 6) * 100 : 0;
  };

  return (
    <div className="app-container">
      <header>
        <h1>Password Security Analyzer</h1>
        <p>Check your password strength and security</p>
      </header>

      <main>
        <div className="password-checker">
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to analyze"
              className="password-input"
            />
            <button 
              className="toggle-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          
          <button 
            className="check-button"
            onClick={checkPassword}
            disabled={loading || !password}
          >
            {loading ? "Analyzing..." : "Analyze Password"}
          </button>

          <div className="generator-section">
            <h3>Password Generator</h3>
            <div className="generator-controls">
              <div className="pattern-input">
                <label>Pattern:</label>
                <input 
                  type="text" 
                  value={pattern} 
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="a=lowercase, A=uppercase, 0=numbers, #=symbols"
                  title="a=lowercase, A=uppercase, 0=numbers, #=symbols"
                />
              </div>
              
              <div className="length-input">
                <label>Length:</label>
                <input 
                  type="number" 
                  value={passwordLength} 
                  onChange={(e) => setPasswordLength(parseInt(e.target.value) || 12)}
                  min="8"
                  max="32"
                />
              </div>
              
              <button 
                className="generate-button"
                onClick={generatePassword}
                disabled={loading}
              >
                Generate Password
              </button>
            </div>
          </div>

          {result && (
            <div className="result-container">
              <h2>Analysis Results</h2>
              
              <div className="result-item">
                <span>MD5 Hash:</span>
                <code>{result.hash}</code>
              </div>
              
              <div className="result-item">
                <span>Common Password:</span>
                <span className={result.isCommon ? "status-bad" : "status-good"}>
                  {result.isCommon ? "Yes - Vulnerable!" : "No - Good!"}
                </span>
              </div>
              
              <div className="result-item">
                <span>Password Strength:</span>
                <span className={`status-${result.strength}`}>
                  {result.strength ? result.strength.charAt(0).toUpperCase() + result.strength.slice(1) : 'Unknown'}
                </span>
              </div>
              
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${calculateProgress(result.score)}%`,
                    backgroundColor: getStrengthColor(result.strength)
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="history-section">
          <div className="section-header">
            <h2>Recent Password Checks</h2>
            <button 
              className="export-button"
              onClick={exportPasswords}
              disabled={exportLoading}
            >
              {exportLoading ? "Exporting..." : "Export Data"}
            </button>
          </div>
          
          <div className="attempts-list">
            {recentAttempts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Password</th>
                    <th>Hash</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt.id}>
                      <td>{attempt.password}</td>
                      <td><code>{attempt.hash}</code></td>
                      <td>{new Date(attempt.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recent password checks</p>
            )}
          </div>
        </div>
      </main>

      <footer>
        <p>Password Security Analyzer &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;
