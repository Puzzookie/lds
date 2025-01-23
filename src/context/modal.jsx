import React, { createContext, useState, useContext } from 'react';
  const ModalContext = createContext();
  import Modal from "../components/Modal";

  export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState([]);
    const openModal = (modalProps) => {
      if(modals.length === 0)
      {
        setModals([...modals, { id: Date.now(), ...modalProps }]);
      }
    };
    const closeModal = (modalId) => {
      setModals(modals.filter((modal) => modal.id !== modalId));
    };
    return (
      <ModalContext.Provider value={{ modals, openModal, closeModal }}>
        {children}
        {modals.map((modal) => (
          <Modal key={modal.id} {...modal} onClose={() => closeModal(modal.id)} />
        ))}
      </ModalContext.Provider>
    );
  };
  export const useModal = () => {
    const { modals, openModal, closeModal } = useContext(ModalContext);
    const isModalOpen = modals.length > 0; 
    return { isModalOpen, openModal, closeModal };
  };