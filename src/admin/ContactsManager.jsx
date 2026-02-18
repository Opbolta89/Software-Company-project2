import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/contacts`);
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Message</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{contact.name || 'N/A'}</td>
                <td className="px-6 py-4">{contact.email || 'N/A'}</td>
                <td className="px-6 py-4">{contact.phone || 'N/A'}</td>
                <td className="px-6 py-4 max-w-xs truncate">{contact.message || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <p className="text-center py-8 text-gray-500">No messages found</p>
        )}
      </div>
    </div>
  );
}
