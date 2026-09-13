# SEO — Quick Wins (Fase 1 del programa)
**Violet Bridge Security · Repositorio del sitio web**

> **Guarda este archivo como `/SEO-QUICKWINS.md` en la raíz del repo.**
> Añade a tu `CLAUDE.md` la línea: `Para trabajo de SEO, seguir /SEO-QUICKWINS.md`.
> Este documento es la fuente de verdad del trabajo de SEO y se actualiza a medida que avanzamos.

---

## 0. Cómo trabajamos

Este documento está dividido en **fases numeradas**. Se ejecutan en orden.

**Protocolo por fase:**
1. Yo digo "ejecuta la Fase N".
2. Lees la fase completa antes de tocar nada.
3. Creas la rama indicada, haces los cambios, me muestras el diff.
4. Actualizas el tablero de progreso (§5) marcando la fase.
5. **Te detienes.** No avanzas a la siguiente fase sin que yo lo pida.

Si algo en la fase no coincide con lo que encuentras en el repo, **pregunta antes de improvisar**. Este documento se escribió desde fuera, inspeccionando el sitio en producción, no el código.

---

## 1. Contexto del negocio

Violet Bridge Security LLC es una consultora boutique de ciberseguridad. Servicios principales: penetration testing, external attack surface management, SASE/Zero Trust, threat intelligence, vCISO.

- **Mercado objetivo: Estados Unidos.** El sitio es en inglés y solo en inglés.
- **Dominio canónico: `https://violetbridgesecurity.com`** — apex, sin www.
- Hosting: Netlify. Correo: Microsoft 365.
- La empresa se fundó en 2025; el dominio es joven y tiene poca autoridad acumulada.

**El problema de fondo:** el sitio es una sola página con navegación por anclas (`#services`, `#about`, `#contact`). Google indexa URLs, no posiciones de scroll. Una consulta `site:violetbridgesecurity.com` devuelve la home y un PDF — eso es todo el footprint indexable que existe hoy.

Las fases de este documento **no resuelven ese problema**; son la capa de cimientos. La reconstrucción en URLs reales es la Fase 2 del programa y se documentará aparte. Lo que conseguimos aquí es que cuando esas URLs existan, se indexen rápido, con señales limpias y sin deuda técnica arrastrada.

---

## 2. Convenciones no negociables

Estas reglas aplican a todo el trabajo futuro en el repo, no solo a las fases de abajo.

**Host canónico:** apex sin www. Todo `canonical`, `og:url`, URL en sitemap y URL en JSON-LD usa `https://violetbridgesecurity.com` exactamente. Verificado: `www` ya devuelve 301 hacia el apex en un solo salto.

**Trailing slash: SIN slash final.** Netlify tiene Pretty URLs activo y redirige `/ruta/` → `/ruta` con 301. Verificado en producción. No pelear contra esto. Las URLs futuras serán `/services/penetration-testing`, no `/services/penetration-testing/`. Única excepción: la raíz `https://violetbridgesecurity.com/` sí lleva slash.

**URLs absolutas siempre.** En metadatos, structured data, sitemap y llms.txt. Nunca rutas relativas tipo `./assets/...`.

**Idioma:** inglés. No traducir, no añadir `/es/`, no añadir `hreflang`.

**Un canonical = la URL final resuelta, byte por byte.** Mismo protocolo, mismo host, misma forma de slash.

---

## 3. Reglas de trabajo

**No tocar DNS.** Ninguna tarea de este repo lo requiere. El dominio raíz tiene registros MX de Microsoft 365, SPF con `-all`, DMARC en `p=quarantine`, y subdominios con registros de Azure Communication Services para las campañas de outreach. Un cambio de zona rompe el correo corporativo y las campañas el mismo día.

**No inventar copy.** Títulos, descripciones y textos vienen especificados literalmente en cada fase. Si falta algo, pregunta.

**No cambiar diseño ni CSS** salvo que la fase lo pida explícitamente.

**Leer el archivo completo antes de modificarlo.**

**Un cambio lógico = un commit.** Mensajes en imperativo y descriptivos.

**Una fase = una rama = un PR.** Netlify genera un deploy preview por PR; se verifica ahí antes de mergear.

