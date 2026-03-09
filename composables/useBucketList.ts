import type { Bucket } from '~/types'

export const useBucketList = () => {
  const { supabase } = useSupabase()

  const buckets = ref<Bucket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBuckets = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('buckets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (fetchError) throw fetchError
      buckets.value = data || []
    } catch (e: any) {
      error.value = e.message
      console.error('Error fetching buckets:', e)
    } finally {
      loading.value = false
    }
  }

  const createBucket = async (title: string, memberNames: string[]) => {
    loading.value = true
    error.value = null

    // バリデーション: 最低1人のメンバーが必要
    if (memberNames.length === 0) {
      error.value = '最低1人のメンバーを追加してください'
      loading.value = false
      return null
    }

    try {
      // バケットリスト作成
      const { data: bucket, error: bucketError } = await supabase
        .from('buckets')
        .insert({ title })
        .select()
        .single()

      if (bucketError) throw bucketError

      // メンバーを一括登録
      const members = memberNames.map(name => ({
        bucket_id: bucket.id,
        name
      }))

      const { error: membersError } = await supabase
        .from('members')
        .insert(members)

      if (membersError) throw membersError

      return bucket
    } catch (e: any) {
      error.value = e.message
      console.error('Error creating bucket:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    buckets,
    loading,
    error,
    fetchBuckets,
    createBucket
  }
}
