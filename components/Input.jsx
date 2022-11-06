export default function Input({type, className, ...props}) {
  return (
    <input type={type} {...props} className={`${
      className
        ? className
        : "w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary focus:border-gray-200 transition duration-300 bg-gray-100"
    }`}/>
  )
}
