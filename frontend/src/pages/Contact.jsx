export default function Contact() {
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
            <form className="contact-form">
              <label>
                Nom
                <input type="text" placeholder="Votre nom" />
              </label>
              <label>
                Email
                <input type="email" placeholder="Votre email" />
              </label>
              <label>
                Message
                <textarea rows="5" placeholder="Votre message" />
              </label>
              <button type="button" className="btn-primary">Envoyer le message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
