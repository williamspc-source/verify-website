import type { Payload, PayloadRequest } from 'payload'

type Ctx = { payload: Payload; req: PayloadRequest }

/**
 * Converts event time ranges from an en dash to the plain hyphen the design
 * reference uses: "12:00 pm – 1:00 pm" → "12:00 pm - 1:00 pm".
 *
 * ── Why a repair, and not just the fixture ──
 * `timeLabel` is content. Editing `seed/data/events.ts` alone reaches a virgin
 * database and nothing else; every existing install keeps the en dash.
 *
 * ── The predicate ──
 * Keyed on the superseded value itself — a `timeLabel` still containing an en
 * dash. That is a genuine absence of the new value rather than a defaulted
 * field, so it fires once and then stops matching. It also cannot damage an
 * editor's own wording: only the dash character is replaced, the rest of the
 * string is left exactly as written, and a label that never had an en dash is
 * never touched.
 */

const EN_DASH = '–'

export const repairEventTimeDash = async ({ payload, req }: Ctx): Promise<void> => {
  const found = await payload.find({
    collection: 'events',
    where: { timeLabel: { contains: EN_DASH } },
    limit: 200,
    depth: 0,
    req,
  })

  const docs = found.docs as unknown as Array<{ id: number | string; timeLabel?: string | null }>
  if (!docs.length) return

  for (const doc of docs) {
    if (typeof doc.timeLabel !== 'string') continue
    await payload.update({
      collection: 'events',
      id: doc.id,
      data: { timeLabel: doc.timeLabel.split(EN_DASH).join('-') } as never,
      req,
      context: { disableRevalidate: true },
    })
  }

  payload.logger.info(`— Event time ranges converted to a plain hyphen: ${docs.length}`)
}
