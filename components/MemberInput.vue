<template>
  <div class="member-input">
    <label class="form-label">メンバー</label>
    <div class="input-group">
      <input
        v-model="inputValue"
        type="text"
        class="input"
        placeholder="メンバー名を入力"
        @keyup.enter="addMember"
      />
      <button @click="addMember" class="btn btn-secondary btn-small">
        追加
      </button>
    </div>
    <div v-if="modelValue.length > 0" class="tags">
      <div v-for="(member, index) in modelValue" :key="index" class="tag">
        {{ member }}
        <button @click="removeMember(index)">&times;</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const inputValue = ref('')

const addMember = () => {
  const trimmed = inputValue.value.trim()
  if (trimmed && !props.modelValue.includes(trimmed)) {
    emit('update:modelValue', [...props.modelValue, trimmed])
    inputValue.value = ''
  }
}

const removeMember = (index: number) => {
  const newMembers = [...props.modelValue]
  newMembers.splice(index, 1)
  emit('update:modelValue', newMembers)
}
</script>

<style scoped lang="scss">
.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.input {
  flex: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
