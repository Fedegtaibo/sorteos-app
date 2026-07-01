import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async enviarVerificacionEmail(data: {
    to: string;
    verificationUrl: string;
    nombre?: string;
  }) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM');

    if (!apiKey || !from) {
      this.logger.warn(
        'RESEND_API_KEY o EMAIL_FROM no configurado. Se omite envio de email de verificacion.',
      );

      return {
        skipped: true,
        reason: 'EMAIL_CONFIG_MISSING',
      };
    }

    const resend = new Resend(apiKey);
    const nombre = data.nombre || 'Hola';

    const subject = 'Verificá tu email en Sortealo';

    const html = `
      <div style="margin:0;padding:0;background:#09090b;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
        <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
          <div style="border:1px solid #27272a;background:#18181b;border-radius:24px;padding:32px;">
            <div style="display:inline-block;background:#fbbf24;color:#000000;font-weight:900;padding:10px 14px;border-radius:14px;margin-bottom:20px;">
              Sortealo
            </div>

            <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#ffffff;">
              Verificá tu email
            </h1>

            <p style="margin:0 0 18px;color:#d4d4d8;font-size:15px;line-height:1.6;">
              ${nombre}, gracias por registrarte en Sortealo.
            </p>

            <p style="margin:0 0 24px;color:#d4d4d8;font-size:15px;line-height:1.6;">
              Para proteger tu cuenta y confirmar que este email te pertenece, tocá el siguiente botón:
            </p>

            <a href="${data.verificationUrl}"
              style="display:inline-block;background:#fbbf24;color:#000000;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:16px;">
              Verificar mi email
            </a>

            <p style="margin:24px 0 0;color:#a1a1aa;font-size:13px;line-height:1.6;">
              Si el botón no funciona, copiá y pegá este enlace en tu navegador:
            </p>

            <p style="word-break:break-all;color:#fbbf24;font-size:13px;line-height:1.6;">
              ${data.verificationUrl}
            </p>

            <hr style="border:0;border-top:1px solid #27272a;margin:26px 0;" />

            <p style="margin:0;color:#71717a;font-size:12px;line-height:1.6;">
              Si vos no creaste una cuenta en Sortealo, podés ignorar este mensaje.
            </p>
          </div>
        </div>
      </div>
    `;

    const text = `
Verificá tu email en Sortealo

${nombre}, gracias por registrarte en Sortealo.

Para proteger tu cuenta y confirmar que este email te pertenece, abrí este enlace:

${data.verificationUrl}

Si vos no creaste una cuenta en Sortealo, podés ignorar este mensaje.
    `.trim();

    try {
      const result = await resend.emails.send({
        from,
        to: data.to,
        subject,
        html,
        text,
      });

      this.logger.log(`Email de verificacion enviado a ${data.to}`);

      return result;
    } catch (error: any) {
      this.logger.error(
        `No se pudo enviar email de verificacion a ${data.to}: ${error?.message || error}`,
      );

      return {
        skipped: true,
        reason: 'EMAIL_SEND_FAILED',
      };
    }
  }
}
