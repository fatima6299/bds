import { useState } from 'react';
import { Contact as ContactService } from '../services/apiClient';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSending(true);

    try {
      const data = await ContactService.send({ name, email, message });
      setSuccess(data.message || 'Votre message a bien été envoyé.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi du message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="contact-page">
      <div className="container">
        <div className="section-header">
          <h2>Contactez-nous</h2>
          <p>Pour toute question, contactez notre service client ou utilisez le formulaire ci-dessous.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>Service client</h3>
            <p><strong>Email :</strong> fatimatidianedia@gmail.com</p>
            <p><strong>Téléphone :</strong> +221 70 103 01 64</p>
            <p><strong>Adresse :</strong> Dakar, Sénégal</p>
          </div>
          <div className="contact-card">
            <h3>Une question spécifique ?</h3>
            <p>Notre équipe répond rapidement à vos demandes pour vous aider à réussir.</p>
            {success && <p className="contact-success">{success}</p>}
            {error && <p className="contact-error">{error}</p>}
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Nom
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label>
                Message
                <textarea
                  rows="5"
                  placeholder="Votre message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