> Nota sobre previews: el `canonical` apuntará a producción incluso en el preview. Es correcto, no lo "corrijas". Netlify además marca los previews como `noindex` por defecto.

---

## 4. Estado actual verificado

Comprobado en producción el 13 de septiembre de 2026.

**Ya está bien — no tocar:**

| Comprobación | Resultado |
|---|---|
| `https://www` → apex | 301, un solo salto |
| `https://apex` | 200, sin redirect |
| `http://apex` → `https://apex` | 301, un salto |
| HSTS | Presente (`max-age=31536000`) |
| Trailing slash | `/ruta/` → `/ruta` con 301, consistente |
| Primary domain en Netlify | Correctamente configurado en el apex |

**Defectos a corregir:**

| # | Defecto | Evidencia | Fase |
|---|---|---|---|
| D1 | `canonical` y `og:url` apuntan a www mientras el sitio resuelve en apex | `<link rel="canonical" href="https://www.violetbridgesecurity.com/">` | 1 |
| D2 | Imágenes OG/Twitter con ruta relativa | `og:image` = `./assets/og-cover.png` | 1 |
| D3 | Title de 101 caracteres, se trunca en SERP | `Violet Bridge Security \| Cybersecurity Consulting Firm — Penetration Testing, SASE, Managed Security` | 1 |
| D4 | Meta description encabeza con geografía equivocada | `...Offices in Panama City and Wyoming.` — el mercado es EE.UU. | 1 |
| D5 | `meta keywords` presente | Google la ignora desde 2009 | 1 |
| D6 | Sin `robots.txt` ni `sitemap.xml` verificables | No se pudieron resolver desde fuera | 2 |
| D7 | Sin structured data | Ningún `application/ld+json` detectado | 3 |
| D8 | Sin headers de seguridad más allá de HSTS | Falta nosniff, Referrer-Policy, Permissions-Policy, CSP | 5 |
| D9 | PDF de `/reports/` compite con las páginas HTML futuras | El PDF es uno de los dos únicos activos indexados | 5 |

---

## 5. Tablero de progreso

Actualiza esta tabla al terminar cada fase.

| Fase | Descripción | Rama | Estado |
|---|---|---|---|
| 0 | Reconocimiento del repo | — | ⬜ Pendiente |
| 1 | Metadatos del `<head>` | `seo/f1-head-metadata` | ⬜ Pendiente |
| 2 | robots.txt + sitemap.xml | `seo/f2-crawl-infra` | ⬜ Pendiente |
| 3 | Organization JSON-LD | `seo/f3-organization-schema` | ⬜ Pendiente |
| 4 | llms.txt | `seo/f4-llms-txt` | ⬜ Pendiente |
| 5 | Headers HTTP | `seo/f5-http-headers` | ⬜ Pendiente |
| 6 | Verificación final | — | ⬜ Pendiente |

---

## FASE 0 — Reconocimiento

**No modifiques nada en esta fase.** Solo explora y reporta.

Necesito un informe con:

1. ¿HTML escrito a mano, o hay generador estático / framework? ¿Cuál y qué versión?
2. ¿Existe `netlify.toml`? Muestra su contenido.
3. ¿Existen `_headers` o `_redirects`? Muestra su contenido.
4. ¿Existen `robots.txt` y `sitemap.xml`? ¿Estáticos o generados en build?
5. ¿Cuántos archivos HTML hay y en qué rutas? Lístalos todos.
6. Muestra el `<head>` completo del index principal.
7. ¿Hay algún `application/ld+json` ya presente?
8. ¿Hay `.pdf` en el repo? ¿En qué carpeta?
9. ¿Comando de build y directorio de publicación?
10. ¿Hay plantillas o parciales compartidos, o el `<head>` está duplicado en cada archivo HTML?

**Por qué importa:** las respuestas a 1, 9 y 10 determinan cómo se ejecutan las fases siguientes. Si el `<head>` está duplicado en cinco archivos, cada corrección hay que aplicarla cinco veces y conviene extraer un parcial primero — dímelo si es el caso.

**Criterio de aceptación:** informe entregado, sin cambios en el repo.

---

## FASE 1 — Metadatos del `<head>`

**Rama:** `seo/f1-head-metadata`
**Corrige:** D1, D2, D3, D4, D5

### 1.1 Canonical y og:url

Actualmente apuntan a `https://www.violetbridgesecurity.com/`. Cámbialos a:

