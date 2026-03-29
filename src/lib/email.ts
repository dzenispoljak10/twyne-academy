import { Resend } from 'resend'
import type { User, Certificate, Course } from '@prisma/client'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'noreply@twyneacademy.com'

export async function sendWelcomeEmail(user: User) {
  const name = user.firstName ?? user.email
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `Willkommen bei Twyne Academy, ${name}!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#185FA5">Willkommen bei Twyne Academy</h1>
        <p>Hallo ${name},</p>
        <p>Schön, dass du dabei bist! Entdecke unsere professionellen Kurse und starte deine Lernreise.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/de/kurse" style="background:#185FA5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Kurse entdecken</a>
        <p style="color:#888;margin-top:32px;font-size:14px">© ${new Date().getFullYear()} Twyne Academy</p>
      </div>
    `,
  })
}

export async function sendCertificateEmail(user: User, certificate: Certificate, course: Course) {
  const name = user.firstName ?? user.email
  const courseTitle = (course.title as Record<string, string>)[user.locale ?? 'de'] ?? ''
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `Dein Zertifikat: ${courseTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#185FA5">Herzlichen Glückwunsch, ${name}!</h1>
        <p>Du hast <strong>${courseTitle}</strong> erfolgreich abgeschlossen.</p>
        <a href="${certificate.pdfUrl}" style="background:#185FA5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Zertifikat herunterladen</a>
        <p style="color:#888;margin-top:32px;font-size:14px">Zertifikat-ID: ${certificate.certNumber}</p>
        <p style="color:#888;font-size:14px">© ${new Date().getFullYear()} Twyne Academy</p>
      </div>
    `,
  })
}

export async function sendPurchaseEmail(user: User, course: Course, amount: number) {
  const name = user.firstName ?? user.email
  const courseTitle = (course.title as Record<string, string>)[user.locale ?? 'de'] ?? ''
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `Kaufbestätigung: ${courseTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#185FA5">Kaufbestätigung</h1>
        <p>Hallo ${name}, vielen Dank für deinen Kauf!</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee">Kurs</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${courseTitle}</strong></td></tr>
          <tr><td style="padding:8px">Betrag</td><td style="padding:8px"><strong>CHF ${(amount / 100).toFixed(2)}</strong></td></tr>
        </table>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/de/lernen/${course.slug}" style="background:#185FA5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">Kurs starten</a>
        <p style="color:#888;margin-top:32px;font-size:14px">© ${new Date().getFullYear()} Twyne Academy</p>
      </div>
    `,
  })
}

export async function sendMagicLinkEmail(email: string, url: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Dein Twyne Academy Login-Link',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#185FA5">Anmelden bei Twyne Academy</h1>
        <p>Klicke auf den Button um dich anzumelden. Der Link ist 10 Minuten gültig.</p>
        <a href="${url}" style="background:#185FA5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Jetzt anmelden</a>
        <p style="color:#888;margin-top:32px;font-size:14px">Falls du diese E-Mail nicht angefordert hast, ignoriere sie einfach.</p>
        <p style="color:#888;font-size:14px">© ${new Date().getFullYear()} Twyne Academy</p>
      </div>
    `,
  })
}

export async function sendSubscriptionExpiryEmail(user: User) {
  const name = user.firstName ?? user.email
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: 'Dein Twyne Academy Abo läuft ab',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#185FA5">Dein Abo läuft in 7 Tagen ab</h1>
        <p>Hallo ${name},</p>
        <p>Dein Twyne Academy Abo endet in 7 Tagen. Verlängere jetzt um weiterhin Zugang zu allen Kursen zu haben.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/de/abo" style="background:#185FA5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Abo verlängern</a>
        <p style="color:#888;margin-top:32px;font-size:14px">© ${new Date().getFullYear()} Twyne Academy</p>
      </div>
    `,
  })
}
