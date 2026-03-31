export const isValidEmail = (email) => {
    if(typeof email !== "string") return false;
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email.trim());
}

export const isValidTitle = (title) => {
    if (typeof title !== "string") return false;
    const trimmed = title.trim();
    return trimmed.length > 0 && trimmed.length <= 50;
};

export const isValidDesc = (description) => {
    if (typeof description !== "string") return false;
    const trimmed = description.trim();
    if (!trimmed) return false;
    if (trimmed.length < 5 || trimmed.length > 300) return false;
    return true;
};

export const isValidPriority = (priority) => {
    if (!priority) return true;
    const validPriorities = ["Low", "Medium", "High"];
    return validPriorities.includes(priority);
};