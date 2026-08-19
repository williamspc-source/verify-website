# The VERIFY admin — what everything in the sidebar is for

**Who this is for:** whoever logs in at `/admin` to keep the site up to date. You do not need to
write code, and nothing in this guide asks you to.

**What it covers:** every item in the left-hand sidebar — what it is, what it changes on the public
site, and what happens if you delete something. It does **not** cover colours, fonts, spacing or
CSS; that is [`src/Styles/HOOKS.md`](src/Styles/HOOKS.md), the styling manual. The split is:

> **HOOKS.md** answers *"how do I change how this looks?"*
> **This guide** answers *"what is this thing, and what feeds off it?"*

**The one rule worth knowing before anything else:** changes go live when you press **Save**. There
is no deployment to run and no cache to clear. The only gate is the **Draft / Published** toggle,
and only five things have one (see [Drafts](#drafts-and-what-hides-a-page)).

---

## 1. The sidebar, as a map

Eleven groups. Each holds **one kind of thing** — either records you add and delete, or fixed
wording you edit.

| Group | What lives here | You will use it |
|---|---|---|
| **Publishing** | Pages, Articles, Events | Constantly — this is the site's content |
| **Reference** | Services, Resources, Offices, Testimonials | Occasionally — records that feed sections of pages |
| **Taxonomy** | Nine lists that classify specialists and articles | Rarely — set up once, extended now and then |
| **People** | Specialists, Team Members | When someone joins, leaves or changes role |
| **Availability** | Availability Sessions | Regularly, if you advertise appointment slots |
| **Media** | Every uploaded image and file | Whenever you add a photo |
| **System** | Users, Redirects, Search Results | Rarely |
| **Forms** | Forms, Form Submissions | To read enquiries, or change a form's fields |
| **Page settings** | Fixed wording on templated pages | Rarely — set once |
| **Site** | Header, Footer, Site Settings | When the nav, footer or branding changes |
| **Design** | Custom Styles, Design System | See HOOKS.md |

**Records vs settings.** *Publishing*, *Reference*, *Taxonomy*, *People*, *Availability*, *Media*
and *Forms* hold **records** — you add and delete rows. *Page settings*, *Site* and *Design* hold
**settings** — a single screen you edit, never a list. That distinction is why the groups were
reorganised: the settings screens used to sit among the content collections with nothing marking
them apart.

---

## 2. "I want to…" — where to go

| I want to… | Go to |
|---|---|
| Change words on a normal page | **Publishing → Pages** → the page |
| Publish a new article | **Publishing → Articles** → *Create new* (pick a **Stream**) |
| Add a specialist to the panel | **People → Specialists** → *Create new* |
| Add a staff member | **People → Team Members** |
| Put an event up, or write it up afterwards | **Publishing → Events** |
| Advertise appointment slots | **Availability → Availability Sessions** |
| Change the main menu | **Site → Header** |
| Change the footer or opening hours | **Site → Footer**, or **Reference → Offices** |
| Change the phone number or address | **Reference → Offices** (the primary one) |
| Read enquiries that came in | **Forms → Form Submissions** |
| Change who is emailed about enquiries | **Forms → Forms** → the form → **Emails** tab |
| Change the logo, favicon or brand colours | **Site → Site Settings** |
| Change the wording of the "register for the portal" email | **Site → Site Settings** → *Booking portal registration email* |
| Fix a badly cropped photo | **Media** → the image → move the focal point |
| Change a heading like "Assessment Areas" on every profile | **Page settings → Specialist Profile** |
| Change colours, spacing, fonts | See [`HOOKS.md`](src/Styles/HOOKS.md) |

---

## 3. Publishing

### Pages

**What it is:** every ordinary page of the site — Home, About, Services, Contact and the rest.
Each is built from **blocks** you add, reorder and remove.

**Where it appears:** at its own web address.

**The one thing to understand:** a page's address comes from its **Parent**, not from anything you
type. `ime` with parent `medico-legal`, whose parent is `services`, gives
`/services/medico-legal/ime`. **Changing the parent changes the URL**, and any link anyone has
saved to the old one will break — so add a **Redirect** (see *System*) when you do.

**Draft or instant:** has a Draft/Published toggle. New pages start as drafts.

**If you delete one:** the address 404s. Links to it elsewhere on the site render as plain text
rather than broken links, but they stop working.

---

### Articles

**What it is:** the articles published to **In the Loop**.

> **The admin says "Articles"; the site says "In the Loop".** They are the same thing. The section
> is branded *In the Loop* for visitors — that is the nav item, the web address and the heading —
> while the admin calls the individual items Articles, because that reads more clearly beside Pages
> and Events. See [§8](#8-admin-word--site-word) for the full translation table.

**Where it appears:** `/in-the-loop`, and each article at `/in-the-loop/<stream>/<slug>`.

**Every article needs a Stream.** The stream is the folder in the address. **An article with no
stream has no address at all** — it will not appear and cannot be linked to. This is the single
most common way to lose an article.

**Topics** are the coloured chips on article cards. They are optional and separate from Streams.

**Draft or instant:** has a Draft/Published toggle.

---

### Events

**What it is:** seminars and webinars, before and after they happen.

**Where it appears:** `/events`, split into Upcoming and Past, and each at `/events/event/<slug>`.

**Upcoming vs Past is worked out from the date** — you do not set it. An event stays "Upcoming" for
the whole of the day it is held, not until its start time. Registration is controlled separately by
**Registration closes at**, so an event can be running and still taking expressions of interest.

**Event photo** is worth setting. It is shown on the two listing pages and on the `/events` hub
cards. Leave it empty and the event falls back to a date calendar showing the day and month — so a
missing photo never leaves an empty panel, and you can add photos gradually rather than all at once.
It is cropped to fill its panel, so a landscape image works best.

**After the event**, the same record becomes the write-up: add a **Recap**, a **Photo gallery** and
**Downloads**. HOOKS.md §9 has the full list of what an event page can hold.

**Draft or instant:** has a Draft/Published toggle.

---

## 4. Reference

These four hold records that **feed sections of pages** rather than having pages of their own.

### Services

**What it is:** the service cards that appear in Services grids.

**Where it appears:** the homepage, `/services` and its sub-pages, and For Clients.

> **A Service is a card, not a page.** There is no `/services/<something>` address generated from
> this collection — the actual service pages are **Pages**. Each Service card carries a **Link
> override** pointing at the page it should open. If you add a Service and leave that empty, the
> card has nowhere to go.

**Draft or instant:** instant — saving publishes.

### Resources

**What it is:** downloadable guides, checklists and PDFs.

**Where it appears:** **one place** — the Resources section of the In the Loop hub. Adding a
resource changes that section and nothing else.

**Draft or instant:** instant.

### Offices

**What it is:** your physical offices — address, phone, email, opening hours, map, parking and
public transport.

**Where it appears:** the **footer of every page**, and the "Where to Find Us" section on Contact
and on Information for Claimants.

**Mark one as Primary.** The primary office is the one the footer and contact blocks use. If none is
marked, the lowest **Order** wins. Note the Footer has its own phone/email fields that **override**
this — if you change the number here and the footer still shows the old one, clear the footer's copy.

**Draft or instant:** instant.

### Testimonials

**What it is:** client quotes, attributed by role and organisation rather than by name.

**Where it appears:** **one place** — the testimonial carousel on the homepage.

**Draft or instant:** instant.

---

## 5. Taxonomy

Nine lists that classify things. You will rarely add to them, and you should think before deleting
from them — other records point at these.

| List | What it classifies | Where a visitor sees it |
|---|---|---|
| **Specialties** | Specialists | The Specialty List page, and directory filters |
| **Specialty Categories** | Specialties | The filter buttons above the Specialty List |
| **Assessment Types** | Specialists | A profile's "Assessment Types" section |
| **Claim Types** | Specialists | A profile's "Claim Types" section |
| **Assessment Areas** | Specialists | A profile's "Assessment Areas" section |
| **Accreditations** | Specialists | Chips on a profile, and a directory filter |
| **Locations** | Specialists | A profile's location line, and a directory filter |
| **Streams** | Articles | **Nothing** — it is the folder in the web address |
| **Topics** | Articles | The coloured chips on article cards, and "Topics" on an article |

**Two of these are named differently from what a visitor reads.** *Assessment Areas* used to be
called "Areas of Expertise" in the admin, and *Topics* used to be called "Categories" — both were
renamed so the admin matches the site.

> **Deleting a Stream strands its articles.** A stream is the folder in an article's address, so
> removing one leaves every article in it with no address. Move the articles to another stream first.

> **Locations is not Offices.** *Locations* are places specialists consult, used as a filter.
> *Offices* are your own premises, with an address and opening hours.

---

## 6. People, and Availability

### Specialists

**What it is:** the external doctors on your panel.

**Where it appears:** the Specialist Panel and Specialty List pages, and each profile at
`/specialists/profiles/<slug>`.

**How a profile is built:** most of it comes from the taxonomy lists above — pick the specialties,
assessment types, claim types, assessment areas, accreditations and locations, and the profile
assembles itself. The free-text parts are the biography, qualifications and position line.

**You can drag to reorder** this list; the order is used on the panel page.

**Draft or instant:** has a Draft/Published toggle — saving as a draft removes them from the site.

### Team Members

**What it is:** VERIFY's own staff.

**Where it appears:** `/about/meet-the-team`, and each at `/about/team/<slug>`.

> Note the two addresses differ — the list is at `/about/meet-the-team` while an individual is at
> `/about/team/…`. That is intentional and long-standing; nothing needs doing about it.

**Draft or instant:** has a Draft/Published toggle.

### Availability Sessions

**What it is:** advertised appointment slots. Each belongs to a specialist and has a date, a time,
a mode (in-person / telehealth / either) and a status.

**Where it appears:** the availability grid on **Make a Booking**. A visitor ticks the sessions they
want and presses Send, which opens their email app with the selection written out.

**Advertise until** stops a slot showing after that date, and defaults to the end of the month — so
old slots disappear on their own rather than needing tidying.

**A specialist appears in the list as soon as they have available sessions** — there is nothing
else to switch on. The separate **Feature in availability carousel** toggle, on the specialist
record, controls only the carousel *above* the list.

**Draft or instant:** instant.

---

## 7. The rest

### Media

Every uploaded image and file. Set **alt text** here — it is what a screen reader announces and what
search engines read.

**Fix a bad crop with the focal point, not a new upload.** If a portrait crops through someone's
face, open the image and move the focal point; every place that image is used re-crops around it.

### Forms, and Form Submissions

**Forms** are the enquiry forms used across the site. **Form Submissions** is the record of what
visitors have sent — read-only.

**Who gets notified is set per form**, on that form's **Emails** tab. If enquiries stop arriving,
that is the first place to look.

> If the **Make an Enquiry** drawer opens but says it is unavailable, the drawer does not know which
> form to use. Fix it at **Site → Site Settings → Enquiry drawer form**. The usual cause is that
> someone renamed the form.

### Users, Redirects, Search Results

**Users** are admin logins. **Everyone has full access** — there are no restricted roles — so only
add people you trust with the whole site.

**Redirects** send an old address to a new one. Add one whenever you change a page's slug or parent.

**Search Results** is built automatically so the site search can find things. Nothing here is edited
by hand.

### Page settings

Five screens holding the **fixed wording** on templated pages — the headings and labels that appear
on *every* article, event, team profile or specialist profile, rather than on one page.

| Screen | Controls |
|---|---|
| **Article Settings** | The sidebar cards and fixed labels on every article ("In This Article", "Topics") |
| **Events Settings** | Boilerplate on event pages, per host (AAMLE / VERIFY) |
| **Team Settings** | Breadcrumb and labels on every team profile |
| **Specialist Profile** | The section headings on every specialist profile, and the booking-portal band |
| **Specialist Availability** | Wording on the availability grid, and the enquiry email its Send button opens |

### Site

**Header** is the main menu and its dropdowns. **Footer** is the link columns, contact details and
opening hours. **Site Settings** holds the logo, favicon, brand colours, the enquiry-drawer form, and
the wording of the booking-portal registration email.

### Design

**Custom Styles** and **Design System** — see [`HOOKS.md`](src/Styles/HOOKS.md).

---

## 8. Admin word → site word

Where the admin and the site use different words for the same thing.

| The admin says | A visitor sees | Why |
|---|---|---|
| **Articles** | *In the Loop* | The section is branded for visitors; the admin names the content type |
| **Topics** | *Topics* | Matches — this was renamed from "Categories" |
| **Assessment Areas** | *Assessment Areas* | Matches — this was renamed from "Areas of Expertise" |
| **Streams** | *nothing* | A stream is only the folder in an article's web address |
| **Specialists** | *Specialist Panel*, *Expert Panel*, *Our Panel of Medical Specialists* | The collection is the people; the pages use marketing wording |
| **Team Members** | *Meet the Team*, *Our People* | ditto |
| **Services** | *the service cards* | These are cards; the service **pages** are Pages |

---

## 9. Drafts, and what hides a page

**Only five things have a Draft/Published toggle:** Pages, Articles, Events, Specialists and Team
Members. A draft is invisible to visitors.

**Everything else publishes the moment you press Save** — Services, Resources, Offices,
Testimonials, every taxonomy list, and all the settings screens. There is no way to stage a change
to those, so make them when you are ready.

---

## 10. Traps worth knowing

- **Opening "Create New" creates the record straight away — before you type anything.** Pages,
  Articles and Events save themselves continuously so live preview works, which means clicking
  *Create New* to have a look and then navigating away leaves an empty `<No Title>` row behind. If
  you open one by mistake, delete it before you leave. (74 of these had built up and were cleared on
  18 Aug 2026 — one Article and one Event from clicking about, the rest from the test suite.)
- **An article with no Stream has no web address.** It will not appear anywhere.
- **Deleting a Stream strands every article in it.** Move them first.
- **Changing a page's Parent changes its URL** and breaks saved links. Add a Redirect.
- **The Footer's contact fields override the primary Office.** Clear them to fall back.
- **A Service card with no Link override has nowhere to go.**
- **Renaming a Form can disconnect the enquiry drawer.** Re-select it in Site Settings.
- **Only the active tab of a Tabs block is in the page for search engines.** Do not hide anything
  important in a second tab.
- **Clearing "Send to" on the registration email disables those buttons on purpose** — they render
  as plain text rather than opening an email with no recipient.

---

## Where else to look

| File | For |
|---|---|
| [`src/Styles/HOOKS.md`](src/Styles/HOOKS.md) | Colours, fonts, spacing, block options, CSS |
| [`README.md`](README.md) | Running and deploying the site; where images go |
| [`OUTSTANDING.md`](OUTSTANDING.md) | Known-imperfect things, deliberately left |
