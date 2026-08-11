'use client'
import type { RefObject } from 'react'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

/**
 * Refs are returned directly rather than wrapped in `{ card: { ref } }`.
 *
 * The nesting made call sites write `ref={card.ref}`, and reading a property off
 * a ref-carrying object during render is what `react-hooks/refs` flags — the
 * compiler cannot tell that `.ref` is the ref object itself rather than its
 * contents. Handing back the refs unwrapped says the same thing with less
 * ceremony and no rule violation.
 */
type UseClickableCardType<T extends HTMLElement> = {
  cardRef: RefObject<T | null>
  linkRef: RefObject<HTMLAnchorElement | null>
}

interface Props {
  external?: boolean
  newTab?: boolean
  scroll?: boolean
}

function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): UseClickableCardType<T> {
  const router = useRouter()
  const card = useRef<T>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const timeDown = useRef<number>(0)
  const hasActiveParent = useRef<boolean>(false)
  const pressedButton = useRef<number>(0)

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.target) {
        const target = e.target as Element

        const timeNow = +new Date()
        const parent = target?.closest('a')

        pressedButton.current = e.button

        if (!parent) {
          hasActiveParent.current = false
          timeDown.current = timeNow
        } else {
          hasActiveParent.current = true
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, card, link, timeDown],
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (link.current?.href) {
        const timeNow = +new Date()
        const difference = timeNow - timeDown.current

        if (link.current?.href && difference <= 250) {
          if (!hasActiveParent.current && pressedButton.current === 0 && !e.ctrlKey) {
            if (external) {
              const target = newTab ? '_blank' : '_self'
              window.open(link.current.href, target)
            } else {
              router.push(link.current.href, { scroll })
            }
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, card, link, timeDown],
  )

  useEffect(() => {
    const cardNode = card.current

    const abortController = new AbortController()

    if (cardNode) {
      cardNode.addEventListener('mousedown', handleMouseDown, {
        signal: abortController.signal,
      })
      cardNode.addEventListener('mouseup', handleMouseUp, {
        signal: abortController.signal,
      })
    }

    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, link, router])

  return { cardRef: card, linkRef: link }
}

export default useClickableCard
