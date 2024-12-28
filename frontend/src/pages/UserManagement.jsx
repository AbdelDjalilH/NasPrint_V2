import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/userManagement.css";
import axios from "axios";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token non disponible pour l'authentification");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
      console.log("Utilisateurs récupérés:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Erreur API:", error.response.data);
        console.error("Statut de la réponse:", error.response.status);
      } else {
        console.error("Erreur de réseau ou autre:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditUserData({
      username: user.username,
      email: user.email,
      password: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isTokenValid = (token) => {
    const parts = token.split(".");
    return parts.length === 3;
  };

  // Soumission de la modification
  const handleEditSubmit = async () => {
    if (!editUserId) return;
    const token = localStorage.getItem("token");

    console.log("Token utilisé pour la requête :", token);
    if (!isTokenValid(token)) {
      console.error("Le token est manquant ou mal formé.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${editUserId}`,
        editUserData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Réponse de mise à jour:", response.data);
      await fetchUsers();
      setEditUserId(null);
      setEditUserData({ username: "", email: "", password: "" });
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      console.log("Utilisateur supprimé avec succès");
    } catch (error) {
      handleError(error);
    }
  };

  const handleCreateUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        editUserData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Nouvel utilisateur créé:", response.data);
      await fetchUsers();
      resetEditForm();
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.error("Erreur API:", error.response.data);
      console.error("Statut de la réponse:", error.response.status);
    } else {
      console.error("Erreur de réseau ou autre:", error.message);
    }
  };

  const resetEditForm = () => {
    setEditUserId(null);
    setEditUserData({ username: "", email: "", password: "" });
  };

  return (
    <div className="container">
      <Link className="retour-link" to="/admin-page">
        Retour
      </Link>
      <div className="wrapper">
        <h2 className="title">Gestion des utilisateurs</h2>
        <div className="grid">
          {users.map((user) => (
            <div key={user.id} className="card">
              {editUserId === user.id ? (
                <div>
                  <input
                    type="text"
                    name="username"
                    value={editUserData.username}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Pseudo"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editUserData.email}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    name="password"
                    value={editUserData.password}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Mot de passe"
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="button button-green"
                      onClick={handleEditSubmit}
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      className="button button-gray"
                      onClick={resetEditForm}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-title">{user.username}</h3>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <div>
                    <button type="button" onClick={() => handleEditClick(user)}>
                      Editer
                    </button>
                    <button type="button" onClick={() => handleDelete(user.id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
