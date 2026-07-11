import { useEffect, useState } from 'react';
import { Auth } from '../services/apiClient';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const current = Auth.getCurrentUser();
    setUser(current);
    if (current) {
      setFirstname(current.firstname || '');
      setLastname(current.lastname || '');
      setEmail(current.email || '');
      setPhone(current.phone || '');
    }
  }, []);

  if (!user) {
    return (
      <div className="container">
        <h2>Profil</h2>
        <p>Vous devez être connecté pour voir cette page.</p>
      </div>
    );
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setSavingProfile(true);

    try {
      const data = await Auth.updateProfile({ firstname, lastname, email, phone });
      setUser(data.user);
      setProfileSuccess('Profil mis à jour avec succès.');
    } catch (err) {
      setProfileError(err.message || 'Erreur lors de la mise à jour du profil.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSavingPassword(true);
    try {
      await Auth.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Mot de passe changé avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <section className="profile-page">
      <div className="container">
        <h2>Mon profil</h2>

        <div className="profile-card">
          <h3>Informations personnelles</h3>
          {profileError && <p className="profile-error">{profileError}</p>}
          {profileSuccess && <p className="profile-success">{profileSuccess}</p>}
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">Prénom</label>
                <input id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Nom</label>
                <input id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
            <p className="profile-role"><strong>Rôle :</strong> {user.role}</p>
            <button type="submit" className="btn-primary" disabled={savingProfile}>
              {savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <h3>Changer le mot de passe</h3>
          {passwordError && <p className="profile-error">{passwordError}</p>}
          {passwordSuccess && <p className="profile-success">{passwordSuccess}</p>}
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={savingPassword}>
              {savingPassword ? 'Modification...' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
