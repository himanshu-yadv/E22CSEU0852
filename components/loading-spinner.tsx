export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div className="flex justify-center p-4">
      <div className={`animate-spin rounded-full border-t-transparent border-purple-600 ${sizeClasses[size]}`} />
    </div>
  )
}

