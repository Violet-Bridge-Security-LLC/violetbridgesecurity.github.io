# SEO — Quick Wins (Fase 1 del programa)
**Violet Bridge Security · Repositorio del sitio web**
**Versión 2 — revisada tras el informe de Fase 0 del 13/09/2026**

> **Este archivo reemplaza la versión anterior de `/SEO-QUICKWINS.md`.**
> La v1 se escribió inspeccionando el sitio en producción sin acceso al código y
> contenía tres defectos incorrectos (D6, D7, y D8 parcialmente). Esta versión
> parte del estado real del repositorio.

---

## 0. Cómo trabajamos

Fases numeradas, en orden.

**Protocolo por fase:**
1. Mike dice "ejecuta la Fase N".
2. Leer la fase completa antes de tocar nada.
3. Crear la rama indicada, hacer los cambios, mostrar el diff.
4. Actualizar el tablero de progreso (§7).
5. **Detenerse.** No avanzar sin confirmación.

Si algo no coincide con el repo, **preguntar antes de improvisar**. La Fase 0 ya demostró que vale la pena.

---

## 1. Contexto del negocio

Violet Bridge Security LLC, consultora boutique de ciberseguridad. Servicios: penetration testing, external attack surface management, SASE/Zero Trust, threat intelligence, security awareness training, vCISO.

- **Mercado objetivo: Estados Unidos.** Sitio en inglés, solo inglés.
- **Dominio canónico:** `https://violetbridgesecurity.com` — apex, sin www.
- Hosting: Netlify (toda la configuración vive en la UI; no hay `netlify.toml`). Correo: Microsoft 365.
- Empresa fundada en 2025 — ⚠️ ver **B2**. Dominio joven, poca autoridad acumulada.

**El problema de fondo:** el sitio es una sola página con navegación por anclas. De los 5 archivos HTML, **solo `index.html` es indexable** — `legal.html`, `service-request.html` y `questionnaire.html` llevan `noindex`. `reports/netskope_report.html` no lleva nada, y eso es un defecto (Fase 1.0).

Estas fases **no resuelven ese problema**; son la capa de cimientos para que las 12 URLs de la Fase 2 del programa nazcan limpias.

---

## 2. Arquitectura real del repo

Confirmado en Fase 0:

- **HTML escrito a mano.** Sin generador, sin `package.json`, sin build, sin CI.
- **Sin `netlify.toml`, sin `_headers`, sin `_redirects`.**
- **Directorio de publicación = raíz del repo.** Source y publish son el mismo sitio.
- **Sin parciales ni templating.** El `<head>` está duplicado en los 4 HTML de la raíz.
- CSS embebido en `<style>` dentro de cada HTML. JS embebido al final del `<body>`.

**Decisión sobre parciales: NO extraer.** Introducir un build system es una decisión de arquitectura que no pertenece a una fase de quick wins, y la Fase 2 del programa probablemente traiga su propio generador. Además, la duplicación real desaparece sola en la Fase 5, cuando los headers se mueven de `<meta>` a `_headers`.

**Orígenes externos en uso** (inventario levantado en Fase 0):
`fonts.googleapis.com` · `fonts.gstatic.com` · `www.googletagmanager.com` · `www.google-analytics.com` · `*.elfsight.com` + `*.elfsightcdn.com` (widget) · `formspree.io` (formularios `mkgqqeqo` y `xyznznrd`) · `raw.githubusercontent.com` (una imagen en el report de Netskope) · `assets/hero-video.mp4` (local).

---

## 3. Convenciones no negociables

**Host canónico: apex sin www.** Verificado: `www` → 301 al apex, un salto.

**Trailing slash: SIN slash final.** Netlify tiene Pretty URLs activo. Verificado: `/ruta/` → `/ruta` con 301.

**Extensión `.html`: ver B1.** Pretty URLs probablemente sirve `/legal` y redirige `/legal.html`. Hay que verificarlo antes de escribir canonicals.

**URLs absolutas siempre** en metadatos, structured data, sitemap y llms.txt.

**El canonical coincide byte por byte con la URL final resuelta.**

**Idioma inglés.** No traducir, no `/es/`, no `hreflang`.

---

## 4. Prohibiciones

**No tocar DNS.** MX de Microsoft 365, SPF `-all`, DMARC `p=quarantine`, y subdominios con registros de Azure Communication Services que sirven campañas activas. Si Netlify ofrece migrar a Netlify DNS: **no aceptar**, avisar.

