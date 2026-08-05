import { useState, useEffect,createContext, useCallback } from "react"
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
        refreshAuth: () => Promise<void>
    }
    
    export const AuthContext = createContext<AuthContextType>({
        user: null,
        loading:true,
        refreshAuth: async () => {},
    })

const AuthProvider = ({children}: {children: React.ReactNode}) => {



    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshAuth = useCallback(async () => {
        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/users`, {
                method:"GET",
                credentials:"include",
            })

            if (!response.ok){
                setUser(null)
                return
            }

            const data = await response.json()
            setUser(data.data)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void refreshAuth()

    },[refreshAuth])
  
  return (
    <AuthContext.Provider value={{user, loading, refreshAuth}}>
        {children}
        
    </AuthContext.Provider>
  )
}

export default AuthProvider