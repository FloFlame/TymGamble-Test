import React, { useState } from 'react';

function AdminPanel() {
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState('');

  const createCode = () => {
    const codes = JSON.parse(localStorage.getItem('codes') || '{}');
    codes[code] = parseInt(amount);
    localStorage.setItem('codes', JSON.stringify(codes));
    setMessage(`Created code ${code} worth ${amount}`);
    setCode('');
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Admin Panel</h2>
      <div className="mb-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="New code"
          className="p-2 rounded bg-gray-700 mr-2"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 rounded bg-gray-700 mr-2 w-24"
        />
        <button onClick={createCode} className="bg-blue-500 px-4 py-2 rounded">Create</button>
      </div>
      {message && <div className="text-yellow-400">{message}</div>}
    </div>
  );
}

export default AdminPanel;
