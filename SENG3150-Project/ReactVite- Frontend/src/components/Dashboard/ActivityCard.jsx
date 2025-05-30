import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityCard = ({ session, onNotesChange, onActivityRemove }) => {
    const { id, date, type, notes, activities } = session;
    const [month, day] = date.split(' ');
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div 
            layout
            className="activity-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div 
                className="bg-primary p-4 text-white rounded-t-lg"
                layoutId={`header-${id}`}
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">{month} {day}</h2>
                        <p className="text-white/90 text-sm">
                            {type === 'game' ? '🏆 Game Session' : '🏃‍♂️ Training Session'}
                        </p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <motion.svg 
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            className="w-6 h-6"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={`${activity.name}-${index}`}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-start group
                                             hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                                        <div className="text-primary font-medium mt-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {activity.duration} minutes
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onActivityRemove(id, activity)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2
                                                 hover:bg-red-50 rounded-full text-red-500"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            ))}

                            <motion.div 
                                layout
                                className="mt-4"
                            >
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-lg
                                             focus:ring-2 focus:ring-primary focus:border-transparent
                                             transition-all resize-none text-gray-700"
                                    placeholder="Add session notes..."
                                    value={notes}
                                    onChange={(e) => onNotesChange(id, e.target.value)}
                                    rows="4"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ActivityCard;