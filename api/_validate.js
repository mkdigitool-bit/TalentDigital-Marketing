const REQUIRED_FIELDS = ['prenom', 'nom', 'email', 'service', 'message'];

const FIELD_LABELS = {
  prenom: 'prenom',
  nom: 'nom',
  email: 'email',
  service: 'service',
  message: 'message',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(body) {
  const data = body || {};

  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return { valid: false, honeypot: true };
  }

  for (const field of REQUIRED_FIELDS) {
    const value = data[field];
    if (typeof value !== 'string' || value.trim() === '') {
      return {
        valid: false,
        honeypot: false,
        error: `Le champ "${FIELD_LABELS[field]}" est requis.`,
      };
    }
  }

  if (!EMAIL_RE.test(data.email.trim())) {
    return { valid: false, honeypot: false, error: 'Adresse email invalide.' };
  }

  return { valid: true, honeypot: false };
}

const GENERAL_REQUIRED_FIELDS = ['prenom', 'email', 'message'];

const GENERAL_FIELD_LABELS = {
  prenom: 'prenom',
  email: 'email',
  message: 'message',
};

export function validateGeneralContactPayload(body) {
  const data = body || {};

  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return { valid: false, honeypot: true };
  }

  for (const field of GENERAL_REQUIRED_FIELDS) {
    const value = data[field];
    if (typeof value !== 'string' || value.trim() === '') {
      return {
        valid: false,
        honeypot: false,
        error: `Le champ "${GENERAL_FIELD_LABELS[field]}" est requis.`,
      };
    }
  }

  if (!EMAIL_RE.test(data.email.trim())) {
    return { valid: false, honeypot: false, error: 'Adresse email invalide.' };
  }

  return { valid: true, honeypot: false };
}
