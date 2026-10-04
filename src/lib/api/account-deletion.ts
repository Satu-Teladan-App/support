import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface DeletionRequestData {
  reason: string
  email: string
}

interface DeletionRequest {
  id: string
  user_id: string | null
  reason: string | null
  status: string
  requested_at: string
  processed_at: string | null
  processed_by: string | null
  metadata: any
  created_at: string
  updated_at: string
}

/**
 * Submit a request to delete user account
 */
export async function submitDeletionRequest(data: DeletionRequestData) {
  const supabase = getSupabaseBrowserClient()
  
  // Get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    throw new Error('User must be authenticated')
  }

  const response = await fetch('/api/account-deletion/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to submit deletion request')
  }

  return response.json()
}

/**
 * Get user's deletion request status
 */
export async function getDeletionRequestStatus(): Promise<DeletionRequest[]> {
  const supabase = getSupabaseBrowserClient()
  
  // Get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    throw new Error('User must be authenticated')
  }

  const response = await fetch('/api/account-deletion/request', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get deletion request status')
  }

  const result = await response.json()
  return result.data
}

/**
 * Check if user is authenticated via API
 */
export async function checkAuthStatus() {
  const supabase = getSupabaseBrowserClient()
  
  // Get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    return { authenticated: false, user: null }
  }

  const response = await fetch('/api/auth/check', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  })

  if (!response.ok) {
    return { authenticated: false, user: null }
  }

  return response.json()
}
