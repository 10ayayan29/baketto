import type { Bucket } from '~/types'

<<<<<<< HEAD
const STORAGE_KEY = 'baketto_my_buckets'

// LocalStorageから自分のバケットリストIDを取得
const getMyBucketIds = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// LocalStorageに自分のバケットリストIDを保存
const saveMyBucketId = (bucketId: string) => {
  if (typeof window === 'undefined') return
  const ids = getMyBucketIds()
  if (!ids.includes(bucketId)) {
    ids.push(bucketId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }
}

=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
export const useBucketList = () => {
  const { supabase } = useSupabase()

  const buckets = ref<Bucket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBuckets = async () => {
    loading.value = true
    error.value = null
    try {
<<<<<<< HEAD
      // 自分の端末で作成したバケットリストIDを取得
      const myBucketIds = getMyBucketIds()

      if (myBucketIds.length === 0) {
        buckets.value = []
        return
      }

      // 自分が作成したバケットリストのみ取得
      const { data, error: fetchError } = await supabase
        .from('buckets')
        .select('*')
        .in('id', myBucketIds)
        .order('created_at', { ascending: false })
=======
      const { data, error: fetchError } = await supabase
        .from('buckets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40

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

<<<<<<< HEAD
      // LocalStorageに保存（この端末で作成したことを記録）
      saveMyBucketId(bucket.id)

=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
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
