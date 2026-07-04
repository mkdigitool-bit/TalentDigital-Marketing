import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { validateGeneralContactPayload } from './_validate.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée.' });
  }

  const body = req.body || {};
  const result = validateGeneralContactPayload(body);

  if (!result.valid) {
    if (result.honeypot) {
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ ok: false, error: result.error });
  }

  const prenom = body.prenom.trim();
  const email = body.email.trim();
  const tel = typeof body.tel === 'string' ? body.tel.trim() : '';
  const message = body.message.trim();

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error: dbError } = await supabase.from('general_inquiries').insert({
      prenom,
      email,
      telephone: tel || null,
      message,
    });

    if (dbError) {
      throw new Error(`Supabase insert failed: ${dbError.message}`);
    }

    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.CONTACT_TO_EMAIL || 'info@talentdigital.net',
      replyTo: email,
      subject: `Nouveau message de contact — ${prenom}`,
      text: [
        `Prénom : ${prenom}`,
        `Email : ${email}`,
        `Téléphone : ${tel || 'non renseigné'}`,
        '',
        'Message :',
        message,
      ].join('\n'),
    });

    if (emailError) {
      throw new Error(`Resend send failed: ${emailError.message}`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('General contact form submission failed:', err);
    return res.status(500).json({
      ok: false,
      error: 'Une erreur est survenue. Réessayez ou écrivez-nous directement à info@talentdigital.net.',
    });
  }
}
