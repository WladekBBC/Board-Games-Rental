/**
 * Error prop
 * @param {string|null} error - error message
 */
type ErrorProp = {error: string | undefined}

/**
 * Error message area
 * @returns {JSX.Element} error message if there is any
 */
export default function ErrorField({error}:ErrorProp){
  return (
    <>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/30 p-2 rounded">
          {error}
        </div>
      )}
    </>
  )
}