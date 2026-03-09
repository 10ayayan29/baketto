<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button @click="$emit('close')" class="close-btn">&times;</button>
          </div>
          <form @submit.prevent="handleSubmit" class="modal-body">
            <div class="form-group">
              <label class="form-label">メモ</label>
              <textarea
                v-model="localMemo"
                class="input textarea"
                placeholder="メモを入力..."
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">🔗 URL</label>
              <input
                v-model="localUrl"
                type="url"
                class="input"
                placeholder="https://example.com"
              />
            </div>

            <div class="form-actions">
              <button type="button" @click="$emit('close')" class="btn btn-secondary">
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
  url: string | null
  itemId: string
}>()

const emit = defineEmits<{
  close: []
  save: [itemId: string, memo: string, url: string]
}>()

const localMemo = ref(props.memo || '')
const localUrl = ref(props.url || '')

// propsが変更されたらローカルの値も更新
watch(() => props.memo, (newMemo) => {
  localMemo.value = newMemo || ''
})

watch(() => props.url, (newUrl) => {
  localUrl.value = newUrl || ''
})

const handleSubmit = () => {
  emit('save', props.itemId, localMemo.value, localUrl.value)
  emit('close')
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--color-text);
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-text);
  }
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn-secondary {
  background: var(--color-background);
  color: var(--color-text);

  &:hover {
    background: #F5E8D8;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;

  .modal-content {
    transition: transform 0.3s;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: scale(0.9);
  }
}
</style>
