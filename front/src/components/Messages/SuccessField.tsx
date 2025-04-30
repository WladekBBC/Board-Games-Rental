/**
 * Success prop
 * @param {string|null} success - success message
 */
type SuccessProp = {success: string|null}

/**
 * Error message area
 * @returns {JSX.Element} error message if there is any
 */
export default function SuccessField({success}:SuccessProp){
  return (
    <>
      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
    </>
  )
}