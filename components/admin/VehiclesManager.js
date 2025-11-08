function VehiclesManager() {
  const [vehicles, setVehicles] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [formData, setFormData] = React.useState({ name: '', description: '', image: '' });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://shrayatours.onrender.com/api/vehicles');
      if (!res.ok) throw new Error('Failed to load vehicles');
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await fetch(`https://shrayatours.onrender.com/api/vehicles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('https://shrayatours.onrender.com/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      if (!res.ok) throw new Error('Failed to save vehicle');
      await loadVehicles();
      setFormData({ name: '', description: '', image: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Error saving vehicle');
    }
  };

  const editVehicle = (vehicle) => {
    setFormData({ name: vehicle.name, description: vehicle.description, image: vehicle.image });
    setEditingId(vehicle._id);
    setShowForm(true);
  };

  const deleteVehicle = async (id) => {
    if (!confirm('Delete this vehicle?')) return;
    try {
      const res = await fetch(`https://shrayatours.onrender.com/api/vehicles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete vehicle');
      await loadVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Error deleting vehicle');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vehicles ({vehicles.length})</h2>
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
            {editingId ? 'Update' : 'Add'} Vehicle
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
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id} className="border-b">
                <td className="px-4 py-2 font-medium">{vehicle.name}</td>
                <td className="px-4 py-2 max-w-xs truncate">{vehicle.description}</td>
                <td className="px-4 py-2">
                  <img src={vehicle.image} alt={vehicle.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => editVehicle(vehicle)}
                    className="btn-secondary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteVehicle(vehicle._id)}
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