**No modificar el HSTS** sin consultar. El `Strict-Transport-Security: max-age=31536000` vive en la UI de Netlify, no en el repo. Añadirle `includeSubDomains` puede dejar inaccesibles `go.`, `mail.`, `sns.` y `cti-sns.`. El `preload` es prácticamente irreversible.

**El script ofuscado de `index.html` (~línea 40) es un canary token deliberado.** No tocarlo, **no corregir el comentario `<!-- Async font loader -->`** y **no documentarlo en el repo** — el camuflaje es parte de su función. Consecuencia operativa: el `img-src 'self' data: https:` amplio es lo que permite su beacon. Cualquier endurecimiento de `img-src` lo rompe en silencio. Ver Fase 5.

**No inventar copy.** Los textos vienen literales en cada fase.

**No cambiar diseño ni CSS** salvo que la fase lo pida.

---

## 5. Preguntas bloqueantes

Resolver antes de las fases indicadas.

| # | Pregunta | Bloquea | Responsable |
|---|---|---|---|
| **B1** | ¿Pretty URLs sirve `/legal` o `/legal.html` como canónica? Verificar con curl (comandos en Fase 1.1). | Fase 1, Fase 2 | Claude Code |
| **B2** | `foundingDate`: el JSON-LD dice 2024, la documentación de negocio dice 2025. ¿Cuál es correcta? | Fase 3, Fase 4 | Mike |
| **B3** | Email público: el JSON-LD dice `info@`, el Service Portfolio PDF dice `sales@`. Elegir uno y usarlo de forma consistente en JSON-LD, llms.txt, sitio y perfiles externos. La consistencia de entidad importa para el reconocimiento por Google y por los LLM. | Fase 3, Fase 4 | Mike |
| **B4** | Logo para el JSON-LD: ¿`logo-icon.png` o `logo-dark.png`? "dark" probablemente significa *para fondo oscuro*, es decir un logo claro — que sería invisible si Google lo renderiza sobre blanco. Claude Code: revisar ambos, reportar dimensiones y sobre qué fondo funcionan. | Fase 3 | Ambos |
| **B5** | `reports/netskope_report.html` y `reports/Netskope SASE - Tenant Health Check Report.pdf`: ¿contienen datos identificables de un cliente real? | Fase 1.0 | Mike — **urgente** |
| **B6** | Confirmar en Netlify → Site configuration → Build & deploy: build command vacío, publish directory `.` o vacío. | Fase 2 | Mike |

---

## 6. Estado actual verificado

### Ya está bien — no tocar

| Comprobación | Resultado |
|---|---|
| `https://www` → apex | 301, un salto |
| `https://apex` | 200, sin redirect |
| `http://apex` → `https://apex` | 301, un salto |
| HSTS | Presente (`max-age=31536000`), en UI de Netlify |
| Trailing slash | `/ruta/` → `/ruta`, 301, consistente |
| Primary domain en Netlify | Correcto, en el apex |
| CSP | Presente y funcional (en `<meta>`) |
| `noindex` en legal, service-request, questionnaire | Correcto |

### Defectos a corregir

| # | Defecto | Fase |
|---|---|---|
| D1 | `canonical` y `og:url` en www, en `index.html`, `legal.html` y `service-request.html` | 1 |
| D2 | Imágenes OG/Twitter con ruta relativa (`./assets/og-cover.png`) | 1 |
| D3 | Title de 100 caracteres, se trunca en SERP | 1 |
| D4 | Meta description de 248 caracteres, encabeza con "Offices in Panama City and Wyoming" | 1 |
| D5 | `meta keywords` presente | 1 |
| D6 | `reports/netskope_report.html` indexable: sin `noindex`, sin `canonical`, fuera del sitemap | **1.0** |
| D7 | `robots.txt` apunta al sitemap en www | 2 |
| D8 | `sitemap.xml`: URLs con www, incluye `legal.html` que es `noindex`, trae `changefreq` y `priority`, `lastmod` desactualizado | 2 |
| D9 | JSON-LD: `Organization` con datos erróneos y `address` de Panamá + Wyoming; `ProfessionalService` (subtipo de `LocalBusiness`) con la misma `address`; `WebSite` con `SearchAction` hacia un buscador inexistente | 3 |
| D10 | `llms.txt` existe pero desactualizado: www, servicios que no corresponden, `info@`, sin `## Site` | 4 |
| D11 | `X-Content-Type-Options` y `X-Frame-Options` en `<meta http-equiv>` — **los navegadores los ignoran ahí**. Están en el código y no protegen nada | 5 |
| D12 | CSP en `<meta>`: funcional, pero no puede usar `frame-ancestors`, `report-uri` ni `sandbox`, que solo existen en header | 5 |
| D13 | PDFs sin canonical HTTP. Son tres, en dos carpetas | 5 |

