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

Confirmado en la Fase 0 de `/SEO-QUICKWINS.md` (13/09/2026).

- **Stack:** HTML escrito a mano. Sin generador estático, sin framework, sin `package.json`, sin CI. CSS embebido en un `<style>` dentro de cada archivo; JS embebido al final del `<body>`.
- **Comando de build:** ninguno. No hay nada que ejecutar.
- **Directorio de publicación:** la raíz del repo. Source y publish son el mismo sitio, así que cualquier archivo que deba servirse (`robots.txt`, `sitemap.xml`, `llms.txt`, `_headers`) va en la raíz.
- **Plantillas/parciales compartidos:** no hay. Ni parciales, ni includes SSI, ni templating. El `<head>` está **duplicado literalmente** en los cuatro HTML de la raíz (`index.html`, `legal.html`, `questionnaire.html`, `service-request.html`); `reports/netskope_report.html` tiene un `<head>` mínimo aparte. Cada corrección de cabecera hay que aplicarla archivo por archivo.
- **Configuración de Netlify:** vive íntegramente en la UI. No hay `netlify.toml`, `_headers` ni `_redirects` en el repo. El HSTS, los Pretty URLs y el primary domain se configuran allí, no aquí.

**Decisión sobre extraer parciales: no se hace.** Introducir un build system es una decisión de arquitectura fuera del alcance de los quick wins, y la duplicación de cabeceras de seguridad desaparece sola al migrarlas a `_headers`. Se reevalúa al empezar la Fase 2 del programa.

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
