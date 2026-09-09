import { useState, useEffect,createContext, useCallback } from "react"
import {API_URL} from '../config'
import { fetchWithTransientRetry } from '../api/fetchWithTransientRetry'

    type User = {
        id: number
        first_name: string
        last_name: string
        email: string
        username: string
    }
    
    type AuthContextType = {
        user: User | null
        error: string | null
        loading:boolean
        refreshAuth: () => Promise<void>
    }
    
    export const AuthContext = createContext<AuthContextType>({
        user: null,
        loading:true,
        error: null,
        refreshAuth: async () => {},
    })

const AuthProvider = ({children}: {children: React.ReactNode}) => {



    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refreshAuth = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetchWithTransientRetry(`${API_URL}/users`, {
                method:"GET",
                credentials:"include",
            })

            if (response.status === 401){
                setUser(null)
                return
            }

            if (!response.ok) throw new Error("Could not load account. Please retry.")
            const data = await response.json()
            setUser(data.data)
        } catch {
            setError("Could not load account. Please retry.")
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void refreshAuth()

    },[refreshAuth])
  
  return (
    <AuthContext.Provider value={{user, loading, error, refreshAuth}}>
        {children}
        
    </AuthContext.Provider>
  )
}

export default AuthProvider