---

## 7. Tablero de progreso

| Fase | Descripción | Rama | Estado |
|---|---|---|---|
| 0 | Reconocimiento del repo | — | ✅ Completada 13/09/2026 |
| 1 | Metadatos del `<head>` + noindex urgente | `seo/f1-head-metadata` | ⬜ Pendiente |
| 2 | robots.txt + sitemap.xml (corregir) | `seo/f2-crawl-infra` | ⬜ Pendiente |
| 3 | JSON-LD (reemplazar) | `seo/f3-structured-data` | ⬜ Pendiente |
| 4 | llms.txt (reemplazar) | `seo/f4-llms-txt` | ⬜ Pendiente |
| 5 | Migración de headers a `_headers` | `seo/f5-http-headers` | ⬜ Pendiente |
| 6 | Verificación final | — | ⬜ Pendiente |

---

## FASE 1 — Metadatos del `<head>` + noindex urgente

**Rama:** `seo/f1-head-metadata`
**Corrige:** D1–D6

### 1.0 — Primero: `reports/netskope_report.html`

Este archivo es rastreable y no debería serlo. Añadir a su `<head>`:

```html
<meta name="robots" content="noindex, nofollow" />
<link rel="canonical" href="https://violetbridgesecurity.com/" />
```

Hacerlo en el primer commit de la fase, antes que nada. Si B5 confirma que contiene datos de cliente, Mike decidirá si además se elimina del repo — pero el `noindex` va igual y va ya.

### 1.1 — Verificar B1 antes de escribir canonicals

```bash
curl -sI https://violetbridgesecurity.com/legal.html           | grep -iE 'HTTP|location'
curl -sI https://violetbridgesecurity.com/legal                | grep -iE 'HTTP|location'
curl -sI https://violetbridgesecurity.com/service-request.html | grep -iE 'HTTP|location'
curl -sI https://violetbridgesecurity.com/service-request      | grep -iE 'HTTP|location'
```

La forma que devuelve **200 sin `location`** es la canónica. Los canonicals de `legal.html` y `service-request.html` deben usar esa forma. Reportar el resultado antes de continuar.

### 1.2 — Canonical y og:url al apex

En los tres archivos que los tienen: cambiar `https://www.violetbridgesecurity.com` por `https://violetbridgesecurity.com`, respetando la forma de URL determinada en 1.1.

Para `index.html`:
```html
<link rel="canonical" href="https://violetbridgesecurity.com/" />
<meta property="og:url" content="https://violetbridgesecurity.com/" />
```

### 1.3 — Imágenes OG y Twitter absolutas

Las rutas relativas rompen las previsualizaciones en LinkedIn, X, Slack e iMessage. Como LinkedIn es el canal principal de distribución, esto cuesta engagement de forma silenciosa.

```html
<meta property="og:image" content="https://violetbridgesecurity.com/assets/og-cover.png" />
<meta name="twitter:image" content="https://violetbridgesecurity.com/assets/og-cover.png" />
```

⚠️ `og:image` usa `property`. `twitter:image` usa `name`. No intercambiar.

### 1.4 — Title de `index.html`

Reemplazar exactamente (61 caracteres):

```html
<title>Cybersecurity Consulting &amp; Penetration Testing | Violet Bridge</title>
```

### 1.5 — Meta description de `index.html`

Reemplazar exactamente (151 caracteres):

```html
<meta name="description" content="Boutique cybersecurity consultancy for US mid-market. Penetration testing, external attack surface management, SASE and Zero Trust. Book a consultation." />
```

### 1.6 — Limpieza

- Eliminar `<meta name="keywords" ...>` de todos los archivos donde aparezca.
- Alinear `og:title`, `twitter:title`, `og:description` y `twitter:description` con el title y la description nuevos.
- Marcar la Fase 0 como completada en el tablero (§7).

### 1.7 — No tocar en esta fase

