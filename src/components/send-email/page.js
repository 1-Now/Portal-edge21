import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SendEmail = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [cc, setCc] = useState('');
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api.edge21.co/api/auth/users');
        setUsers(response.data.users || []);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  // Handle the typing in the emails input field
  const handleEmailChange = (e) => {
    const input = e.target.value;
    setEmails(input);

    // Clear previous debounce timeout
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // Set a new debounce timeout to filter users after typing is done
    const newTimeout = setTimeout(() => {
      const emailArray = input.split(',').map(email => email.trim());
      const filtered = users.filter(user =>
        emailArray.some(email => user.email.toLowerCase().includes(email.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }, 500);

    setDebounceTimeout(newTimeout);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setFilteredUsers([]);
    }, 200);
  };

  // Handle sending email to all users
  const handleSendEmailToAll = async () => {
    if (!subject || !body) {
      setMessage('Please provide both subject and body.');
      return;
    }

    setLoadingAll(true);

    try {
      const response = await fetch('https://api.edge21.co/api/auth/send-email-to-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body,
          cc,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Emails sent to all users!');
        resetForm();
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (error) {
      setMessage('Error sending emails: ' + error.message);
    } finally {
      setLoadingAll(false); // Stop loading
    }
  };

  // Handle sending email to specific users
  const handleSendEmailToSpecific = async () => {
    if (!subject || !body || !emails) {
      setMessage('Please provide subject, body, and at least one email address.');
      return;
    }

    setLoading(true);
    const emailArray = emails.split(',').map(email => email.trim());

    try {
      const response = await fetch('https://api.edge21.co/api/auth/send-email-certain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body,
          cc,
          emails: emailArray,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Emails sent to specified users!');
        resetForm();
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (error) {
      setMessage('Error sending emails: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the form fields
  const resetForm = () => {
    setSubject('');
    setBody('');
    setCc('');
    setEmails('');
    setMessage('');
    setFilteredUsers([]); // Clear filtered users
  };

  return (
    <div className="min-h-screen bg-gray-900 p-5">
      <h1 className="text-white text-2xl font-bold mb-6">Send Email</h1>
      <form className="space-y-4">
        <div>
          <label className="text-white">Emails (comma separated for specific users):</label>
          <input
            type="text"
            value={emails}
            onChange={handleEmailChange}
            onBlur={handleBlur}
            className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
          />
          {filteredUsers.length > 0 && (
            <ul className="mt-2 bg-gray-800 rounded-md p-2 h-auto max-h-[100px] overflow-y-auto">
              {filteredUsers.map((user) => (
                <li key={user._id} className="text-white">{user.email}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="text-white">CC (Optional):</label>
          <input
            type="text"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-white">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-white">Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
            rows={4}
            required
          />
        </div>

        <div className="space-x-4">
          <button
            type="button"
            onClick={handleSendEmailToAll}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg"
            disabled={loadingAll}
          >
            {loadingAll ? 'Sending...' : 'Send Email to All Users'}
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={handleSendEmailToSpecific}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Email to Specific Users'}
          </button>
        </div>

        {message && <p className="mt-4 text-white">{message}</p>}
      </form>
    </div>
  );
};

export default SendEmail;