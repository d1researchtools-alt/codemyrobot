import * as React from 'react'
import Markdoc, { type Node } from '@markdoc/markdoc'

/**
 * The reader returns Markdoc content as `{ node }`. Render it to React on the
 * server so no Markdoc runtime ships to the browser.
 */
export function PageBody({ node }: { node: Node }) {
  const renderable = Markdoc.transform(node)
  return <div className="post-content">{Markdoc.renderers.react(renderable, React)}</div>
}
