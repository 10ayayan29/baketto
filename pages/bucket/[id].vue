<template>
  <div class="container">
    <div v-if="loading && !bucket" class="loading">読み込み中...</div>

    <div v-else-if="bucket">
      <div class="header">
        <h1>{{ bucket.title }}</h1>
        <div v-if="members.length > 0" class="members-section">
          <div class="members-list">
            <span v-for="member in members" :key="member.id" class="member-tag">
              👤 {{ member.name }}
<<<<<<< HEAD
              <button @click="handleDeleteMember(member.id)" class="btn-remove-member" title="メンバーを削除">
                ×
              </button>
=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
            </span>
          </div>
          <button @click="showAddMemberDialog = true" class="btn-add-member" title="メンバーを追加">
            + メンバー追加
          </button>
        </div>
      </div>

      <NuxtLink to="/" class="back-button-fixed">
        ← 戻る
      </NuxtLink>

<<<<<<< HEAD
      <button @click="handleCopyUrl" class="copy-url-button-fixed" :class="{ copied: urlCopied }">
        {{ urlCopied ? '✓ コピー完了' : '🔗 URLをコピー' }}
      </button>

=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
      <BucketItemForm
        :members="members"
        @submit="handleAddItem"
      />

      <div class="items-container">
        <div v-if="activeItems.length > 0" class="active-items">
          <BucketItem
            v-for="item in activeItems"
            :key="item.id"
            :item="item"
            @toggle-complete="handleToggleComplete"
            @show-info="handleShowInfo"
            @delete="handleDeleteItem"
          />
        </div>

        <div v-else class="empty-state">
          <p>まだ項目がありません。<br>上のフォームから追加してみましょう！</p>
        </div>

        <CompletedSection
          :items="completedItems"
          @toggle-complete="handleToggleComplete"
          @show-info="handleShowInfo"
          @delete="handleDeleteItem"
        />
      </div>
    </div>

    <div v-else class="error">
      バケットリストが見つかりませんでした
    </div>

    <EditInfoDialog
      :is-open="isDialogOpen"
      :title="dialogTitle"
      :memo="dialogMemo"
      :url="dialogUrl"
      :item-id="dialogItemId"
      @close="isDialogOpen = false"
      @save="handleSaveInfo"
    />

    <AddMemberDialog
      :is-open="showAddMemberDialog"
      @close="showAddMemberDialog = false"
      @add="handleAddMember"
    />
  </div>
</template>

<script setup lang="ts">
import type { BucketItem } from '~/types'

const route = useRoute()
const bucketId = route.params.id as string

const { supabase } = useSupabase()
const bucket = ref<any>(null)
const loading = ref(true)

const { items, fetchItems, addItem, toggleComplete, updateItem, deleteItem } = useBucketItems(bucketId)
<<<<<<< HEAD
const { members, fetchMembers, addMember, deleteMember } = useMembers(bucketId)
=======
const { members, fetchMembers, addMember } = useMembers(bucketId)
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40

const isDialogOpen = ref(false)
const dialogTitle = ref('')
const dialogMemo = ref<string | null>(null)
const dialogUrl = ref<string | null>(null)
const dialogItemId = ref('')

const showAddMemberDialog = ref(false)
<<<<<<< HEAD
const urlCopied = ref(false)
=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40

// 未完了と完了済みに分ける
const activeItems = computed(() => items.value.filter(item => !item.is_completed))
const completedItems = computed(() => items.value.filter(item => item.is_completed))

// バケットリスト情報取得
const fetchBucket = async () => {
  const { data, error } = await supabase
    .from('buckets')
    .select('*')
    .eq('id', bucketId)
    .single()

  if (error) {
    console.error('Error fetching bucket:', error)
  } else {
    bucket.value = data
  }
}

// アイテム追加
const handleAddItem = async (data: { title: string; memberName: string; memo?: string; url?: string }) => {
  const result = await addItem({
    title: data.title,
    member_name: data.memberName,
    memo: data.memo,
    url: data.url
  })

  if (result) {
    await Promise.all([
      fetchItems(),
      fetchMembers()
    ])
  }
}

// 完了切り替え
const handleToggleComplete = async (id: string, completed: boolean) => {
  await toggleComplete(id, completed)
  await fetchItems()
}

// メモ・URL表示・編集
const handleShowInfo = (item: BucketItem) => {
  dialogItemId.value = item.id
  dialogTitle.value = item.title
  dialogMemo.value = item.memo
  dialogUrl.value = item.url
  isDialogOpen.value = true
}

// メモ・URL保存
const handleSaveInfo = async (itemId: string, memo: string, url: string) => {
  await updateItem(itemId, {
    memo: memo || null,
    url: url || null
  })
  await fetchItems()
}

// メンバー追加
const handleAddMember = async (name: string) => {
  const result = await addMember(name)
  if (result) {
    await fetchMembers()
  }
}

<<<<<<< HEAD
// メンバー削除
const handleDeleteMember = async (memberId: string) => {
  if (confirm('このメンバーを削除しますか？関連する項目は残りますが、メンバー情報が削除されます。')) {
    const result = await deleteMember(memberId)
    if (result) {
      await Promise.all([
        fetchMembers(),
        fetchItems() // メンバー削除後、アイテムも再取得
      ])
    }
  }
}

=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
// アイテム削除
const handleDeleteItem = async (id: string) => {
  if (confirm('この項目を削除しますか？')) {
    await deleteItem(id)
    await fetchItems()
  }
}

<<<<<<< HEAD
// URLをコピー
const handleCopyUrl = async () => {
  try {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    urlCopied.value = true
    setTimeout(() => {
      urlCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('URLのコピーに失敗しました:', error)
    alert('URLのコピーに失敗しました')
  }
}

=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
// データ再取得（リアルタイム同期用）
const refreshData = async () => {
  await Promise.all([
    fetchItems(),
    fetchMembers()
  ])
}

// リアルタイム同期設定
useRealtimeSync(bucketId, refreshData)

// 初期データ取得
onMounted(async () => {
  loading.value = true
  await Promise.all([
    fetchBucket(),
    fetchItems(),
    fetchMembers()
  ])
  loading.value = false
})
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 2rem;
  text-align: center;
}

.back-button-fixed {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 50;
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(255, 101, 0, 0.3);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 101, 0, 0.4);
  }

  @media (max-width: 640px) {
    bottom: 1rem;
    left: 1rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

<<<<<<< HEAD
.copy-url-button-fixed {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  background: var(--color-success);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
  }

  &.copied {
    background: var(--color-info);
  }

  @media (max-width: 640px) {
    bottom: 1rem;
    right: 1rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
h1 {
  color: var(--color-primary);
  font-size: 2rem;
  margin: 0;
}

.items-container {
  margin-top: 2rem;
}

.active-items {
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-light);

  p {
    font-size: 1.1rem;
    line-height: 1.8;
  }
}

.members-section {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.members-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.member-tag {
<<<<<<< HEAD
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
=======
  display: inline-block;
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
  padding: 0.25rem 0.75rem;
  background: var(--color-accent);
  color: var(--color-text);
  border-radius: 20px;
  font-size: 0.9rem;
}

<<<<<<< HEAD
.btn-remove-member {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }
}

=======
>>>>>>> 8a662116f5c64425cb8cf466e7ed064fa2db0b40
.btn-add-member {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}
</style>
