import { useState, useEffect,createContext } from "react"
import {API_URL} from '../config'

    type User = {
        id: number
        first_name: string
        last_name: string
        email: string
        username: string
    }
    
    type AuthContextType = {
        user: User | null
        loading:boolean
    }
    
    export const AuthContext = createContext<AuthContextType>({
        user: null,
        loading:true,
    })

const AuthProvider = ({children}: {children: React.ReactNode}) => {



    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const response = await fetch(`${API_URL}/users`, {
                method: 'GET',
                credentials: 'include',
            })
            if (response.ok){
                const data = await response.json()
                setUser(data.data)
            }
            setLoading(false)
        }
        checkAuth()

    },[])
  
  return (
    <AuthContext.Provider value={{user, loading}}>
        {children}
        
    </AuthContext.Provider>
  )
}

export default AuthProvider