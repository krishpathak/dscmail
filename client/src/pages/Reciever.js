import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReceivedMails = () => {
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get('http://localhost:8000/mail/received');
                setEmails(response.data);
            } catch (err) {
                setError('Failed to fetch emails');
            }
        };
        fetchEmails();
    }, []);

    return (
        <div className="p-8 bg-gray-950 text-blue-200 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">Received Emails</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-6">
                {emails.length > 0 ? (
                    emails.map((email, index) => (
                        <div key={index} className="p-4 border border-blue-900 bg-blue-200 text-black rounded-lg">
                            <h2 className="text-2xl font-bold text-blue-900">{email.subject}</h2>
                            <p className="text-gray-700">From: {email.receiver}</p>
                            <p className="mt-2">{email.body}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-lg">No emails received.</p>
                )}
            </div>
        </div>
    );
};

export default ReceivedMails;
