type CustomFormSelectType = {
    value: string, 
    options: {v: string, k: string}[],
    changeHandler: (e: any)=>any, 
}
export const CustomFormSelect = ({value, options, changeHandler}: CustomFormSelectType) =>{
    return (
        <select
            value={value}
            onChange={changeHandler}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2">
            {options.map((option)=>(
                <option key={value} value={option.v}>{option.k}</option>
            ))}
        </select>
    )

}