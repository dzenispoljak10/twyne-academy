interface LessonVideoProps {
  content: Record<string, unknown>
}

export default function LessonVideo({ content }: LessonVideoProps) {
  const youtubeId = content.youtubeId as string

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-900">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video lesson"
      />
    </div>
  )
}
