// =============================================================================
// UTILS : userAuth.js
// GESTION UNIFIÉE DE L'AUTHENTIFICATION & BASE DE DONNÉES LOCALE (MOCK MYSQL)
// =============================================================================

const USERS_KEY = 'ksc-users-db';
const DONATIONS_KEY = 'ksc-donations-db';
const INTERACTIONS_KEY = 'ksc-interactions-db';
const ACTIVE_SESSION_KEY = 'ksc-active-session';

// 1. Initialisation des tables locales (si vides)
export function initLocalDatabase() {
  const demoEmails = new Set([
    'admin@kafumbu-smartcity.cd',
    'citizen@kafumbu.cd',
    'bronze@kafumbu.cd',
    'silver@kafumbu.cd',
    'gold@kafumbu.cd'
  ]);
  const currentUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const realUsers = currentUsers.filter((user) => !demoEmails.has(String(user.email || '').trim().toLowerCase()));
  localStorage.setItem(USERS_KEY, JSON.stringify(realUsers));
  const activeSession = JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY) || 'null');
  if (activeSession && demoEmails.has(String(activeSession.email || '').trim().toLowerCase())) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    localStorage.removeItem('ksc-admin-auth');
    localStorage.removeItem('ksc-admin-name');
  }
  if (!localStorage.getItem(DONATIONS_KEY)) localStorage.setItem(DONATIONS_KEY, JSON.stringify([]));
  if (!localStorage.getItem(INTERACTIONS_KEY)) localStorage.setItem(INTERACTIONS_KEY, JSON.stringify([]));

  // Mock Table: USERS (Admin et Visiteurs/Investisseurs)
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers = [
      {
        id: 1,
        name: 'Admin Kafumbu',
        email: 'admin@kafumbu-smartcity.cd',
        password: 'Admin@123',
        role: 'admin',
        tier: 'none',
        company: 'KSC Global',
        phone: '+243 999 999 999',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Jean Citoyen',
        email: 'citizen@kafumbu.cd',
        password: 'Citizen@123',
        role: 'visitor',
        tier: 'citizen',
        company: 'Citoyen Engagé',
        phone: '+243 888 888 888',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Marc Bronze',
        email: 'bronze@kafumbu.cd',
        password: 'Bronze@123',
        role: 'visitor',
        tier: 'bronze',
        company: 'Bronze Holdings',
        phone: '+243 777 777 777',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Sophie Silver',
        email: 'silver@kafumbu.cd',
        password: 'Silver@123',
        role: 'visitor',
        tier: 'silver',
        company: 'Silver Invest RDC',
        phone: '+243 666 666 666',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'David Gold',
        email: 'gold@kafumbu.cd',
        password: 'Gold@123',
        role: 'visitor',
        tier: 'gold',
        company: 'Gold & Partners',
        phone: '+243 555 555 555',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }

  // Mock Table: DONATIONS
  if (!localStorage.getItem(DONATIONS_KEY)) {
    const defaultDonations = [
      {
        id: 101,
        userId: 2,
        amount: 10,
        paymentMethod: 'mobile',
        transactionRef: 'TX-MOB-CIT-987',
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 102,
        userId: 3,
        amount: 5000,
        paymentMethod: 'card',
        transactionRef: 'TX-CRD-BRZ-541',
        status: 'completed',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 103,
        userId: 4,
        amount: 25000,
        paymentMethod: 'bank',
        transactionRef: 'TX-BNK-SLV-302',
        status: 'completed',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 104,
        userId: 5,
        amount: 100000,
        paymentMethod: 'bank',
        transactionRef: 'TX-BNK-GLD-109',
        status: 'completed',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(defaultDonations));
  }

  // Mock Table: INTERACTIONS
  if (!localStorage.getItem(INTERACTIONS_KEY)) {
    const defaultInteractions = [
      {
        id: 201,
        userId: 2,
        type: 'download',
        details: 'Téléchargement de la brochure publique',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 202,
        userId: 3,
        type: 'invest',
        details: 'Premier versement de $5,000 pour le palier Bronze',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 203,
        userId: 3,
        type: 'support',
        details: 'Contact WhatsApp avec le support technique',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 204,
        userId: 4,
        type: 'invest',
        details: 'Signature de l\'accord consultatif initial pour le projet Silver',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 205,
        userId: 5,
        type: 'invest',
        details: 'Validation de la contribution Gold d\'un montant de $100,000',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(defaultInteractions));
  }
  initMessages();
}

// 2. Fonctions d'authentification
export function loginUser(email, password) {
  initLocalDatabase();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password);
  
  if (user) {
    // Stocker la session active sans le mot de passe pour la sécurité
    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));
    
    // Si c'est un administrateur, on active l'ancien flag pour préserver l'ancien middleware
    if (user.role === 'admin') {
      localStorage.setItem('ksc-admin-auth', 'true');
      localStorage.setItem('ksc-admin-name', user.name);
    }
    
    addInteraction(user.id, 'other', 'Connexion réussie à l\'espace personnel');
    return sessionUser;
  }
  return null;
}

