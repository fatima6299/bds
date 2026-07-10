import { useEffect, useState } from 'react';
import { Auth } from '../services/apiClient';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(Auth.getCurrentUser());
  }, []);

  if (!user) {
    return (
      <div className="container">
        <h2>Profil</h2>
        <p>Vous devez être connecté pour voir cette page.</p>
      </div>
    );
  }

  return (
    <section className="profile-page">
      <div className="container">
        <h2>Mon profil</h2>
        <div className="profile-details">
          <p><strong>Prénom :</strong> {user.firstname}</p>
          <p><strong>Nom :</strong> {user.lastname}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Téléphone :</strong> {user.phone}</p>
          <p><strong>Rôle :</strong> {user.role}</p>
        </div>
      </div>
    </section>
  );
}