```html
<link rel="canonical" href="https://violetbridgesecurity.com/">
<meta property="og:url" content="https://violetbridgesecurity.com/">
```

### 1.2 Imágenes OG y Twitter

Rutas relativas rompen las previsualizaciones en LinkedIn, X, Slack e iMessage. Como LinkedIn es el canal principal de distribución de la empresa, esto está costando engagement de forma silenciosa. Cámbialas a absolutas:

```html
<meta property="og:image" content="https://violetbridgesecurity.com/assets/og-cover.png">
<meta name="twitter:image" content="https://violetbridgesecurity.com/assets/og-cover.png">
```

⚠️ `og:image` usa el atributo `property`. `twitter:image` usa `name`. No los intercambies.

### 1.3 Title

Reemplaza exactamente por (61 caracteres):

```html
<title>Cybersecurity Consulting &amp; Penetration Testing | Violet Bridge</title>
```

### 1.4 Meta description

Reemplaza exactamente por (151 caracteres):

```html
<meta name="description" content="Boutique cybersecurity consultancy for US mid-market. Penetration testing, external attack surface management, SASE and Zero Trust. Book a consultation.">
```

### 1.5 Limpieza

- Elimina la etiqueta `<meta name="keywords" ...>` completa.
- Alinea `og:title` y `twitter:title` con el title nuevo si difieren.
- Alinea `og:description` y `twitter:description` con la description nueva si difieren.

### 1.6 Si el `<head>` está duplicado

Aplica los cambios en todos los archivos y dímelo en el reporte. Si hay parcial compartido, edita solo ese.

### Verificación

```bash
curl -s https://violetbridgesecurity.com/ | grep -iE 'canonical|og:url|og:image|twitter:image|<title'
curl -s https://violetbridgesecurity.com/ | grep -i 'name="keywords"'
```

Los primeros deben mostrar el apex con rutas absolutas. El segundo no debe devolver nada.

**Criterio de aceptación:** canonical y og:url en apex; og:image y twitter:image absolutas; title ≤ 62 caracteres; keywords eliminada.

**Tarea manual mía tras el merge:** pegar la URL en LinkedIn Post Inspector y forzar re-scrape.

---

## FASE 2 — robots.txt y sitemap.xml

**Rama:** `seo/f2-crawl-infra`
**Corrige:** D6

### 2.1 robots.txt

En la raíz del directorio de publicación:

```
User-agent: *
Allow: /

Sitemap: https://violetbridgesecurity.com/sitemap.xml
```

No añadas reglas `Disallow` salvo que encuentres rutas que claramente no deban rastrearse (paneles internos, endpoints). Si encuentras alguna, pregunta antes.

### 2.2 sitemap.xml

El enfoque depende de lo que hallaste en la Fase 0:

- **Si hay generador estático con plugin de sitemap:** instálalo y configúralo. Preferible — se mantiene solo cuando lleguen las 12 URLs de la Fase 2 del programa.
- **Si es HTML a mano:** genera el `sitemap.xml` estático con las URLs que existen hoy.

Requisitos:
- Solo URLs canónicas que devuelvan 200. Nada de redirects ni 404.
- Absolutas, con apex, sin www, **sin trailing slash** (excepto la raíz).
- `<lastmod>` con fecha real de modificación.
- **No incluyas los PDF de `/reports/`.**
- Omite `<priority>` y `<changefreq>` — Google los ignora.

Confirma que ambos archivos acaban en el directorio de publicación tras el build, no solo en el source.

### Verificación

```bash
curl -sI https://violetbridgesecurity.com/robots.txt  | head -3
curl -sI https://violetbridgesecurity.com/sitemap.xml | head -3
curl -s  https://violetbridgesecurity.com/sitemap.xml
```

Ambos 200. Revisa que ninguna URL del sitemap tenga www ni trailing slash.

**Criterio de aceptación:** ambos archivos servidos con 200; sitemap con URLs canónicas válidas únicamente.

**Tarea manual mía tras el merge:** enviar sitemap en Google Search Console **y en Bing Webmaster Tools**.

---

## FASE 3 — Organization JSON-LD

**Rama:** `seo/f3-organization-schema`
**Corrige:** D7

