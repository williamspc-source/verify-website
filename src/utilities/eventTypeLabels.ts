/**
 * The one map from an Event's `eventType` to the label a visitor reads.
 *
 * There were three byte-identical copies of this — in `ArchiveBlock`, in
 * `EventsExplorer`, and on the event detail page — each carrying a comment
 * telling the reader to keep it in step with the other two. Adding three new
 * types on 2026-08-20 meant editing all three or shipping a blank badge on
 * whichever was missed, which is precisely how the collection→prefix map in
 * `routes.ts` came to disagree with itself (see CLAUDE.md). Hence one module.
 *
 * Keep in step with the `eventType` options in `src/collections/Events/index.ts`.
 * A value with no entry here falls back to the raw slug rather than rendering
 * empty, so a future option that is added there and forgotten here shows up as
 * visibly wrong text instead of a silently missing badge.
 */
export const EVENT_TYPE_LABELS: Record<string, string> = {
  networking: 'Networking Event',
  'client-training': 'Client Training',
  'industry-briefing': 'Industry Briefing',
  workshop: 'Workshop',
  webinar: 'Webinar',
  'breakfast-seminar': 'Breakfast Seminar',
  masterclass: 'Masterclass',
  'specialist-seminar': 'Specialist Seminar',
  conference: 'Conference',
  sponsorship: 'Sponsorship',
  social: 'Social Event',
}

/** Label for an event type, falling back to the raw value. */
export const eventTypeLabel = (value?: string | null): string =>
  (value && EVENT_TYPE_LABELS[value]) || value || ''
