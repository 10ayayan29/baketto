<template>
  <NuxtLink :to="`/bucket/${bucket.id}`" class="bucket-card card">
    <div class="bucket-title">📋 {{ bucket.title }}</div>
    <div class="bucket-date">作成日: {{ formatDate(bucket.created_at) }}</div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Bucket } from '~/types'

defineProps<{
  bucket: Bucket
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped lang="scss">
.bucket-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.bucket-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.bucket-date {
  font-size: 0.9rem;
  color: var(--color-text-light);
}
</style>