Añade este bloque en el `<head>` de todas las páginas, dentro de `<script type="application/ld+json">`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://violetbridgesecurity.com/#organization",
  "name": "Violet Bridge Security LLC",
  "alternateName": "Violet Bridge Security",
  "url": "https://violetbridgesecurity.com/",
  "logo": "https://violetbridgesecurity.com/assets/logo-dark.png",
  "description": "Boutique cybersecurity consultancy providing penetration testing, external attack surface management, SASE and Zero Trust implementation, threat intelligence and vCISO advisory to organizations in the United States.",
  "foundingDate": "2025",
  "email": "sales@violetbridgesecurity.com",
  "telephone": "+1-307-340-9155",
  "areaServed": { "@type": "Country", "name": "United States" },
  "knowsAbout": [
    "Penetration Testing",
    "External Attack Surface Management",
    "Secure Access Service Edge",
    "Zero Trust Network Access",
    "Threat Intelligence",
    "Security Awareness Training"
  ],
  "sameAs": [
    "https://www.linkedin.com/company/violet-bridge-security",
    "https://x.com/VioletBridgeSec",
    "https://www.instagram.com/violetbr.security/"
  ]
}
```

⚠️ **Es `Organization`, no `LocalBusiness`, y deliberadamente no lleva `address`.** No lo añadas aunque parezca incompleto — hay una razón de negocio detrás de esa omisión.

No añadas campos que no estén arriba. Si crees que falta algo, dímelo en vez de añadirlo.

### Verificación

Pegar la URL en `https://search.google.com/test/rich-results`. Cero errores.

**Criterio de aceptación:** JSON-LD presente y válido, sin errores en Rich Results Test.

---

## FASE 4 — llms.txt

**Rama:** `seo/f4-llms-txt`

Crea `llms.txt` en la raíz del directorio de publicación:

```
# Violet Bridge Security

> Boutique cybersecurity consultancy serving US mid-market and regulated
> organizations. Penetration testing, external attack surface management,
> SASE and Zero Trust implementation, threat intelligence, vCISO advisory.

## About
Founded 2025. Wyoming LLC. Principal consultant holds CISSP.
Contact: sales@violetbridgesecurity.com

## Site
- [Home](https://violetbridgesecurity.com/)
```

Debe servirse como `text/plain` y devolver 200. La sección `## Site` se ampliará cuando existan las páginas de servicio.

**Nota honesta:** la adopción de `llms.txt` es desigual y el beneficio no está demostrado. Se incluye porque cuesta media hora, no porque haya evidencia de que funcione.

**Criterio de aceptación:** archivo servido con 200 y content-type correcto.

---

## FASE 5 — Headers HTTP

**Rama:** `seo/f5-http-headers`
**Corrige:** D8, D9

Va última porque la CSP necesita observación antes de activarse y no quiero que bloquee el resto del trabajo.

Si ya existe `_headers` o una sección `[[headers]]` en `netlify.toml`, edítalo en lugar de crear uno nuevo.

### 5.1 Headers de seguridad

Somos una consultora de ciberseguridad; los prospectos pasan nuestro dominio por securityheaders.com. Objetivo: A+. Vale más como activo comercial que como señal SEO.

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=()
  X-Frame-Options: DENY
