<template>
  <div class="bucket-item" :class="{ completed: item.is_completed }">
    <div class="drag-handle" title="ドラッグして並び替え">
      ⋮⋮
    </div>
    <input
      type="checkbox"
      :checked="item.is_completed"
      @change="$emit('toggleComplete', item.id, !item.is_completed)"
      class="checkbox"
    />
    <div class="item-main">
      <div class="item-header">
        <span class="item-title">{{ item.title }}</span>
        <span v-if="item.member" class="item-member">by {{ item.member.name }}</span>
        <button
          v-if="item.memo || item.url"
          @click="toggleDetails"
          class="btn-accordion"
          :class="{ open: isOpen }"
          :title="isOpen ? '詳細を閉じる' : '詳細を表示'"
        >
          ▼
        </button>
      </div>
      <Transition name="accordion">
        <div v-if="isOpen && (item.memo || item.url)" class="item-details">
          <div v-if="item.url" class="item-url">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">🔗 {{ item.url }}</a>
          </div>
          <div v-if="item.memo" class="item-memo">{{ item.memo }}</div>
        </div>
      </Transition>
    </div>
    <div class="item-actions">
      <button
        @click="$emit('showInfo', item)"
        class="btn-icon"
        title="メモ・URLを編集"
      >
        ✏️
      </button>
      <button
        @click="$emit('delete', item.id)"
        class="btn-icon btn-delete"
        title="削除"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BucketItem } from '~/types'

defineProps<{
  item: BucketItem
}>()

defineEmits<{
  toggleComplete: [id: string, completed: boolean]
  showInfo: [item: BucketItem]
  delete: [id: string]
}>()

const isOpen = ref(false)

const toggleDetails = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped lang="scss">
.bucket-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #FFFAF5;
  }

  &.completed {
    .item-title {
      text-decoration: line-through;
      color: var(--color-text-light);
    }
  }
}

.drag-handle {
  cursor: grab;
  color: var(--color-text-light);
  font-size: 1.2rem;
  line-height: 1;
  user-select: none;
  flex-shrink: 0;
  padding: 0.25rem;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    color: var(--color-primary);
  }
}

.checkbox {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 0.25rem;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.item-title {
  font-size: 1rem;
  color: var(--color-text);
}

.item-member {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-accent);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--color-text);
  font-weight: 500;
}

.btn-accordion {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  color: var(--color-text-light);
  transition: transform 0.3s;
  margin-left: 0.5rem;

  &.open {
    transform: rotate(180deg);
  }

  &:hover {
    color: var(--color-primary);
  }
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 0.5rem;
  border-left: 3px solid var(--color-success);
}

.item-memo {
  font-size: 0.9rem;
  color: var(--color-text);
  line-height: 1.4;
}

.item-url {
  font-size: 0.85rem;

  a {
    color: var(--color-info);
    text-decoration: none;
    word-break: break-all;

    &:hover {
      text-decoration: underline;
    }
  }
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  align-self: flex-start;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &.btn-delete:hover {
    filter: brightness(0.8);
  }
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
