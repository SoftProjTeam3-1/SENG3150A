// to do: hook here, need to change DB to store database duration in session activity instead of session
// backend will need to be written for this as well.
// For when changing the duration of an activity
export const handleEditDuration = (setShowEditDurationScreen, inputDuration, temporaryActivity) => {
    //setShowEditDurationScreen(prev => !prev);
    const response = await fetch('api/sessionActivity/editDuration',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity: temporaryActivity, duration: inputDuration })
    })

    if (!response.ok) {
        console.error("Error editing duration in backend:", response.statusText);
    } else {
        setShowEditDurationScreen(false);
    }
}

// For when toggling through categories of types of activities
export const toggleCategory = ({categoryName, setOpenCategory, Categories}) => {
    console.log(categoryName);
    setOpenCategory(prev => (prev === categoryName ? null : categoryName));
    console.log(categoryName);
    console.log(Categories);
};