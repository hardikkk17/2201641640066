import React, { useState } from 'react';

export default function ShortenerForm() {
  const [url, setUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [validity, setValidity] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a valid URL.');
      return;
    }
    if (shortcode && !/^[a-zA-Z0-9]{1,12}$/.test(shortcode)) {
      setError('Custom shortcode must be alphanumeric and max 12 chars.');
      return;
    }
    if (validity && (isNaN(validity) || validity <= 0)) {
      setError('Validity must be a positive number.');
      return;
    }

    const payload = { url: url.trim() };
    if (shortcode.trim()) payload.shortcode = shortcode.trim();
    if (validity) payload.validity = Number(validity);

    setLoading(true);
    try {
      const response = await fetch('/shorturls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Error shortening URL.');
      } else {
        setResult(data);
        setUrl('');
        setShortcode('');
        setValidity('');
      }
    } catch {
      setError('Network error, please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Original URL
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter URL to shorten" required />
        </label>
        <label>
          Custom Shortcode (optional)
          <input type="text" value={shortcode} onChange={e => setShortcode(e.target.value)} placeholder="a-z, 0-9, max 12 chars" maxLength={12} />
        </label>
        <label>
          Validity (minutes, default 30)
          <input type="number" value={validity} onChange={e => setValidity(e.target.value)} placeholder="Example: 60" min="1" />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <p>
            Shortened URL:{' '}
            <a href={result.shortLink} target="_blank" rel="noreferrer">
              {result.shortLink}
            </a>
          </p>
          <p>
            Expires at: {new Date(result.expiry).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
