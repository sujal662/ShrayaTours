function ContactsList() {
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://shrayatours.onrender.com/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      const response = await fetch(`https://shrayatours.onrender.com/api/contacts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  React.useEffect(() => {
    loadContacts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6" >
      <h2 className="text-2xl font-bold mb-6">Contact Inquiries ({contacts.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th><th>Phone</th><th>Email</th><th>Message</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="border-b">
                <td>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                <td className="max-w-xs truncate">{contact.reason}</td>
                <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteContact(contact._id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
