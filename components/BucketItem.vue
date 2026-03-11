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
        <div class="item-title-wrapper">
          <span class="item-title">{{ item.title }}</span>
        </div>
        <div v-if="item.member" class="item-meta">
          <span class="item-member">by {{ item.member.name }}</span>
        </div>
      </div>
      <Transition name="accordion">
        <div v-if="isOpen && (item.memo || item.url)" class="item-details">
          <div v-if="item.url" class="item-url">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">🔗 {{ item.url }}</a>
          </div>
          <div v-if="item.memo" class="item-memo clickable-memo" @click="$emit('showInfo', item)">{{ item.memo }}</div>
        </div>
      </Transition>
    </div>
    <div class="item-actions">
      <button
        v-if="item.memo || item.url"
        @click="toggleDetails"
        class="btn-icon btn-accordion"
        :class="{ open: isOpen }"
        :title="isOpen ? '詳細を閉じる' : '詳細を表示'"
      >
        ▼
      </button>
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
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

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
  align-self: center;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
}

.item-title-wrapper {
  flex: 1 1 100%;
  min-width: 0;
}

.item-title {
  font-size: 1rem;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.item-member {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--color-text-light);
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

.clickable-memo {
  cursor: pointer;
  padding: 0.25rem;
  margin: -0.25rem;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 101, 0, 0.1);
  }
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

  &.btn-accordion {
    color: var(--color-success);

    &.open {
      transform: rotate(180deg);
    }

    &:hover {
      transform: rotate(0deg) scale(1.1);
    }

    &.open:hover {
      transform: rotate(180deg) scale(1.1);
    }
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