```

⚠️ **Sobre HSTS:** ya existe un `Strict-Transport-Security: max-age=31536000` en producción. **No le añadas `includeSubDomains` ni `preload` sin consultarme.** Hay subdominios activos (`go.`, `mail.`, `sns.`, `cti-sns.`) que sirven infraestructura de outreach y del pipeline; si alguno no tiene HTTPS válido, `includeSubDomains` lo deja inaccesible en navegadores. Y `preload` es prácticamente irreversible una vez enviado a la lista de Chrome. Si quieres proponerlo, propónmelo — no lo apliques.

### 5.2 CSP en report-only primero

**No despliegues una CSP bloqueante de entrada.** El banner de cookies, los scripts de analítica y el video del hero pueden romperse.

Procedimiento:
1. Inventaría todos los orígenes externos que usa el sitio: scripts, fuentes, imágenes, iframes, XHR, media. Lístamelos.
2. Construye una `Content-Security-Policy-Report-Only` basada en ese inventario.
3. Despliega **solo en report-only** y avísame. Revisaré la consola del navegador unos días antes de pasarla a bloqueante.

### 5.3 Canonical HTTP en los PDF

Los PDF de `/reports/` están indexados y van a competir con las páginas HTML que construiremos. Añade:

```
/reports/*
  Link: <https://violetbridgesecurity.com/>; rel="canonical"
```

⚠️ **No añadas `noindex` a los PDF todavía.** Hoy el PDF es uno de los dos únicos activos indexados que tenemos; desindexarlo antes de que exista la página HTML equivalente nos deja con menos, no con más. Deja un comentario en el archivo indicando que el `noindex` se añade cuando existan las páginas de servicio.

### Verificación

```bash
curl -sI https://violetbridgesecurity.com/ | grep -iE 'x-content-type|referrer-policy|permissions-policy|x-frame|content-security'
curl -sI "https://violetbridgesecurity.com/reports/Violet%20Bridge%20Security%20-%20Service%20Portfolio%202025.pdf" | grep -i link
```

**Criterio de aceptación:** headers presentes; CSP en report-only únicamente; canonical HTTP en PDFs; HSTS sin modificar.

---

## FASE 6 — Verificación final

Ejecuta todo el bloque y repórtame los resultados:

```bash
echo "=== Host canonicalization ==="
curl -sI https://www.violetbridgesecurity.com/ | grep -iE 'HTTP|location'
curl -sI https://violetbridgesecurity.com/     | grep -iE 'HTTP|location'

echo "=== Metadatos ==="
curl -s https://violetbridgesecurity.com/ | grep -iE 'canonical|og:url|og:image|twitter:image|<title'
curl -s https://violetbridgesecurity.com/ | grep -i 'name="keywords"'

echo "=== Crawl infra ==="
curl -sI https://violetbridgesecurity.com/robots.txt  | head -3
curl -sI https://violetbridgesecurity.com/sitemap.xml | head -3
curl -sI https://violetbridgesecurity.com/llms.txt    | head -3

echo "=== Structured data ==="
curl -s https://violetbridgesecurity.com/ | grep -c 'application/ld+json'

echo "=== Headers ==="
curl -sI https://violetbridgesecurity.com/ | grep -iE 'strict-transport|x-content-type|referrer-policy|permissions-policy|x-frame'
```

**Esperado:** www → 301 al apex; apex → 200 sin location; canonical/og en apex y absolutos; keywords sin resultados; robots/sitemap/llms en 200; al menos un bloque JSON-LD; headers presentes.

---

## 6. Fuera del alcance de este repo

Estas tareas son mías y corren en paralelo. Están aquí para que tengas el contexto completo, no para que las ejecutes.

| Tarea | Dónde | Notas |
|---|---|---|
| Crear propiedades en Google Search Console (apex, www y tipo Dominio) y en Bing Webmaster Tools | Consolas web | Bing no es opcional: su índice alimenta la búsqueda de ChatGPT |
| Enviar sitemap en ambos motores | Consolas web | Depende de la Fase 2 |
| Solicitar listado en directorios de 8 partners | Correo | Palo Alto, Cato, Netskope, Arsen, BeyondID, Telarus, Secure Ideas, Sandler Partners |
| `noindex` en `go.violetbridgesecurity.com` | nginx en la VM del pipeline | **No está en Netlify.** El `_headers` de este repo no lo alcanza |
| Captura de baseline: crawl con Screaming Frog, datos de campo de PageSpeed, conteo de dominios de referencia | Herramientas externas | Guardar exports con fecha |
| LinkedIn Post Inspector tras la Fase 1 | Web | Fuerza el re-scrape de la tarjeta |

---

## 7. Qué viene después

Para que las convenciones de §2 tengan sentido: la Fase 2 del programa es romper el sitio de una página en URLs reales. Doce páginas iniciales, con esta forma:

```
/services
/services/penetration-testing
/services/attack-surface-management
/services/sase-zero-trust
/services/virtual-ciso
/services/threat-intelligence
/services/security-awareness-training
/about
/about/team
/contact
/insights
/penetration-testing-cost
```

Sin trailing slash, canonical absoluto en apex, cada una con `Service` y `FAQPage` schema propios. Se documentará en un archivo aparte cuando lleguemos.

Todo lo que hacemos en las fases de arriba está pensado para que esas doce URLs nazcan limpias.
