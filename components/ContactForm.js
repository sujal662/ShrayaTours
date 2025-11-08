function ContactForm() {
  const [formData, setFormData] = React.useState({ name: '', phone: '', email: '', address: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Phone number validation: only allow digits, spaces, hyphens, parentheses
    if (name === 'phone') {
      processedValue = value.replace(/[^0-9\s\-\(\)]/g, '');
    }

    // Name validation: only allow letters and spaces
    if (name === 'name') {
      processedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setFormData({ ...formData, [name]: processedValue });
  };

  const validateForm = () => {
    const errors = [];

    if (formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (formData.reason.trim().length < 10) {
      errors.push('Reason for contact must be at least 10 characters long');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setMessage({ type: 'error', text: validationErrors.join('. ') });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      setMessage({ type: 'success', text: 'Thank you! We will contact you soon.' });
      setFormData({ name: '', phone: '', email: '', address: '', reason: '' });
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Contact Us</h2>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="form-input" rows="3"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason for Contact</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} className="form-input" rows="4" required></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {message.text && (
            <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
