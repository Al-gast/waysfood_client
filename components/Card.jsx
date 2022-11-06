export default function Card({children, className, ...props}) {
  return (
    <a {...props} className={`${
      className
        ? className
        : "block p-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-primary/50 active:bg-primary transition duration-300 cursor-pointer"
    }`}>
        {children}
    </a>
  )
}
