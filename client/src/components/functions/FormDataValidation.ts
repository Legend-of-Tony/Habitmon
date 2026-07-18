export type FormData = {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
}

export const validateFormData = (data: FormData): string => {
    	
            if (data.email === "") return "email field is blank"
            if (!data.email.includes("@")) return "not valid email"
            if (data.firstName === "") return "first name field is blank"
            if (data.lastName === "") return "last name field is blank"
            if (data.username === "") return "username field is blank"
            if (data.password === "") return "password field is blank"
            if (data.password.length < 8) return "password is too short"
            return "" 
}
