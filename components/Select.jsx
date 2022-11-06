import { Children } from "react";

export default function Select({children, ...props}) {
  return (
    <select {...props} className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary focus:border-gray-200 transition duration-300 bg-gray-100">
        {children}
    </select>
  )
}
