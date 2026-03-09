<template>
  <div class="bucket-item-form card">
    <h3>新しい項目を追加</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <input
            v-model="formData.title"
            type="text"
            class="input"
            placeholder="リスト"
            required
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group flex-1">
          <MemberSelector
            v-model="formData.memberName"
            :members="members"
          />
        </div>
        <div class="form-group flex-1">
          <input
            v-model="formData.url"
            type="url"
            class="input"
            placeholder="🔗 URL（任意）"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <textarea
            v-model="formData.memo"
            class="input textarea"
            placeholder="メモ（任意）"
            rows="3"
          ></textarea>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
        追加
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Member } from '~/types'

const props = defineProps<{
  members: Member[]
}>()

const emit = defineEmits<{
  submit: [data: { title: string; memberName: string; memo?: string; url?: string }]
}>()

const formData = reactive({
  title: '',
  memberName: '',
  memo: '',
  url: ''
})

const canSubmit = computed(() => {
  return formData.title.trim() && formData.memberName.trim()
})

const handleSubmit = () => {
  if (canSubmit.value) {
    emit('submit', {
      title: formData.title.trim(),
      memberName: formData.memberName.trim(),
      memo: formData.memo.trim() || undefined,
      url: formData.url.trim() || undefined
    })
    // フォームリセット
    formData.title = ''
    formData.memberName = ''
    formData.memo = ''
    formData.url = ''
  }
}
</script>

<style scoped lang="scss">
.bucket-item-form {
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: var(--color-text);
  }
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
}

.flex-1 {
  flex: 1;
}

.textarea {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}
</style>
