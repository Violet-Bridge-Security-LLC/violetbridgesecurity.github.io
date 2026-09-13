# CLAUDE.md

Contexto persistente para Claude Code en el repositorio del sitio web de Violet Bridge Security.

---

## Proyecto

Sitio corporativo de **Violet Bridge Security LLC**, consultora boutique de ciberseguridad.

Servicios: penetration testing, external attack surface management, SASE/Zero Trust, threat intelligence, security awareness training, vCISO.

- **Mercado objetivo:** Estados Unidos
- **Idioma del sitio:** inglés únicamente
- **Dominio canónico:** `https://violetbridgesecurity.com` (apex, sin www)
- **Hosting:** Netlify
- **Correo corporativo:** Microsoft 365

---

## Stack y build

> ⚠️ **Pendiente de completar tras la Fase 0 de `/SEO-QUICKWINS.md`.**
> Cuando termines el reconocimiento, actualiza esta sección con los datos reales
> y elimina este aviso.

- **Stack:** _(por determinar)_
- **Comando de build:** _(por determinar)_
- **Directorio de publicación:** _(por determinar)_
- **Plantillas/parciales compartidos:** _(por determinar — importa para saber si el `<head>` se edita en un sitio o en varios)_

---

## Convenciones no negociables

Aplican a todo el trabajo en este repo.

**Host canónico: apex sin www.** Todo `canonical`, `og:url`, URL de sitemap y URL en JSON-LD usa `https://violetbridgesecurity.com` exactamente. Verificado en producción: `www` devuelve 301 hacia el apex en un solo salto.

**Trailing slash: SIN slash final.** Netlify tiene Pretty URLs activo y redirige `/ruta/` → `/ruta` con 301. Verificado en producción. No pelear contra esto. Las URLs son `/services/penetration-testing`, no `/services/penetration-testing/`. Única excepción: la raíz `https://violetbridgesecurity.com/` sí lleva slash.

**URLs absolutas siempre** en metadatos, structured data, sitemap y llms.txt. Nunca rutas relativas tipo `./assets/...` — rompen Open Graph.

**El canonical debe coincidir byte por byte con la URL final resuelta.** Mismo protocolo, mismo host, misma forma de slash.

**Idioma inglés.** No traducir contenido, no añadir `/es/`, no añadir `hreflang`.

---

## Prohibiciones

**No tocar DNS.** Ninguna tarea de este repo lo requiere. El dominio raíz tiene registros MX de Microsoft 365, SPF con `-all`, DMARC en `p=quarantine`, y subdominios con registros de Azure Communication Services que sirven campañas de outreach activas. Un cambio de zona rompe el correo corporativo y las campañas el mismo día.

Si Netlify ofrece migrar a Netlify DNS, **no aceptar**. Avisar y esperar instrucciones.

**No modificar el HSTS existente** sin consultar. Ya hay un `Strict-Transport-Security: max-age=31536000` en producción. Añadirle `includeSubDomains` puede dejar inaccesibles los subdominios `go.`, `mail.`, `sns.` y `cti-sns.` si alguno no sirve HTTPS válido. El directive `preload` es prácticamente irreversible.

**No inventar copy de marketing.** Títulos, descripciones y textos de página vienen especificados en los documentos de trabajo. Si falta algo, preguntar.

**No cambiar diseño ni CSS** salvo que la tarea lo pida explícitamente.

---

## Reglas de trabajo

- Leer el archivo completo antes de modificarlo.
- Un cambio lógico = un commit. Mensajes en imperativo, descriptivos.
- Una fase o tarea = una rama = un PR. Netlify genera deploy preview por PR.
- Al terminar una fase: mostrar diff, actualizar el tablero de progreso del documento de trabajo, y **detenerse**. No avanzar sin confirmación.
- Si algo en las instrucciones no coincide con lo que hay en el repo, **preguntar antes de improvisar**. Los documentos de trabajo se escribieron inspeccionando el sitio en producción, no el código.

**Sobre deploy previews:** el `canonical` apuntará a producción incluso en el preview. Es correcto, no "corregirlo". Netlify marca los previews como `noindex` por defecto.

---

## Trabajo activo

**SEO — Fase 1 (quick wins):** seguir `/SEO-QUICKWINS.md`. Ese documento contiene el estado verificado del sitio, las fases numeradas, los criterios de aceptación y el tablero de progreso.

---

## Verificación rápida

```bash
# Host y redirects
curl -sI https://www.violetbridgesecurity.com/ | grep -iE 'HTTP|location'
curl -sI https://violetbridgesecurity.com/     | grep -iE 'HTTP|location'

# Metadatos
curl -s https://violetbridgesecurity.com/ | grep -iE 'canonical|og:url|og:image|<title'

# Infraestructura de rastreo
curl -sI https://violetbridgesecurity.com/robots.txt  | head -3
curl -sI https://violetbridgesecurity.com/sitemap.xml | head -3
```