export function registerVisitor(name, email, password, tier = 'none', company = '', phone = '') {
  initLocalDatabase();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  // Vérifier si l'utilisateur existe déjà
  if (users.some(u => u.email.trim().toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('Cet e-mail est déjà utilisé.');
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: 'visitor',
    tier,
    company,
    phone,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Si l'utilisateur s'inscrit avec un certain palier, on génère un don initial correspondant
  let amount = 0;
  if (tier === 'citizen') amount = 10;
  else if (tier === 'bronze') amount = 5000;
  else if (tier === 'silver') amount = 25000;
  else if (tier === 'gold') amount = 100000;

  if (amount > 0) {
    const donations = JSON.parse(localStorage.getItem(DONATIONS_KEY) || '[]');
    const newDon = {
      id: donations.length + 101,
      userId: newUser.id,
      amount,
      paymentMethod: 'card',
      transactionRef: `TX-REG-${tier.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    donations.push(newDon);
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  }

  // Enregistrer l'interaction d'inscription
  const interactions = JSON.parse(localStorage.getItem(INTERACTIONS_KEY) || '[]');
  interactions.push({
    id: interactions.length + 201,
    userId: newUser.id,
    type: 'invest',
    details: `Création du compte visiteur avec engagement de niveau ${tier.toUpperCase()}`,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(interactions));

  // Connecter automatiquement l'utilisateur nouvellement inscrit
  const sessionUser = { ...newUser };
  delete sessionUser.password;
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));

  return sessionUser;
}

export function getCurrentUser() {
  const session = localStorage.getItem(ACTIVE_SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function logoutUser() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    addInteraction(currentUser.id, 'other', 'Déconnexion de l\'espace personnel');
  }
  localStorage.removeItem(ACTIVE_SESSION_KEY);
  localStorage.removeItem('ksc-admin-auth');
  localStorage.removeItem('ksc-admin-name');
}

// 3. Fonctions d'interaction et de don
export function getDonationsForUser(userId) {
  initLocalDatabase();
  const donations = JSON.parse(localStorage.getItem(DONATIONS_KEY) || '[]');
  return donations.filter(d => d.userId === Number(userId));
}

export function getInteractionsForUser(userId) {
  initLocalDatabase();
  const interactions = JSON.parse(localStorage.getItem(INTERACTIONS_KEY) || '[]');
  return interactions.filter(i => i.userId === Number(userId));
}

export function addDonation(userId, amount, paymentMethod = 'card') {
  initLocalDatabase();
  const donations = JSON.parse(localStorage.getItem(DONATIONS_KEY) || '[]');
  
  const newDon = {
    id: donations.length + 101,
    userId: Number(userId),
    amount: Number(amount),
    paymentMethod,
    transactionRef: `TX-USR-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  donations.push(newDon);
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));

  // Mettre à jour l'interaction
  addInteraction(userId, 'invest', `Nouvel investissement d'un montant de $${amount.toLocaleString()} via ${paymentMethod}`);

  // Re-calculer le niveau/tier de l'utilisateur en fonction du total investi
  recalculateUserTier(userId);

  return newDon;
}

export function addInteraction(userId, type, details) {
  initLocalDatabase();
  const interactions = JSON.parse(localStorage.getItem(INTERACTIONS_KEY) || '[]');
  
  const newInteraction = {
    id: interactions.length + 201,
    userId: Number(userId),
    type,
    details,
    createdAt: new Date().toISOString()
  };

  interactions.push(newInteraction);
  localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(interactions));
  return newInteraction;
}

// Fonction interne pour recalculer automatiquement le niveau (tier) de l'utilisateur
function recalculateUserTier(userId) {
  const donations = getDonationsForUser(userId);
  const totalInvested = donations.reduce((sum, d) => sum + d.amount, 0);

  let newTier = 'none';
  if (totalInvested >= 100000) {
    newTier = 'gold';
  } else if (totalInvested >= 25000) {
    newTier = 'silver';
  } else if (totalInvested >= 5000) {
    newTier = 'bronze';
  } else if (totalInvested >= 10) {
    newTier = 'citizen';
  }

  // Mettre à jour la table des utilisateurs
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex(u => u.id === Number(userId));
  
  if (userIndex !== -1 && users[userIndex].tier !== newTier) {
    const oldTier = users[userIndex].tier;
    users[userIndex].tier = newTier;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Mettre à jour la session active également
    const session = getCurrentUser();
    if (session && session.id === Number(userId)) {
      session.tier = newTier;
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    }

    // Log l'upgrade de niveau
    addInteraction(userId, 'other', `Changement de niveau d'investissement : de ${oldTier.toUpperCase()} à ${newTier.toUpperCase()}`);
  }
}

// 4. Mise à jour du profil utilisateur & méthodes de paiement
export function updateUserProfile(userId, data) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex(u => u.id === Number(userId));
  
  if (userIndex !== -1) {
    // Vérifier si l'email est déjà pris par un autre utilisateur
    if (data.email && data.email.trim().toLowerCase() !== users[userIndex].email.trim().toLowerCase()) {
      if (users.some((u, idx) => idx !== userIndex && u.email.trim().toLowerCase() === data.email.trim().toLowerCase())) {
        throw new Error('Cet e-mail est déjà utilisé par un autre compte.');
      }
    }

    // Fusionner les données de mise à jour
    users[userIndex] = {
      ...users[userIndex],
      ...data
    };

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Mettre à jour la session active (sans le mot de passe pour la sécurité)
    const sessionUser = { ...users[userIndex] };
    delete sessionUser.password;
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));

    addInteraction(userId, 'other', 'Mise à jour des paramètres de profil/compte');
    return sessionUser;
  }
  return null;
}

