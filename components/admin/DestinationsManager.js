function DestinationsManager() {
  const [destinations, setDestinations] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', image: '' });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://shrayatours.onrender.com/api/destinations');
      if (!res.ok) throw new Error('Failed to load destinations');
      const data = await res.json();
      setDestinations(data);
    } catch (error) {
      console.error('Error loading destinations:', error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await fetch(`https://shrayatours.onrender.com/api/destinations/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('https://shrayatours.onrender.com/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      if (!res.ok) throw new Error('Failed to save destination');
      await loadDestinations();
      setFormData({ name: '', description: '', image: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving destination:', error);
      alert('Error saving destination');
    }
  };

  const editDestination = (dest) => {
    setFormData({ name: dest.name, description: dest.description, image: dest.image });
    setEditingId(dest._id);
    setShowForm(true);
  };

  const deleteDestination = async (id) => {
    if (!confirm('Delete this destination?')) return;
    try {
      const res = await fetch(`https://shrayatours.onrender.com/api/destinations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete destination');
      await loadDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Error deleting destination');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Destinations ({destinations.length})</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', description: '', image: '' }); }}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Name"
              className="form-input"
            />
            <input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="Image URL"
              className="form-input"
            />
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            placeholder="Description"
            className="form-input w-full mb-4"
            rows="3"
          />
          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Add'} Destination
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((dest) => (
              <tr key={dest._id} className="border-b">
                <td className="px-4 py-2 font-medium">{dest.name}</td>
                <td className="px-4 py-2 max-w-xs truncate">{dest.description}</td>
                <td className="px-4 py-2">
                  <img src={dest.image} alt={dest.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => editDestination(dest)}
                    className="btn-secondary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDestination(dest._id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
