
export default function dropdown({isVisible, children, onClose}) {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "outSide") onClose();
  };

  return (
    <>
        <div 
        className="fixed inset-0 flex justify-end" 
        onClick={handleClose}
        id='outSide'>
          <div className="mt-[60px] mr-8 h-10">
            <div className="triangle-up relative ml-[140px] z-40"></div>
            <div className="relative bg-white rounded shadow py-1">
              {children}
            </div>
          </div>
        </div>
    </>
  )
}
