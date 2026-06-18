import { Inject, Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
  private readonly config: ConfigService,
  @Inject('KNEX') private readonly db: Knex,
) {}

  // ─── PARTICIPANTE ─────────────────────────────────────────

  async compraConfirmada(data: {
    email: string; nombre: string;
    numero: number; sorteoNombre: string;
    fechaSorteo: Date; comprobanteUrl?: string;
  }) {
    await this.enviar({
      to: data.email,
      subject: `✅ Número ${data.numero} confirmado — ${data.sorteoNombre}`,
      html: this.template(`
        <h2>¡Tu participación está confirmada!</h2>
        <p>Hola, tu número <strong>${data.numero}</strong> en el sorteo de <strong>${data.sorteoNombre}</strong> fue registrado exitosamente.</p>
        <table style="border-collapse:collapse;width:100%;margin:20px 0">
          <tr><td style="padding:8px;border:1px solid #eee;color:#666">Número</td><td style="padding:8px;border:1px solid #eee"><strong>${data.numero}</strong></td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;color:#666">Sorteo</td><td style="padding:8px;border:1px solid #eee">${data.sorteoNombre}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;color:#666">Fecha del sorteo</td><td style="padding:8px;border:1px solid #eee">${data.fechaSorteo.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
        </table>
        ${data.comprobanteUrl ? `<a href="${data.comprobanteUrl}" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Descargar comprobante</a>` : ''}
        <p style="color:#888;font-size:13px;margin-top:20px">Guardá este email como comprobante de tu participación.</p>
      `),
    });
  }

  async ganadorSorteo(data: {
    email: string; nombre: string;
    numero: number; sorteoNombre: string;
    premio: string; contactoComercio: string;
  }) {
    await this.enviar({
      to: data.email,
      subject: `🏆 ¡GANASTE el sorteo de ${data.sorteoNombre}!`,
      html: this.template(`
        <div style="text-align:center;padding:20px 0">
          <div style="font-size:64px">🏆</div>
          <h1 style="color:#22c55e">¡Felicitaciones!</h1>
          <p style="font-size:18px">Tu número <strong>${data.numero}</strong> fue el ganador del sorteo de <strong>${data.sorteoNombre}</strong>.</p>
          <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px;margin:20px 0;text-align:left">
            <p><strong>Premio:</strong> ${data.premio}</p>
            <p><strong>Contacto del comercio:</strong> ${data.contactoComercio}</p>
          </div>
          <p>El comercio se contactará con vos a la brevedad para coordinar la entrega del premio.</p>
        </div>
      `),
    });
  }

  async resultadoSorteo(data: {
    email: string; sorteoNombre: string;
    numeroGanador: number; linkVerificacion: string;
  }) {
    await this.enviar({
      to: data.email,
      subject: `Resultado del sorteo de ${data.sorteoNombre}`,
      html: this.template(`
        <h2>Resultado del sorteo</h2>
        <p>El sorteo de <strong>${data.sorteoNombre}</strong> ya fue realizado.</p>
        <p>El número ganador fue el <strong>${data.numeroGanador}</strong>.</p>
        <p>Esta vez no fue, ¡seguí participando en los próximos sorteos!</p>
        <a href="${data.linkVerificacion}" style="display:inline-block;background:#6b7280;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:16px">Verificar resultado</a>
      `),
    });
  }

  async devolucionIniciada(data: {
    email: string; monto: number; sorteoNombre: string; medioPago: string;
  }) {
    await this.enviar({
      to: data.email,
      subject: `Devolución de $${data.monto.toLocaleString('es-AR')} en proceso`,
      html: this.template(`
        <h2>Devolución iniciada</h2>
        <p>Iniciamos la devolución de <strong>$${data.monto.toLocaleString('es-AR')}</strong> correspondiente al sorteo <strong>${data.sorteoNombre}</strong>.</p>
        <div style="background:#eff6ff;border-radius:8px;padding:16px;margin:16px 0">
          <p><strong>Medio de pago:</strong> ${data.medioPago}</p>
          <p><strong>Plazo estimado:</strong> 3 a 15 días hábiles según tu banco</p>
        </div>
      `),
    });
  }

  // ─── COMERCIO ─────────────────────────────────────────────

  async comercioAprobado(data: { email: string; razonSocial: string; linkPanel: string }) {
    await this.enviar({
      to: data.email,
      subject: '✅ ¡Tu cuenta fue aprobada! Ya podés crear sorteos',
      html: this.template(`
        <h2>¡Bienvenido, ${data.razonSocial}!</h2>
        <p>Tu cuenta en Sorteos Verificados fue aprobada. Ya podés acceder al panel y crear tu primer sorteo.</p>
        <a href="${data.linkPanel}" style="display:inline-block;background:#3b82f6;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;margin-top:16px">Ir al panel →</a>
      `),
    });
  }

  async comercioRechazado(data: { email: string; razonSocial: string; motivo: string }) {
    await this.enviar({
      to: data.email,
      subject: 'Tu solicitud de cuenta requiere cambios',
      html: this.template(`
        <h2>Hola, ${data.razonSocial}</h2>
        <p>Revisamos tu solicitud y necesitamos que ajustes algunos datos:</p>
        <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px;margin:16px 0;border-radius:4px">
          <p>${data.motivo}</p>
        </div>
        <p>Podés volver a enviar tu solicitud con los datos correctos.</p>
      `),
    });
  }

  // ─── ADMIN ────────────────────────────────────────────────

  async nuevoComercioRegistrado(data: { adminEmail: string; razonSocial: string; cuit: string; linkAprobar: string }) {
    await this.enviar({
      to: data.adminEmail,
      subject: `Nuevo comercio pendiente: ${data.razonSocial}`,
      html: this.template(`
        <h2>Nuevo comercio pendiente de aprobación</h2>
        <table style="border-collapse:collapse;width:100%;margin:16px 0">
          <tr><td style="padding:8px;border:1px solid #eee;color:#666">Razón social</td><td style="padding:8px;border:1px solid #eee">${data.razonSocial}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;color:#666">CUIT</td><td style="padding:8px;border:1px solid #eee">${data.cuit}</td></tr>
        </table>
        <a href="${data.linkAprobar}" style="display:inline-block;background:#22c55e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Revisar y aprobar →</a>
      `),
    });
  }

  // ─── INTERNOS ─────────────────────────────────────────────

  async crearNotificacion(data: {
    usuarioId: string;
    tipo: string;
    titulo: string;
    mensaje: string;
    url?: string;
  }) {
    return this.db('notificaciones').insert({
      usuario_id: data.usuarioId,
      tipo: data.tipo,
      titulo: data.titulo,
      mensaje: data.mensaje,
      url: data.url || null,
    });
  }

  async obtenerNotificaciones(usuarioId: string) {
    return this.db('notificaciones')
      .where({ usuario_id: usuarioId })
      .orderBy('created_at', 'desc');
  }

  async marcarLeida(usuarioId: string, notificacionId: string) {
    await this.db('notificaciones')
      .where({
        id: notificacionId,
        usuario_id: usuarioId,
      })
      .update({
        leida: true,
        leida_at: new Date(),
      });

    return { ok: true };
  }

  async marcarTodasLeidas(usuarioId: string) {
    await this.db('notificaciones')
      .where({
        usuario_id: usuarioId,
        leida: false,
      })
      .update({
        leida: true,
        leida_at: new Date(),
      });

    return { ok: true };
  }

    private async enviar(data: EmailData) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM', 'noreply@sorteos.com');

    if (!apiKey) {
      // En desarrollo loguear en lugar de enviar
      this.logger.debug(`[EMAIL SIMULADO]\nPara: ${data.to}\nAsunto: ${data.subject}`);
      return;
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: data.to, subject: data.subject, html: data.html }),
      });

      if (!res.ok) {
        const err = await res.text();
        this.logger.error(`Error enviando email a ${data.to}: ${err}`);
        // NO lanzar error — un email fallido no debe romper el flujo
      }
    } catch (err) {
      this.logger.error(`Excepcion enviando email a ${data.to}:`, err);
    }
  }

  private template(content: string): string {
    return `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif">
        <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
          <div style="background:#1e293b;padding:20px 28px;display:flex;align-items:center;gap:10px">
            <span style="color:#3b82f6;font-size:20px">🎯</span>
            <span style="color:#fff;font-weight:700;font-size:16px">Sorteos Verificados</span>
          </div>
          <div style="padding:32px 28px">${content}</div>
          <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center">
            <p style="margin:0;color:#94a3b8;font-size:12px">© 2025 Sorteos Verificados · <a href="#" style="color:#94a3b8">Desuscribirse</a></p>
          </div>
        </div>
      </body></html>
    `;
  }
}
