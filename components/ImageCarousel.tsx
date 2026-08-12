'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type CarouselItem = { image: string; alt: string }

const AUTOPLAY_MS = 4000

/**
 * Replaces the original Avada "fusion-image-carousel": four fixed-width items
 * across on desktop, autoplaying, with a lift-up hover. Built on native scroll
 * snapping so touch and trackpad swiping work without a JS gesture handler.
 */
export function ImageCarousel({ items }: { items: readonly CarouselItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [paused, setPaused] = useState(false)
  const [atStart, setAtStart] = useState(true)

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
  }, [])

  const step = useCallback((direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const first = el.querySelector('li')
    // Advance by one item, falling back to a viewport-width jump.
    const delta = first ? first.getBoundingClientRect().width + 12 : el.clientWidth
    const atRightEdge = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1

    if (direction === 1 && atRightEdge) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }
    el.scrollBy({ left: delta * direction, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    updateEdges()
  }, [updateEdges, items.length])

  useEffect(() => {
    if (paused || items.length < 2) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const id = window.setInterval(() => step(1), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, items.length, step])

  if (items.length === 0) return null

  return (
    <div
      className="relative mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        onScroll={updateEdges}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:thin]"
      >
        {items.map((item, i) => (
          <li
            key={`${item.image}-${i}`}
            className="w-[calc(50%-6px)] shrink-0 snap-start sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)]"
          >
            <div className="overflow-hidden border border-rule bg-white transition-transform duration-300 hover:-translate-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="block aspect-[320/202] w-full object-cover"
              />
            </div>
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous images"
            className="border border-rule px-3 py-1 text-[14px] text-body transition-colors hover:border-accent hover:text-accent-dark disabled:opacity-40 disabled:hover:border-rule disabled:hover:text-body"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next images"
            className="border border-rule px-3 py-1 text-[14px] text-body transition-colors hover:border-accent hover:text-accent-dark"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
