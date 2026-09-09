import { useEffect, useState } from 'react'
import { API_URL } from '../../config'
import type { Creature } from './types'
import { fetchWithTransientRetry } from '../../api/fetchWithTransientRetry'

export function useCreature(userID: number | undefined) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ userID?: number; creature?: Creature; error?: string }>({})
  useEffect(() => {
    if (userID === undefined) return
    const controller = new AbortController()
    setState({ userID })
    void (async () => {
      try {
        const response = await fetchWithTransientRetry(API_URL + '/creatures/starter', { method: 'POST', credentials: 'include', signal: controller.signal })
        if (!response.ok) throw new Error(response.status === 401 ? 'Your session expired. Sign in again.' : 'Could not load your Habitmon. Please retry.')
        const result: { data: Creature } = await response.json()
        if (result.data.user_id !== userID) throw new Error('Habitmon owner did not match your account.')
        // During a rolling backend/frontend restart, older responses can omit
        // newly optional fields. Normalize them to the API's nullable contract.
        const creature = {
          ...result.data,
          tail_variant: result.data.tail_variant ?? null,
          horn_variant: result.data.horn_variant ?? null,
          palette_variant: result.data.palette_variant ?? 'ocean',
        }
        if (!controller.signal.aborted) setState({ userID, creature })
      } catch (error) {
        if (!controller.signal.aborted) setState({ userID, error: error instanceof Error ? error.message : 'Could not load your Habitmon.' })
      }
    })()
    return () => controller.abort()
  }, [userID, attempt])
  return { ...(state.userID === userID ? state : {}), retry: () => setAttempt(value => value + 1) }
}
