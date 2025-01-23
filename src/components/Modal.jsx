import React, {useState} from 'react';

const Modal = ({ isOpen, onClose, title, message, onAction = null, cancelMessage = "Cancel" }) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  /*
    Two types of modals

    ONE AND DONE

    openModal({
      title: "Error",
      message: error.message,
      cancelMessage: 'OK',
      isOpen: true,
    });
    
    CONFIRMATION
    MAKE SURE isOpen PROPERTY IS TRUE

    const modalId = openModal({
      title: "Sign Out",
      message: "Are you sure you want to logout?",
      onAction: async () => { 
        await actualLogout();
        closeModal(modalId); 
      },
      cancelMessage: 'No',
      isOpen: true,
    });

  */

  const handleConfirm = async () => {
    if (onAction) {
      try {
        setLoading(true);
        await onAction();
        onClose();
      } catch (error) {
        console.error("Error during action:", error);
      }
      finally
      {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-gray-800 rounded-lg shadow-lg z-10 max-w-sm w-full p-6 mx-4 bg-gray-700 border border-gray-600 rounded">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-white">{message}</p>
        <div className="mt-4 flex justify-end">
        {onAction && ( 
          <button
              onClick={handleConfirm}
              className={`bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              Yes
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            {cancelMessage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
