import type { BucketItem, CreateBucketItemInput, UpdateBucketItemInput } from '~/types'

export const useBucketItems = (bucketId: string) => {
  const { supabase } = useSupabase()

  const items = ref<BucketItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchItems = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('bucket_items')
        .select(`
          *,
          member:members(*)
        `)
        .eq('bucket_id', bucketId)
        .order('is_completed', { ascending: true })
        .order('display_order', { ascending: true })

      if (fetchError) throw fetchError
      items.value = data || []
    } catch (e: any) {
      error.value = e.message
      console.error('Error fetching items:', e)
    } finally {
      loading.value = false
    }
  }

  const addItem = async (input: CreateBucketItemInput) => {
    loading.value = true
    error.value = null
    try {
      // メンバー取得または作成
      const { data: existingMember } = await supabase
        .from('members')
        .select('*')
        .eq('bucket_id', bucketId)
        .eq('name', input.member_name)
        .single()

      let memberId = existingMember?.id

      if (!existingMember) {
        const { data: newMember, error: memberError } = await supabase
          .from('members')
          .insert({ bucket_id: bucketId, name: input.member_name })
          .select()
          .single()

        if (memberError) throw memberError
        memberId = newMember?.id
      }

      // アイテム追加
      const { data, error: insertError } = await supabase
        .from('bucket_items')
        .insert({
          bucket_id: bucketId,
          member_id: memberId,
          title: input.title,
          memo: input.memo || null,
          url: input.url || null
        })
        .select()
        .single()

      if (insertError) throw insertError
      return data
    } catch (e: any) {
      error.value = e.message
      console.error('Error adding item:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (itemId: string, input: UpdateBucketItemInput) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('bucket_items')
        .update(input)
        .eq('id', itemId)
        .select()
        .single()

      if (updateError) throw updateError
      return data
    } catch (e: any) {
      error.value = e.message
      console.error('Error updating item:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (itemId: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('bucket_items')
        .delete()
        .eq('id', itemId)

      if (deleteError) throw deleteError
      return true
    } catch (e: any) {
      error.value = e.message
      console.error('Error deleting item:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const toggleComplete = async (itemId: string, isCompleted: boolean) => {
    return await updateItem(itemId, { is_completed: isCompleted })
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    toggleComplete
  }
}
