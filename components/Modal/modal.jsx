export default function Modal({isVisible, children, onClose}) {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "outSide") onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center" 
      onClick={handleClose}
      id='outSide'>
        <div className="md:w-1/3">
          <div className="relative bg-white rounded-lg shadow px-5 py-5">
            {children}
          </div>
        </div>
    </div>
  )
}
