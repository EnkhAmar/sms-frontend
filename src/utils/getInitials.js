const getInitials = (name) => {
    const words = name.split(' ')

    const first_char = words[0][0].toUpperCase()

    const last_char = words.length > 1 && words[words.length-1] !== "" ? words[words.length-1][0].toUpperCase() : ""
    const initials = first_char + last_char
    return initials
}

export default getInitials
