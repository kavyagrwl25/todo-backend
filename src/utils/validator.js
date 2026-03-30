export const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email.trim());
}

export const isValidTitle = (title) => {
    if (!title?.trim()) return false;                  
    const trimmed = title.trim();
    if (trimmed.length > 50) return false; 
    return true;
};

export const isValidDesc = (description) => {
    if (!description) return false;                  
    const trimmed = description.trim();
    if (trimmed.length < 5 || trimmed.length > 300) return false; 
    return true;
};

export const isValidPriority = (priority) => {
    if (!priority) return true;
    const validPriorities = ["Low", "Medium", "High"];
    return validPriorities.includes(priority);
};