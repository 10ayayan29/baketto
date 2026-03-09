export const useRealtimeSync = (bucketId: string, onUpdate: () => void) => {
  const { supabase } = useSupabase()

  const channel = ref<any>(null)

  const startSync = () => {
    channel.value = supabase
      .channel(`bucket:${bucketId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bucket_items',
          filter: `bucket_id=eq.${bucketId}`
        },
        (payload) => {
          console.log('Realtime update (bucket_items):', payload)
          onUpdate()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
          filter: `bucket_id=eq.${bucketId}`
        },
        (payload) => {
          console.log('Realtime update (members):', payload)
          onUpdate()
        }
      )
      .subscribe()
  }

  const stopSync = () => {
    if (channel.value) {
      supabase.removeChannel(channel.value)
      channel.value = null
    }
  }

  onMounted(() => {
    startSync()
  })

  onUnmounted(() => {
    stopSync()
  })

  return {
    startSync,
    stopSync
  }
}
