type GameInputType = {
    name: string,
    label: string,
    value: string | number,
    type: string,
    min?: number,
    max?: number,
    changeHandler: (e: any) => void
}

export const GameInput = ({ name, label, value, type, min, max, changeHandler}: GameInputType) =>{
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            {type == 'textarea' ? 
            <textarea rows={3} id={name} name={name} value={value} onChange={changeHandler}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
            : 
            <input type={type} id={name} name={name} value={value} onChange={changeHandler} min={min} max={max}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
            }

        </div>
    )
}