Los `<meta http-equiv>` de seguridad y la CSP se quedan como están. Se migran en la Fase 5, en un solo movimiento, para no dejar el sitio con doble política a medias.

### Verificación

```bash
curl -s https://violetbridgesecurity.com/ | grep -iE 'canonical|og:url|og:image|twitter:image|<title'
curl -s https://violetbridgesecurity.com/ | grep -i 'name="keywords"'
curl -s https://violetbridgesecurity.com/reports/netskope_report.html | grep -i 'robots'
```

**Criterio de aceptación:** canonical y og:url en apex con la forma correcta; og:image y twitter:image absolutas; title ≤ 62 caracteres; keywords eliminada; netskope_report con `noindex`.

**Tarea manual de Mike tras el merge:** LinkedIn Post Inspector, forzar re-scrape.

---

## FASE 2 — robots.txt y sitemap.xml

**Rama:** `seo/f2-crawl-infra`
**Corrige:** D7, D8

Ambos archivos **ya existen**. Esta fase los corrige, no los crea.

### 2.1 — robots.txt

Única corrección: el sitemap debe apuntar al apex.

```
User-agent: *
Allow: /

Sitemap: https://violetbridgesecurity.com/sitemap.xml
```

### 2.2 — sitemap.xml

Reescribir. El actual tiene cuatro problemas: URLs con www, incluye `legal.html` que lleva `noindex`, trae `changefreq` y `priority`, y el `lastmod` está desactualizado.

Un sitemap **no debe listar páginas con `noindex`** — es una señal contradictoria. De los 5 HTML, solo `index.html` es indexable. El sitemap correcto hoy tiene **una sola URL**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://violetbridgesecurity.com/</loc>
    <lastmod>FECHA_REAL</lastmod>
  </url>
</urlset>
```

Usar la fecha real de última modificación: `git log -1 --format=%cI index.html`.

Sí, un sitemap de una URL se ve pobre. Es un reflejo honesto del estado del sitio y precisamente el problema que la Fase 2 del programa resuelve. Un sitemap inflado con páginas `noindex` no mejora nada y sí confunde señales.

### Verificación

```bash
curl -s  https://violetbridgesecurity.com/robots.txt
curl -s  https://violetbridgesecurity.com/sitemap.xml
curl -sI https://violetbridgesecurity.com/sitemap.xml | head -3
```

Ninguna URL con `www`. Ningún `changefreq` ni `priority`. Solo `/`.

**Criterio de aceptación:** ambos en apex, sitemap con una única URL canónica.

**Tarea manual de Mike:** enviar el sitemap en Google Search Console **y en Bing Webmaster Tools**.

---

## FASE 3 — Structured data

**Rama:** `seo/f3-structured-data`
**Corrige:** D9 · **Bloqueada por:** B2, B3, B4

Hay **tres bloques JSON-LD** en `index.html` (líneas 36–38). Esta fase los **reemplaza**, no añade uno más.

### 3.1 — Eliminar `ProfessionalService`

Borrar el bloque completo. Razones:

- `ProfessionalService` es subtipo de `LocalBusiness` y declara sede física. La dirección de Wyoming es un edificio de agente registrado compartido por miles de LLC, no una oficina. Afirmar un negocio local ahí es exponerse sin ganar nada a cambio.
- Ancla la entidad a Panama City de cara a un mercado objetivo que es Estados Unidos.
- `priceRange: "$$$$"` no aporta información en consultoría B2B.

### 3.2 — Eliminar `WebSite` / `SearchAction`

Borrar el bloque completo. Declara un `SearchAction` hacia `/?s={search_term_string}`, un buscador que el sitio no tiene. Structured data que describe funcionalidad inexistente es un defecto de validez. Si algún día hay buscador real, se vuelve a añadir.

### 3.3 — Reemplazar `Organization`

Sustituir el bloque actual por este, rellenando los campos marcados según B2, B3 y B4:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://violetbridgesecurity.com/#organization",
  "name": "Violet Bridge Security LLC",
  "alternateName": "Violet Bridge Security",
  "url": "https://violetbridgesecurity.com/",
  "logo": "https://violetbridgesecurity.com/assets/[B4]",
  "description": "Boutique cybersecurity consultancy providing penetration testing, external attack surface management, SASE and Zero Trust implementation, threat intelligence and vCISO advisory to organizations in the United States.",
  "foundingDate": "[B2]",
  "email": "[B3]@violetbridgesecurity.com",
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

⚠️ **Sin `address`. Es deliberado**, por lo explicado en 3.1. No reintroducirlo.

⚠️ `areaServed` pasa de `Global` a `United States`. También deliberado.

### 3.4 — Solo en `index.html`

Los otros tres HTML de la raíz llevan `noindex`; no necesitan structured data. Un archivo, no cuatro.

### Verificación

`https://search.google.com/test/rich-results` sobre la home. Cero errores. Debe detectar **un solo** bloque, de tipo `Organization`.

