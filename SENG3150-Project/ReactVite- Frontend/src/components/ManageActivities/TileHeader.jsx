import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export const TileHead = ({ categoryName, onHeaderClick }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    

    async function handleDeleteActivityType() {
        try {
            await api.post('/api/activityType/delete', { name: categoryName, description: null });
            if (onHeaderClick) {
                onHeaderClick(categoryName); // tell TileLayoutContainer to update
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    }

    const handleConfirmation = () => {
        setConfirmationMessage(`Are you sure you want to delete category "${categoryName}"?`);
        setShowConfirmation(true);
    };

    return (
        <>
            <div className="relative group px-2 py-1">
                <span>{categoryName}</span>
                <button
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={handleConfirmation}
                    title="Remove"
                >
                    <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                </button>
            </div>
            {showConfirmation && ReactDOM.createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">{confirmationMessage}</h3>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                className="bg-[#202C39] hover:bg-[#8C9195] transition-colors duration-200 text-white border-none rounded px-3 py-1 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleDeleteActivityType();
                                    setShowConfirmation(false);
                                }}
                                className="hover:bg-[#8C9195] transition-colors duration-200 text-[#202C39] border-none rounded px-4 py-2 cursor-pointer"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>,
                document.getElementById('form-root')
            )}
        </>
    );
};

export default TileHead;