export function resetUserPasswordLocal(email, newPassword) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
  
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Si l'utilisateur réinitialisé est l'utilisateur connecté, mettre à jour la session active également
    const session = getCurrentUser();
    if (session && session.email.trim().toLowerCase() === email.trim().toLowerCase()) {
      const sessionUser = { ...users[userIndex] };
      delete sessionUser.password;
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));
    }
    
    addInteraction(users[userIndex].id, 'other', 'Réinitialisation locale du mot de passe');
    return true;
  }
  return false;
}

// =============================================================================
// GESTIONNAIRE DE MESSAGERIE FAÇON OUTLOOK (SYNC EN TEMPS RÉEL PAR LOCALSTORAGE)
// =============================================================================

const MESSAGES_KEY = 'ksc-messages-db';

export function initMessages() {
  const demoMessageIds = new Set([1001, 1002, 1003, 1004, 1005]);
  const currentMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  const realMessages = currentMessages.filter((message) => !demoMessageIds.has(Number(message.id)));
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(realMessages));

  if (!localStorage.getItem(MESSAGES_KEY)) {
    const defaultMessages = [
      {
        id: 1001,
        senderId: 2, // Jean Citoyen
        receiverId: 1, // Admin
        senderName: 'Jean Citoyen',
        content: "Bonjour, j'ai effectué un premier don de 15 USD. Comment puis-je suivre l'avancement des chantiers de la Phase 1 ?",
        createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
        read: true
      },
      {
        id: 1002,
        senderId: 1, // Admin
        receiverId: 2, // Jean Citoyen
        senderName: 'Admin Kafumbu',
        content: "Bonjour Jean ! Merci beaucoup pour votre contribution. Vous pouvez suivre l'avancement global en temps réel directement depuis votre onglet 'Vue d'ensemble' grâce aux indicateurs de chantier.",
        createdAt: new Date(Date.now() - 3600000 * 24 * 3 + 1800000).toISOString(),
        read: true
      },
      {
        id: 1003,
        senderId: 2, // Jean Citoyen
        receiverId: 1,
        senderName: 'Jean Citoyen',
        content: "Super ! Je vois que la phase solaire avance très bien. Merci pour vos efforts.",
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
        read: true
      },
      {
        id: 1004,
        senderId: 4, // Sophie Silver
        receiverId: 1,
        senderName: 'Sophie Silver',
        content: "Bonjour, nous aimerions obtenir une copie signée du certificat numérique d'engagement pour notre société Silver Invest RDC. Est-ce disponible ?",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
        read: false
      },
      {
        id: 1005,
        senderId: 5, // David Gold
        receiverId: 1,
        senderName: 'David Gold',
        content: "Hello team! I'm planning to invest an additional $150,000 for the Port Autonome infrastructure. Can we schedule a virtual meeting this week with the Phase 3 director?",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        read: false
      }
    ];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(defaultMessages));
  }
}

export function getAllMessages() {
  initMessages();
  return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
}

export function getMessagesForUser(userId) {
  const allMsgs = getAllMessages();
  return allMsgs.filter(
    m => (m.senderId === Number(userId) && m.receiverId === 1) ||
         (m.senderId === 1 && m.receiverId === Number(userId))
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function sendMessage(senderId, receiverId, content) {
  const allMsgs = getAllMessages();
  
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const sender = users.find(u => u.id === Number(senderId));
  const senderName = sender ? sender.name : (Number(senderId) === 1 ? 'Admin Kafumbu' : 'Visiteur');

  const newMsg = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    senderId: Number(senderId),
    receiverId: Number(receiverId),
    senderName,
    content,
    createdAt: new Date().toISOString(),
    read: false
  };

  allMsgs.push(newMsg);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMsgs));
  
  // Déclencher un événement global artificiel de localStorage pour forcer la mise à jour locale immédiate dans le même onglet
  window.dispatchEvent(new Event('storage'));
  
  return newMsg;
}

export function markMessagesAsRead(chatPartnerId, currentUserId) {
  const allMsgs = getAllMessages();
  let updated = false;

  const newMsgs = allMsgs.map(m => {
    if (m.senderId === Number(chatPartnerId) && m.receiverId === Number(currentUserId) && !m.read) {
      updated = true;
      return { ...m, read: true };
    }
    return m;
  });

  if (updated) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMsgs));
    window.dispatchEvent(new Event('storage'));
  }
}
