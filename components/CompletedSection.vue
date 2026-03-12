<template>
  <div v-if="items.length > 0" class="completed-section">
    <button @click="isOpen = !isOpen" class="accordion-toggle">
      <span>✓ 完了済み ({{ items.length }}件)</span>
      <span class="toggle-icon" :class="{ open: isOpen }">▼</span>
    </button>
    <Transition name="accordion">
      <div v-show="isOpen" class="accordion-content">
        <BucketItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          @toggle-complete="(id, completed) => $emit('toggleComplete', id, completed)"
          @show-info="$emit('showInfo', $event)"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { BucketItem } from '~/types'

defineProps<{
  items: BucketItem[]
}>()

defineEmits<{
  toggleComplete: [id: string, completed: boolean]
  showInfo: [item: BucketItem]
}>()

const isOpen = ref(false)
</script>

<style scoped lang="scss">
.completed-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid var(--color-success);
}

.accordion-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-background);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  transition: background 0.2s;

  &:hover {
    background: #F5E8D8;
  }
}

.toggle-icon {
  transition: transform 0.3s;

  &.open {
    transform: rotate(180deg);
  }
}

.accordion-content {
  margin-top: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
