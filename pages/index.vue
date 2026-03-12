<template>
  <div class="container">
    <div class="card create-form">
      <h2>新しいバケットリストを作成</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label class="form-label">タイトル</label>
          <input
            v-model="newBucketTitle"
            type="text"
            class="input"
            placeholder="例: 2026年にやりたいこと"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">メモ（任意）</label>
          <textarea
            v-model="newBucketMemo"
            class="input textarea"
            placeholder="このバケットリストについてのメモ"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">メンバー</label>
          <MemberInput v-model="members" />
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!canCreate || loading"
          >
            {{ loading ? '作成中...' : '作成' }}
          </button>
        </div>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div v-if="buckets.length > 0" class="bucket-list">
      <h2>Your Buketto</h2>
      <BucketListCard
        v-for="bucket in buckets"
        :key="bucket.id"
        :bucket="bucket"
      />
    </div>

    <div v-if="visitedBuckets.length > 0" class="bucket-list visited-list">
      <h2>最近アクセスしたBuketto</h2>
      <BucketListCard
        v-for="bucket in visitedBuckets"
        :key="bucket.id"
        :bucket="bucket"
      />
    </div>

    <div v-if="buckets.length === 0 && visitedBuckets.length === 0 && !loading" class="empty-state">
      <p>まだバケットリストがありません。<br>上のフォームから作成してみましょう！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { buckets, visitedBuckets, loading, error, fetchBuckets, fetchVisitedBuckets, createBucket } = useBucketList()

const newBucketTitle = ref('')
const newBucketMemo = ref('')
const members = ref<string[]>([])

const canCreate = computed(() => {
  return newBucketTitle.value.trim() && members.value.length > 0
})

const handleCreate = async () => {
  if (!canCreate.value) return

  const bucket = await createBucket(newBucketTitle.value.trim(), members.value, newBucketMemo.value.trim() || undefined)
  if (bucket) {
    // 作成成功したら詳細ページへ遷移
    await router.push(`/bucket/${bucket.id}`)
  }
}

// 初期データ取得
onMounted(() => {
  fetchBuckets()
  fetchVisitedBuckets()
})
</script>

<style scoped lang="scss">
.create-form {
  margin-bottom: 2.5rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
}

.textarea {
  resize: vertical;
  min-height: 50px;
  font-family: inherit;
}

.form-actions {
  text-align: center;
  margin-top: 0.5rem;
}

.bucket-list {
  h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }

  &.visited-list {
    margin-top: 3rem;

    h2 {
      color: var(--color-text-light);
    }
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-light);

  p {
    font-size: 1.1rem;
    line-height: 1.8;
  }
}
</style>
