<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleClose">
        <div class="modal-content" @click.stop>
          <h3>新しい項目を追加</h3>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label class="form-label">リスト</label>
              <input
                v-model="formData.title"
                type="text"
                class="input"
                placeholder="例: 富士山に登る"
                required
                autofocus
              />
            </div>
            <div class="form-group">
              <label class="form-label">作成者</label>
              <MemberSelector
                v-model="formData.memberName"
                :members="members"
              />
            </div>
            <div class="form-group">
              <label class="form-label">URL（任意）</label>
              <input
                v-model="formData.url"
                type="url"
                class="input"
                placeholder="https://..."
              />
            </div>
            <div class="form-group">
              <label class="form-label">メモ（任意）</label>
              <textarea
                v-model="formData.memo"
                class="input textarea"
                placeholder="メモを入力"
                rows="3"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="handleClose" class="btn btn-secondary">
                キャンセル
              </button>
              <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
                追加
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Member } from '~/types'

const props = defineProps<{
  isOpen: boolean
  members: Member[]
}>()

const emit = defineEmits<{
  close: []
  submit: [data: { title: string; memberName: string; memo?: string; url?: string }]
}>()

const STORAGE_KEY = 'baketto_last_member_name'

const formData = reactive({
  title: '',
  memberName: '',
  memo: '',
  url: ''
})

const canSubmit = computed(() => {
  return formData.title.trim() && formData.memberName.trim()
})

// localStorage から最後に使った作成者名を読み込む
const loadLastMemberName = () => {
  if (process.client) {
    return localStorage.getItem(STORAGE_KEY) || ''
  }
  return ''
}

// localStorage に作成者名を保存
const saveLastMemberName = (name: string) => {
  if (process.client) {
    localStorage.setItem(STORAGE_KEY, name)
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // ダイアログが開いたらフォームをリセット
    formData.title = ''
    formData.memberName = loadLastMemberName() // 最後に使った作成者名を設定
    formData.memo = ''
    formData.url = ''
  }
})

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  if (canSubmit.value) {
    const memberName = formData.memberName.trim()
    saveLastMemberName(memberName) // 作成者名を保存
    emit('submit', {
      title: formData.title.trim(),
      memberName: memberName,
      memo: formData.memo.trim() || undefined,
      url: formData.url.trim() || undefined
    })
    handleClose()
  }
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: var(--color-text);
}

.textarea {
  resize: vertical;
  min-height: 50px;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>