**Criterio de aceptación:** un único JSON-LD, tipo `Organization`, sin `address`, con B2/B3/B4 resueltos.

---

## FASE 4 — llms.txt

**Rama:** `seo/f4-llms-txt`
**Corrige:** D10 · **Bloqueada por:** B2, B3

El archivo **ya existe** (1.681 bytes) pero está desactualizado: usa www, describe un catálogo de servicios que no corresponde al actual, da `info@`, y no tiene sección `## Site`.

**Reemplazo íntegro**, no fusión — el contenido actual describe un posicionamiento anterior:

```
# Violet Bridge Security

> Boutique cybersecurity consultancy serving US mid-market and regulated
> organizations. Penetration testing, external attack surface management,
> SASE and Zero Trust implementation, threat intelligence, security
> awareness training, vCISO advisory.

## About
Founded [B2]. Wyoming LLC. Principal consultant holds CISSP.
Contact: [B3]@violetbridgesecurity.com

## Site
- [Home](https://violetbridgesecurity.com/)
```

Debe servirse como `text/plain` y devolver 200. La sección `## Site` crece cuando existan las páginas de servicio.

**Nota honesta:** la adopción de `llms.txt` es desigual y el beneficio no está demostrado. Se mantiene porque ya existe y actualizarlo cuesta minutos, no porque haya evidencia sólida.

**Criterio de aceptación:** contenido actualizado, apex, email consistente con el JSON-LD.

---

## FASE 5 — Migración de headers a `_headers`

**Rama:** `seo/f5-http-headers`
**Corrige:** D11, D12, D13

Va última porque es la de mayor riesgo de regresión.

### 5.0 — Por qué esta fase importa más de lo que parecía

`X-Content-Type-Options` y `X-Frame-Options` están hoy como `<meta http-equiv>`. **Los navegadores los ignoran en esa forma.** Están en el código y no protegen nada. Esta fase no "añade headers de seguridad": los activa por primera vez.

### 5.1 — Crear `_headers`

