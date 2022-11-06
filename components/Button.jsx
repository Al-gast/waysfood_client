export default function Button({children, className, ...props}) {
  return (
    <button {...props} className={`${
      className
        ? className
        : "px-6 py-1.5 bg-secondary text-white rounded ml-1 md:mx-1 hover:bg-white hover:text-secondary text-sm font-medium transition duration-300"
    }`}>
        {children}
    </button>
  )
}
