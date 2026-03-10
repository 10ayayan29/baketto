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

        <MemberInput v-model="members" />

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!canCreate || loading"
        >
          {{ loading ? '作成中...' : '作成' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div v-if="buckets.length > 0" class="bucket-list">
      <h2>Your Baketto</h2>
      <BucketListCard
        v-for="bucket in buckets"
        :key="bucket.id"
        :bucket="bucket"
      />
    </div>

    <div v-else-if="!loading" class="empty-state">
      <p>まだバケットリストがありません。<br>上のフォームから作成してみましょう！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { buckets, loading, error, fetchBuckets, createBucket } = useBucketList()

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
})
</script>

<style scoped lang="scss">
.create-form {
  margin-bottom: 3rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--color-text);
  }
}

.textarea {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

.bucket-list {
  h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--color-text);
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
