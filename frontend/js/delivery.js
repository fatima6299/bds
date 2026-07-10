/**
 * delivery.js - Gestion livraison et création de commande
 * BDS BUSINESS - Adapté pour api.js
 */

// ✅ Constante globale (en dehors de DOMContentLoaded)
const WHATSAPP_NUMBER = '221781109439';

document.addEventListener('DOMContentLoaded', function() {
  // ✅ VÉRIFICATION : Attendre que api.js soit chargé
  if (typeof Auth === 'undefined' || typeof Cart === 'undefined' || typeof Orders === 'undefined') {
    console.error('❌ api.js non chargé ! Vérifiez l\'ordre des scripts dans delivery.html');
    alert('Erreur de chargement. Rechargez la page.');
    return;
  }

  console.log('✅ delivery.js chargé - api.js détecté');

  const deliveryForm = document.getElementById('deliveryForm');
  
  if (!deliveryForm) {
    console.error('❌ Formulaire non trouvé');
    return;
  }

  // Vérifications initiales
  checkAuthentication();
  displayCartSummary();
  prefillUserInfo();
  
  // Gérer la soumission
  deliveryForm.addEventListener('submit', handleFormSubmit);
});

/**
 * Vérifier l'authentification
 */
function checkAuthentication() {
  if (!Auth.isAuthenticated()) {
    alert('Veuillez vous connecter pour continuer');
    window.location.href = 'login.html';
  }
}

/**
 * Afficher le résumé du panier
 */
async function displayCartSummary() {
  try {
    console.log('🛒 Chargement du panier...');
    const response = await Cart.get();
    
    if (!response.success || !response.cart || response.cart.length === 0) {
      alert('⚠️ Votre panier est vide');
      window.location.href = 'cart.html';
      return;
    }

    console.log('✅ Panier chargé:', response.cart.length, 'articles');

    // Afficher le résumé
    const summaryHTML = `
      <div class="cart-summary" style="background: #e3f2fd; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border-left: 4px solid #2196f3;">
        <h3 style="margin-bottom: 1rem; color: #1976d2;">
          <i class="fas fa-shopping-cart"></i> Votre panier
        </h3>
        <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem;">
          ${response.cart.slice(0, 3).map(item => `
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
              <span>${item.name} (x${item.quantity})</span>
              <strong>${formatPrice(item.subtotal)} FCFA</strong>
            </div>
          `).join('')}
          ${response.cart.length > 3 ? `
            <div style="color: #666; font-size: 0.85rem;">
              + ${response.cart.length - 3} autre(s) article(s)
            </div>
          ` : ''}
        </div>
        <div style="border-top: 2px solid #2196f3; padding-top: 1rem; display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; color: #1976d2;">
          <span>Total</span>
          <span>${formatPrice(response.total)} FCFA</span>
        </div>
      </div>
    `;

    const deliveryContainer = document.querySelector('.delivery-container');
    if (deliveryContainer) {
      deliveryContainer.insertAdjacentHTML('afterbegin', summaryHTML);
    }

  } catch (error) {
    console.error('❌ Erreur chargement panier:', error);
    alert('Erreur lors du chargement du panier');
  }
}

/**
 * Pré-remplir les informations utilisateur
 */
function prefillUserInfo() {
  const user = Auth.getCurrentUser();
  if (!user) return;
  
  console.log('👤 Pré-remplissage avec:', user.firstname, user.lastname);
  
  if (user.firstname && user.lastname) {
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
      fullNameInput.value = `${user.firstname} ${user.lastname}`;
    }
  }
  
  if (user.phone) {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.value = user.phone;
    }
  }
}

