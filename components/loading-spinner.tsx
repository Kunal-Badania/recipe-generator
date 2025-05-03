export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-solid border-orange-400 border-t-transparent"></div>
        <div className="absolute top-0 h-16 w-16 animate-ping opacity-30 rounded-full border-4 border-solid border-orange-300"></div>
      </div>
      <p className="mt-4 text-orange-700">Cooking up your recipes...</p>
    </div>
  )
}
