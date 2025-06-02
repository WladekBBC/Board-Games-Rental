type GameInputType = {
    name?: string,
    label?: string,
    value: string | number | undefined,
    type: string,
    lenght?: number,
    min?: number,
    max?: number,
    placeholder?: string
    autoComplete?: string
    className?: string
    required?: boolean
    changeHandler: (e: any) => void
    blurHandler?: (e: any) => void
    focusHandler?: (e: any) => void
}

export const CustomFormInput = ({ name, label, value, type, lenght, min, max, placeholder, autoComplete, className, required = true, changeHandler, blurHandler, focusHandler}: GameInputType) =>{
    return (
        <div className={className}>
            {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>}
            {type == 'textarea' ? 
            <textarea rows={3} id={name} name={name} value={value} onChange={changeHandler} maxLength={lenght ? lenght : 255}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2" required={required}/>
            : 
            <input type={type} id={name} name={name} value={value} onChange={changeHandler} min={min} max={max} maxLength={lenght ? lenght : 255} placeholder={placeholder} onBlur={blurHandler} onFocus={focusHandler} autoComplete={autoComplete || "off"}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2" required={required}/>
            }

        </div>
    )
}