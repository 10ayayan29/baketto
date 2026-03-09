<template>
  <div class="member-selector">
    <select
      v-model="selectedMemberId"
      class="input"
      @change="handleSelectChange"
    >
      <option value="">メンバーを選択</option>
      <option
        v-for="member in members"
        :key="member.id"
        :value="member.name"
      >
        {{ member.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Member } from '~/types'

const props = defineProps<{
  members: Member[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedMemberId = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  selectedMemberId.value = newValue
})

const handleSelectChange = () => {
  emit('update:modelValue', selectedMemberId.value)
}
</script>

<style scoped lang="scss">
.member-selector {
  width: 100%;
}
</style>
