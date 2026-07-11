import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Auth } from '../services/apiClient';
import './AuthPage.css';

export default function ForgotPassword() {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  async function handleRequestReset(event) {
    event.preventDefault();
    setError('');
    try {
      const data = await Auth.requestPasswordReset(email);
      // Pas d'envoi d'email configuré pour le moment : le code est renvoyé directement.
      setResetToken(data.resetToken || '');
      setInfo(
        data.resetToken
          ? `Code de réinitialisation : ${data.resetToken} (valable 1 heure)`
          : 'Un code de réinitialisation a été envoyé.'
      );
      setStep('reset');
    } catch (err) {
      setError(err.message || "Erreur lors de la demande de réinitialisation.");
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await Auth.resetPassword(resetToken, newPassword);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation du mot de passe.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Mot de passe oublié</h2>
        {error && <div className="error-message">{error}</div>}
        {info && <div className="info-message">{info}</div>}

        {step === 'request' ? (
          <form onSubmit={handleRequestReset}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                required
              />
            </div>
            <button type="submit" className="btn-login">Recevoir un code</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="resetToken">Code reçu</label>
              <input
                id="resetToken"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-login">Réinitialiser le mot de passe</button>
          </form>
        )}

        <p className="register-link">
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
