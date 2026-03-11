export interface Bucket {
  id: string
  title: string
  memo: string | null
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  bucket_id: string
  name: string
  created_at: string
}

export interface BucketItem {
  id: string
  bucket_id: string
  member_id: string | null
  member?: Member
  title: string
  memo: string | null
  url: string | null
  is_completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
  display_order: number
}

export interface CreateBucketItemInput {
  title: string
  member_name: string
  memo?: string
  url?: string
}

export interface UpdateBucketItemInput {
  title?: string
  member_id?: string
  memo?: string
  url?: string
  is_completed?: boolean
  display_order?: number
}
