type SpinnerType = {
  full?: boolean
}

export const Spinner = ({full = true}: SpinnerType) =>{
    return (
        <div className={`flex items-center justify-center align-middle ${full ? 'min-h-screen' : ''}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
}