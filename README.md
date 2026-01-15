# Democracy-Conference

### The Ultimate All-in-One WebC Single Page Application

A cutting-edge, high-performance event management system built 
with **Eleventy (11ty)** and **WebC**. This engine adopts a **Single Page Application (SPA)** architectural pattern, 
specifically engineered for elite SEO rankings and industry-leading performance in the 2026 market.

---

## 🚀 Key Features

Designed for global scalability and rock-solid stability:

* **Hybrid SPA Architecture:** Fast client-side transitions powered by static site generation reliability.
* **Dynamic Event Logic:** * **Auto-Archive:** Past events are automatically hidden from the main feed.
    * **Live Countdown:** Real-time countdown timers for upcoming sessions.
    * **Date Management:** Comprehensive Start and End date handling.
* **Elite Speaker Management:** Integrated categorization (e.g., Plenary or Keynote sessions).
* **Complete Content Modules:**
    * **Speakers:** List and individual detail pages.
    * **Events:** Full schedule directory and session details.
    * **Press/Blog:** Dedicated media list and article detail pages.
* **Automated SEO & Core Tools:** * Pre-configured Sitemap, RSS Feed, Robots.txt, and Meta tags.
    * Full WebC component-based structure.
* **CMS Integration:** Fully compatible and ready for **Sveltia CMS**.

---

## 🔄 Architectural Transition: From Spreadsheet to Git-Based CMS

Originally, this project was planned to utilize **Google Sheets/Excel** as the primary data source. However, 
during the development , we identified several critical bottlenecks:
* **Connectivity Issues:** Intermittent API errors and synchronization delays.
* **Data Integrity:** Lack of strict schema validation leading to inconsistent outputs.
* **Performance:** Unnecessary latency in fetching remote spreadsheet data during the build process.

### The Solution: Sveltia CMS + YAML
To ensure a **scalable system**, we have migrated the architecture to **Sveltia CMS**.
* **Reliability:** Data is now stored locally in high-performance **YAML** files.
* **Version Control:** Every content change is tracked via Git, ensuring a perfect "Source of Truth."
* **Ease of Use:** Sveltia provides a familiar, user-friendly interface for content managers without the fragility of external spreadsheets.

---

## 🛠 Configuration Guide

For maximum speed and flexibility, this system utilizes **YAML** as the single source of truth for structured data, 
replacing standard markdown collections for complex event schemas.

### Content Management

Update the following files in `src/_data/` to manage your website:

| File Path | Description |
| :--- | :--- |
| `config.yaml` | Core Settings: Navbar, Footer, and Contact Form configuration. |
| `design.yaml` | Visual Engine: Update Home Page components and layouts. |
| `metadata.yaml` | SEO Strategy: Global metadata, Social Graph, and tracking. |
| `hotels.yaml` | Hospitality: Manage recommended hotel lists and details. |
| `speakers.yaml` | Profiles: Manage speaker data, types (Plenary/Keynote), and bios. |
| `event.yaml` | Schedule: Define all event sessions, dates, and locations. |

*Note: For news and articles, manage your content directly in the `press/` directory.*

---

## 👨‍💻 Meet the Developer

Building the future of the web with precision. Whether you need a custom implementation of **Pro Project** 
or a bespoke backend architecture, I am here to help.

**Need assistance or have a project in mind?**
* **Website:** [www.adamdjbrett.com](https://www.adamdjbrett.com)
* **Email:** [info@adamdjbrett.com](mailto:info@adamdjbrett.com)

---


