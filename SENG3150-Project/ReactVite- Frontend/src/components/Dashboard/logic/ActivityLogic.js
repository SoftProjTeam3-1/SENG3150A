// to do: hook here, need to change DB to store database duration in session activity instead of session
// backend will need to be written for this as well.
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