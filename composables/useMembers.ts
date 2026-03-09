import type { Member } from '~/types'

export const useMembers = (bucketId: string) => {
  const { supabase } = useSupabase()

  const members = ref<Member[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMembers = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('members')
        .select('*')
        .eq('bucket_id', bucketId)
        .order('name', { ascending: true })

      if (fetchError) throw fetchError
      members.value = data || []
    } catch (e: any) {
      error.value = e.message
      console.error('Error fetching members:', e)
    } finally {
      loading.value = false
    }
  }

  const addMember = async (name: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('members')
        .insert({ bucket_id: bucketId, name })
        .select()
        .single()

      if (insertError) throw insertError
      return data
    } catch (e: any) {
      error.value = e.message
      console.error('Error adding member:', e)
      return null
    } finally {
      loading.value = false
    }
  }

<<<<<<< HEAD
  const deleteMember = async (memberId: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId)

      if (deleteError) throw deleteError
      return true
    } catch (e: any) {
      error.value = e.message
      console.error('Error deleting member:', e)
      return false
    } finally {
      loading.value = false
    }
  }

=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
  return {
    members,
    loading,
    error,
    fetchMembers,
<<<<<<< HEAD
    addMember,
    deleteMember
=======
    addMember
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
  }
}
