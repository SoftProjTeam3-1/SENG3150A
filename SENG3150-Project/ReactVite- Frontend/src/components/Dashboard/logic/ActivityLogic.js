
// For when changing the duration of an activity
export const handleEditDuration = (setShowEditDurationScreen) => {
    setShowEditDurationScreen(prev => !prev);
}

// For when toggling through categories of types of activities
export const toggleCategory = ({categoryName, setOpenCategory, Categories}) => {
    console.log(categoryName);
    setOpenCategory(prev => (prev === categoryName ? null : categoryName));
    console.log(categoryName);
    console.log(Categories);
};