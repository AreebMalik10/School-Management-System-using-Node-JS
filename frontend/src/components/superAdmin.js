import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuperAdmin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);

  // School form data
  const [formData, setFormData] = useState({
    school_name: "",
    school_address: "",
    school_phone: "",
    principal_name: "",
    grades_offered: "",
    school_registration_no: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch all admins when the component mounts
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/view-admins', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAdmins(response.data.admins);
      } catch (error) {
        setFetchError('Error fetching admins.');
      }
    };

    fetchAdmins();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle admin form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create admin and school in one request
    try {
      const response = await axios.post('http://localhost:5000/admin/create-admin', {
        name,
        email,
        password,
        school_name: formData.school_name,
        school_address: formData.school_address,
        school_phone: formData.school_phone,
        principal_name: formData.principal_name,
        grades_offered: formData.grades_offered,
        school_registration_no: formData.school_registration_no,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to add admin and school.");
    }
    
    // Reset form after submission
    setName('');
    setEmail('');
    setPassword('');
    setFormData({
      school_name: "",
      school_address: "",
      school_phone: "",
      principal_name: "",
      grades_offered: "",
      school_registration_no: "",
    });

    // Re-fetch admins after creation
    const fetchResponse = await axios.get('http://localhost:5000/admin/view-admins', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setAdmins(fetchResponse.data.admins);
  };

  // Handle edit action
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPassword(''); // You can leave password empty for now, since it's optional during editing
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/admin/delete-admin/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);

      // Re-fetch admins after deletion
      const fetchResponse = await axios.get('http://localhost:5000/admin/view-admins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAdmins(fetchResponse.data.admins);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting admin.');
    }
  };

  

  return (
    <>
      <div className="container">
        <h2>{editingAdmin ? 'Edit Admin' : 'Create Admin'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editingAdmin} // Only require password if editing a new admin
          />
          <button type="submit">{editingAdmin ? 'Update Admin' : 'Create Admin'}</button>
        </form>

        {message && <p>{message}</p>}
        {fetchError && <p>{fetchError}</p>}

        <h3>Admins List</h3>
        <ul>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <li key={admin.id}>
                {admin.name} ({admin.email})
                <button onClick={() => handleEdit(admin)}>Edit</button>
                <button onClick={() => handleDelete(admin.id)}>Delete</button>
              </li>
            ))
          ) : (
            <p>No admins found.</p>
          )}
        </ul>
      </div>

      <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
        <h2>Add a New School</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>School Name:</label>
            <input
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>School Address:</label>
            <input
              type="text"
              name="school_address"
              value={formData.school_address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>School Phone:</label>
            <input
              type="text"
              name="school_phone"
              value={formData.school_phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Principal Name:</label>
            <input
              type="text"
              name="principal_name"
              value={formData.principal_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Grades Offered:</label>
            <input
              type="text"
              name="grades_offered"
              value={formData.grades_offered}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>School Registration No:</label>
            <input
              type="text"
              name="school_registration_no"
              value={formData.school_registration_no}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: "15px" }}>Submit</button>
        </form>

        {responseMessage && <p style={{ color: "green" }}>{responseMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </>
  );
};

export default SuperAdmin;