'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    telegramLink: '',
    instagramLink: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          telegramLink: data.telegramLink || '',
          instagramLink: data.instagramLink || '',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div>Loading settings...</div>;

  return (
    <div className="glass" style={{ maxWidth: '600px', padding: '32px', borderRadius: '16px' }}>
      <h2 style={{ marginBottom: '24px' }}>Global Link Settings</h2>
      
      {message && (
        <div style={{ padding: '12px', marginBottom: '24px', borderRadius: '8px', background: message.includes('success') ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 69, 58, 0.2)', color: message.includes('success') ? '#34C759' : '#FF453A' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Telegram Profile/Contact Link</label>
          <input 
            type="url" 
            className="input" 
            value={formData.telegramLink} 
            onChange={e => setFormData({ ...formData, telegramLink: e.target.value })} 
            placeholder="https://t.me/yourusername" 
            required 
          />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Instagram Profile Link</label>
           <input 
             type="url" 
             className="input" 
             value={formData.instagramLink} 
             onChange={e => setFormData({ ...formData, instagramLink: e.target.value })} 
             placeholder="https://instagram.com/yourusername" 
             required 
           />
        </div>

        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', marginTop: '12px' }} disabled={loading}>
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
