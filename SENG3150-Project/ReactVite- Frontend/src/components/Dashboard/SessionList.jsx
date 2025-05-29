import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SessionList = ({ sessions, selectedSessions, onNewActivity, onSessionClick }) => {
    return (
        <div className="dashboard-sidebar">
            <motion.div 
                className="flex flex-col md:flex-row gap-3 p-4 md:flex-wrap"
                layout
            >
                {sessions.map(({ id, date }) => {
                    if (!date) return null;

                    const [month, day] = date.split(' ');
                    const isSelected = selectedSessions.includes(id);
                    
                    return (
                        <motion.button
                            key={id}
                            layout
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                relative p-4 rounded-xl flex flex-col items-center justify-center
                                transition-all duration-200 min-w-[100px] md:w-full
                                ${isSelected ? 'bg-primary text-white' : 'bg-white text-gray-900 hover:bg-gray-50'}
                                shadow-sm hover:shadow
                            `}
                            onClick={() => onSessionClick(id)}
                        >
                            <span className="text-sm font-medium opacity-80">{month}</span>
                            <span className="text-2xl font-bold mt-1">{day}</span>
                            {isSelected && (
                                <motion.div
                                    layoutId="selection"
                                    className="absolute inset-0 bg-primary rounded-xl -z-10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                        p-4 rounded-xl bg-primary text-white flex items-center justify-center gap-2
                        transition-all duration-200 min-w-[100px] md:w-full hover:bg-primary-dark
                        shadow-sm hover:shadow
                    "
                    onClick={onNewActivity}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-medium">New Session</span>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default SessionList;