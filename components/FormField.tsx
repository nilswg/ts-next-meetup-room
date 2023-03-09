type Props = {
  id: string
  text: string
  type?: string
  value: string
  onChange: (e: any) => void
}

const FormField = ({ id, text, type = 'text', value = '', onChange }: Props) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        {text}
      </label>
      <input
        id={id}
        type={type}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder={text}
        onChange={onChange}
        value={value}
        required
      />
    </div>
  )
}

export default FormField
