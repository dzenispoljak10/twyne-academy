interface LessonTextProps {
  content: Record<string, unknown>
}

export default function LessonText({ content }: LessonTextProps) {
  const markdown = (content.markdown as string) ?? ''

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
  }

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
    />
  )
}
