import { useState } from 'react';

const faqs = [
  {
    question: 'Mes données sont-elles sécurisées avec BDS BUSINESS ?',
    answer: 'Oui ! Nous utilisons un cryptage de niveau bancaire et des sauvegardes automatiques. Vos données sont stockées dans des centres de données sécurisés.',
  },
  {
    question: 'Puis-je importer mes données existantes ?',
    answer: 'Oui, vous pouvez importer vos données clients et produits depuis un format CSV ou Excel pour démarrer rapidement.',
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Nous acceptons le paiement par carte bancaire, virement bancaire, et paiements mobiles selon les intégrations locales disponibles.',
  },
  {
    question: 'Proposez-vous des formations ?',
    answer: 'Oui, nous proposons des formations en ligne et sur site pour former vos équipes à l’utilisation de la plateforme.',
  },
  
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-header">
          <h2>Questions fréquentes</h2>
          <p>Tout ce que vous devez savoir sur BDS BUSINESS.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '▲' : '▼'}</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact-prompt">
          <p>
            Une question spécifique ?{' '}
            <a href="/contact">Contactez-nous</a>
          </p>
        </div>
      </div>
    </section>
  );
}
