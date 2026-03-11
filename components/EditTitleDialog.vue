<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleClose">
        <div class="modal-content" @click.stop>
          <h3>バケットリストを編集</h3>
          <form @submit.prevent="handleSave">
            <div class="form-group">
              <label class="form-label">タイトル</label>
              <input
                v-model="localTitle"
                type="text"
                class="input"
                placeholder="タイトル"
                required
                autofocus
              />
            </div>
            <div class="form-group">
              <label class="form-label">メモ（任意）</label>
              <textarea
                v-model="localMemo"
                class="input textarea"
                placeholder="このバケットリストについてのメモ"
                rows="3"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="handleClose" class="btn btn-secondary">
                キャンセル
              </button>
              <button type="submit" class="btn btn-primary">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  title: string
  memo: string | null
  bucketId: string
}>()

const emit = defineEmits<{
  close: []
  save: [bucketId: string, title: string, memo: string]
}>()

const localTitle = ref('')
const localMemo = ref('')

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    localTitle.value = props.title
    localMemo.value = props.memo || ''
  }
})

const handleClose = () => {
  emit('close')
}

const handleSave = () => {
  if (localTitle.value.trim()) {
    emit('save', props.bucketId, localTitle.value.trim(), localMemo.value.trim())
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
