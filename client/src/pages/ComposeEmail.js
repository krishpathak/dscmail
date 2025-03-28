import React, { useState } from 'react';


const SendMail = () => {
    const [emailData, setEmailData] = useState({
        receiver_email: '',
        subject: '',
        body: ''
    });

    const handleChange = (e) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:8000/mail/send`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(emailData)
        });

        const json = await response.json();
        if (json.message) {
            alert(json.message);
        } else {
            alert("Email sent successfully!");
            setEmailData({ receiver_email: '', subject: '', body: '' });
        }
    };

    return (
        <div className="bg-gray-950 p-6 mt-10 rounded-lg text-blue-200">
            <h2 className="text-2xl font-semibold text-center mb-4">Send an Email</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="receiver_email"
                    className="w-full p-2 border-2 border-blue-900 rounded-lg bg-blue-200 text-black"
                    placeholder="Receiver's Email"
                    value={emailData.receiver_email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="subject"
                    className="w-full p-2 border-2 border-blue-900 rounded-lg bg-blue-200 text-black"
                    placeholder="Subject"
                    value={emailData.subject}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="body"
                    className="w-full p-2 border-2 border-blue-900 rounded-lg bg-blue-200 text-black"
                    placeholder="Email Body"
                    rows="4"
                    value={emailData.body}
                    onChange={handleChange}
                    required
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Send Email
                </button>
            </form>
        </div>
    );
};

export default SendMail;