No existe. Se crea en la raíz (que es el publish directory).

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=()
```

`DENY` en lugar del `SAMEORIGIN` actual: nadie embebe el sitio en un iframe propio. Es reversible si aparece un caso de uso.

⚠️ **No añadir `Strict-Transport-Security`.** Ya existe en la UI de Netlify; duplicarlo puede producir comportamiento inconsistente. Y no añadir `includeSubDomains` ni `preload` sin consultar — ver §4.

### 5.2 — Portar la CSP verbatim

**No diseñar una CSP nueva.** Hay una funcionando en producción, y dos commits recientes del historial son arreglos de esa CSP rompiendo Elfsight. Ya está calibrada contra problemas reales.

Procedimiento:
1. Copiar la CSP actual de `<meta>` a `_headers` **sin cambiar ni un origen**.
2. En el **mismo commit**, eliminar la `<meta http-equiv="Content-Security-Policy">` de los 4 HTML. Si coexisten header y meta, se aplican ambas y manda la intersección más restrictiva — eso rompe cosas de forma difícil de diagnosticar.
3. Verificar en el deploy preview: widget de Elfsight carga, los dos formularios de Formspree envían, Google Analytics reporta, el video del hero reproduce.
4. **Solo después**, y en un PR aparte, proponer endurecimientos.

⚠️ **No endurecer `img-src` en este PR ni en ninguno futuro sin consultar.** El `img-src 'self' data: https:` amplio es lo que permite funcionar al canary token de `index.html`. Restringirlo lo rompe en silencio, sin error visible. Lo mismo aplica a quitar `'unsafe-inline'` de `script-src`.

Ventaja de estar en header: `frame-ancestors 'none'` pasa a ser posible (en `<meta>` se ignora) y es la forma moderna de `X-Frame-Options`. Proponerlo en el PR de endurecimiento, no en este.

### 5.3 — Canonical HTTP en los PDFs

Son **tres**, en **dos** carpetas. Una regla `/reports/*` no alcanza el de `assets/`:

```
/reports/*
  Link: <https://violetbridgesecurity.com/>; rel="canonical"

/assets/VioletBridge_capabilities_statement.pdf
  Link: <https://violetbridgesecurity.com/>; rel="canonical"
```

⚠️ **No añadir `noindex` a los PDF de portfolio y capabilities todavía.** El de portfolio es uno de los dos activos indexados que existen; desindexarlo antes de que haya página HTML equivalente deja menos, no más. Dejar un comentario en el archivo indicando que el `noindex` llega con las páginas de servicio.

**Excepción:** el PDF de Netskope sí lleva `noindex` desde ya, por la misma razón que su versión HTML en la Fase 1.0:

```
/reports/Netskope*
  X-Robots-Tag: noindex
```

### Verificación

```bash
curl -sI https://violetbridgesecurity.com/ | grep -iE 'x-content-type|x-frame|referrer-policy|permissions-policy|content-security'
curl -s  https://violetbridgesecurity.com/ | grep -i 'http-equiv'
curl -sI "https://violetbridgesecurity.com/reports/Violet%20Bridge%20Security%20-%20Service%20Portfolio%202026.pdf" | grep -i link
curl -sI "https://violetbridgesecurity.com/assets/VioletBridge_capabilities_statement.pdf" | grep -i link
```

Los headers deben aparecer en la respuesta HTTP. `http-equiv` no debe devolver nada de CSP ni de X-Frame.

**Criterio de aceptación:** headers activos vía HTTP; metas de seguridad eliminadas del HTML; CSP portada sin regresiones verificadas manualmente; canonical HTTP en los tres PDFs; HSTS sin modificar.

---

## FASE 6 — Verificación final

```bash
echo "=== Host ==="
curl -sI https://www.violetbridgesecurity.com/ | grep -iE 'HTTP|location'
curl -sI https://violetbridgesecurity.com/     | grep -iE 'HTTP|location'

echo "=== Metadatos ==="
curl -s https://violetbridgesecurity.com/ | grep -iE 'canonical|og:url|og:image|twitter:image|<title'
curl -s https://violetbridgesecurity.com/ | grep -i 'name="keywords"'

echo "=== Crawl ==="
curl -s  https://violetbridgesecurity.com/robots.txt
curl -s  https://violetbridgesecurity.com/sitemap.xml
curl -sI https://violetbridgesecurity.com/llms.txt | head -3

echo "=== Structured data ==="
curl -s https://violetbridgesecurity.com/ | grep -c 'application/ld+json'

echo "=== Headers ==="
curl -sI https://violetbridgesecurity.com/ | grep -iE 'strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy|content-security'

echo "=== noindex report ==="
curl -s https://violetbridgesecurity.com/reports/netskope_report.html | grep -i robots
```

**Esperado:** www → 301; apex → 200; canonical/og en apex y absolutos; keywords vacío; robots y sitemap en apex sin `www`; JSON-LD = **1**; headers presentes vía HTTP; netskope_report con `noindex`.

---

## 8. Fuera del alcance de este repo

| Tarea | Dónde |
|---|---|
| Propiedades en Google Search Console (apex, www, Dominio) y Bing Webmaster Tools | Consolas web |
| Enviar sitemap en ambos motores | Tras Fase 2 |
| Solicitar listado en directorios de 8 partners | Correo |
| `noindex` en `go.violetbridgesecurity.com` | nginx en la VM del pipeline — **no está en Netlify** |
| Baseline: Screaming Frog, PageSpeed campo, dominios de referencia | Herramientas externas |
| LinkedIn Post Inspector tras Fase 1 | Web |
| Confirmar publish directory (B6) | UI de Netlify |
| Revisar contenido de los reports de Netskope (B5) | Mike |

---

## 9. Qué viene después

La Fase 2 del programa rompe el sitio de una página en URLs reales:

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

Sin trailing slash, canonical absoluto en apex, cada una con `Service` y `FAQPage` schema propios.

**Decisión pendiente para esa fase:** con 12+ páginas HTML a mano y sin parciales, mantener el `<head>` sincronizado se vuelve inviable. Habrá que introducir un generador estático (Eleventy es el de menor fricción sobre HTML existente) o aceptar la duplicación. Se decide al empezar esa fase, no antes.
