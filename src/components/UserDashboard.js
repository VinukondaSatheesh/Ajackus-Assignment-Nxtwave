
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [formState, setFormState] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch users from API
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const formattedUsers = response.data.map((user) => ({
          id: user.id,
          firstName: user.name.split(" ")[0] || "",
          lastName: user.name.split(" ")[1] || "",
          email: user.email,
          department: "N/A", 
        }));
        setUsers(formattedUsers);
      })
      .catch(() => {
        alert("Failed to fetch users.");
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Add or Update user
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      axios
        .put(`https://jsonplaceholder.typicode.com/users/${formState.id}`, formState)
        .then(() => {
          setUsers(
            users.map((user) => (user.id === formState.id ? formState : user))
          );
          alert("User updated successfully!");
          setIsEditMode(false);
          setFormState({
            id: null,
            firstName: "",
            lastName: "",
            email: "",
            department: "",
          });
        })
        .catch(() => {
          alert("Failed to update user.");
        });
    } else {
      axios
        .post("https://jsonplaceholder.typicode.com/users", formState)
        .then((response) => {
          setUsers([...users, { ...formState, id: response.data.id }]);
          alert("User added successfully!");
          setFormState({
            id: null,
            firstName: "",
            lastName: "",
            email: "",
            department: "",
          });
        })
        .catch(() => {
          alert("Failed to add user.");
        });
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setIsEditMode(true);
    setFormState(user);
  };

  // Delete user
  const handleDelete = (id) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        alert("User deleted successfully!");
      })
      .catch(() => {
        alert("Failed to delete user.");
      });
  };

  return (
    <div className="user-dashboard">
      <form onSubmit={handleSubmit} className="user-form">
        <h2>{isEditMode ? "Edit User" : "Add User"}</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formState.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formState.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formState.department}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isEditMode ? "Update" : "Add"}</button>
      </form>

      <div className="user-list">
        <h2 className="user-title">User List</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.department}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