/**
 * Gérer la soumission du formulaire
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const deliveryInfo = {
    fullName: document.getElementById('fullName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    city: document.getElementById('city').value.trim(),
    notes: document.getElementById('notes').value.trim() || ''
  };

  console.log('📝 Informations de livraison:', deliveryInfo);

  // Validation
  if (!validateForm(deliveryInfo)) return;
  if (!validatePhone(deliveryInfo.phone)) {
    alert('⚠️ Numéro invalide. Format: 77 XXX XX XX');
    document.getElementById('phone').focus();
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création de la commande...';
  submitBtn.disabled = true;
  
  try {
    // 1. Récupérer le panier AVANT de créer la commande
    console.log('🛒 Récupération du panier avant commande...');
    const cartResponse = await Cart.get();
    
    if (!cartResponse.success || !cartResponse.cart || cartResponse.cart.length === 0) {
      throw new Error('Votre panier est vide');
    }

    console.log('✅ Panier récupéré:', cartResponse.cart.length, 'articles');

    // 2. MAINTENANT créer la commande (le panier sera vidé par le backend)
    console.log('📦 Création de la commande...');
    const orderResponse = await Orders.create('pending');
    
    if (!orderResponse.success) {
      throw new Error(orderResponse.message || 'Erreur création commande');
    }

    console.log('✅ Commande créée #' + orderResponse.order.id);
    console.log('🧹 Le panier a été vidé par le backend');

    // 3. Sauvegarder pour WhatsApp (utiliser les données du panier AVANT vidage)
    const orderData = {
      orderId: orderResponse.order.id,
      cart: cartResponse.cart,
      total: cartResponse.total,
      deliveryInfo: deliveryInfo,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('bds_last_order', JSON.stringify(orderData));
    localStorage.setItem('bds_delivery_info', JSON.stringify(deliveryInfo));

    console.log('💾 Données sauvegardées pour WhatsApp');

    // 4. Afficher WhatsApp
    setupWhatsAppButton(orderData);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    alert('❌ Erreur: ' + error.message);
    
    // Restaurer le bouton
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

/**
 * Configurer le bouton WhatsApp
 */
function setupWhatsAppButton(orderData) {
  const message = generateWhatsAppMessage(orderData);
  
  const whatsappButton = document.getElementById('whatsappButton');
  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  whatsappButton.href = whatsappURL;

  // Afficher la section WhatsApp
  document.getElementById('whatsappSection').style.display = 'block';
  document.querySelector('.delivery-form').style.display = 'none';
  
  setTimeout(() => {
    document.getElementById('whatsappSection').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 100);

  console.log('✅ WhatsApp configuré');
}

/**
 * Générer le message WhatsApp
 */
function generateWhatsAppMessage(orderData) {
  const { orderId, cart, total, deliveryInfo } = orderData;
  
  let message = `🛍️ *NOUVELLE COMMANDE - BDS BUSINESS*\n\n`;
  
  message += `📋 *Commande #${orderId}*\n`;
  message += `📅 ${new Date().toLocaleDateString('fr-FR')}\n\n`;
  
  // Client
  message += `┌─────────────────────────\n`;
  message += `│ *INFORMATIONS CLIENT*\n`;
  message += `├─────────────────────────\n`;
  message += `│ 👤 ${deliveryInfo.fullName}\n`;
  message += `│ 📞 ${deliveryInfo.phone}\n`;
  message += `└─────────────────────────\n\n`;
  
  // Livraison
  message += `┌─────────────────────────\n`;
  message += `│ *ADRESSE DE LIVRAISON*\n`;
  message += `├─────────────────────────\n`;
  message += `│ 📍 ${deliveryInfo.address}\n`;
  message += `│ 🏙️ ${deliveryInfo.city}\n`;
  
  if (deliveryInfo.notes) {
    message += `│ 📝 ${deliveryInfo.notes}\n`;
  }
  message += `└─────────────────────────\n\n`;
  
  // Produits
  message += `┌─────────────────────────\n`;
  message += `│ *ARTICLES COMMANDÉS*\n`;
  message += `├─────────────────────────\n`;
  
  let totalItems = 0;
  
  cart.forEach((item, index) => {
    totalItems += item.quantity;
    const price = item.discounted_price || item.price;
    
    message += `│ ${index + 1}. ${item.name}\n`;
    message += `│    Qté: x${item.quantity} × ${formatPrice(price)} FCFA\n`;
    message += `│    Total: ${formatPrice(item.subtotal)} FCFA\n`;
    
    if (index < cart.length - 1) {
      message += `│\n`;
    }
  });
  
  message += `└─────────────────────────\n\n`;
  
  // Total
  message += `┏━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
  message += `┃ 📦 ${totalItems} article${totalItems > 1 ? 's' : ''}\n`;
  message += `┃ 💵 *TOTAL: ${formatPrice(total)} FCFA*\n`;
  message += `┗━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
  
  message += `✅ Commande confirmée\n`;
  message += `💳 En attente des informations de paiement\n\n`;
  message += `_Commande #${orderId} - BDS BUSINESS_`;
  
  return message;
}

// Validation
function validateForm({ fullName, phone, address, city }) {
  if (!fullName || !phone || !address || !city) {
    alert('⚠️ Remplissez tous les champs obligatoires (*)');
    return false;
  }
  if (fullName.length < 3) {
    alert('⚠️ Nom complet trop court');
    return false;
  }
  if (address.length < 10) {
    alert('⚠️ Adresse trop courte');
    return false;
  }
  return true;
}

function validatePhone(phone) {
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^(77|78|70|76|75)[0-9]{7}$/.test(clean);
}

function formatPrice(price) {
  return parseFloat(price).toLocaleString('fr-FR');
}