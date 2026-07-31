import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type Props = {
  data: DefaultTypedEditorState | null | undefined
  className?: string
}

export function RichText({ data, className }: Props) {
  if (!data) return null

  return (
    <div className={className ?? 'rich-text'}>
      <LexicalRichText data={data} />
    </div>
  )
}
