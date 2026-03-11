<template>
  <div class="container">
    <div v-if="loading && !bucket" class="loading">読み込み中...</div>

    <div v-else-if="bucket">
      <div class="header">
        <div class="title-section">
          <h1 @click="showEditTitleDialog = true" class="clickable-title" title="クリックして編集">
            {{ bucket.title }}
          </h1>
        </div>
        <div v-if="bucket.memo" @click="showEditTitleDialog = true" class="bucket-memo clickable-memo" title="クリックして編集">
          {{ bucket.memo }}
        </div>
        <div v-if="members.length > 0" class="members-section">
          <div class="members-list">
            <span v-for="member in members" :key="member.id" class="member-tag">
              {{ member.name }}
              <button @click="handleDeleteMember(member.id)" class="btn-remove-member" title="メンバーを削除">
                ×
              </button>
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

      <button @click="handleCopyUrl" class="copy-url-button-fixed" :class="{ copied: urlCopied }">
        {{ urlCopied ? '✓ コピー完了' : '🔗 URLをコピー' }}
      </button>

      <div class="add-item-button-wrapper">
        <button @click="showAddItemDialog = true" class="btn-add-item">
          + 新しいリストを追加
        </button>
      </div>

      <div class="items-container">
        <div v-if="activeItems.length > 0" class="active-items">
          <draggable
            v-model="draggableActiveItems"
            item-key="id"
            @end="handleDragEnd"
            handle=".drag-handle"
          >
            <template #item="{ element }">
              <BucketItem
                :item="element"
                @toggle-complete="handleToggleComplete"
                @show-info="handleShowInfo"
                @delete="handleDeleteItem"
              />
            </template>
          </draggable>
        </div>

        <div v-else class="empty-state">
          <p>まだ項目がありません。<br>上のボタンから追加してみましょう！</p>
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
      :member-name="dialogMemberName"
      :memo="dialogMemo"
      :url="dialogUrl"
      :item-id="dialogItemId"
      :members="members"
      @close="isDialogOpen = false"
      @save="handleSaveInfo"
    />

    <AddMemberDialog
      :is-open="showAddMemberDialog"
      @close="showAddMemberDialog = false"
      @add="handleAddMember"
    />

    <EditTitleDialog
      :is-open="showEditTitleDialog"
      :title="bucket?.title || ''"
      :memo="bucket?.memo || null"
      :bucket-id="bucketId"
      @close="showEditTitleDialog = false"
      @save="handleSaveBucket"
    />

    <AddItemDialog
      :is-open="showAddItemDialog"
      :members="members"
      @close="showAddItemDialog = false"
      @submit="handleAddItem"
    />
  </div>
</template>

<script setup lang="ts">
import type { BucketItem } from '~/types'
import draggable from 'vuedraggable'

const route = useRoute()
const bucketId = route.params.id as string

const { supabase } = useSupabase()
const bucket = ref<any>(null)
const loading = ref(true)

const { items, fetchItems, addItem, toggleComplete, updateItem, deleteItem, updateDisplayOrders } = useBucketItems(bucketId)
const { members, fetchMembers, addMember, deleteMember } = useMembers(bucketId)
const { updateBucket } = useBucketList()

// 訪問履歴保存用の関数をインポート
const { saveVisitedBucketId } = await import('~/composables/useBucketList')

const isDialogOpen = ref(false)
const dialogTitle = ref('')
const dialogMemberName = ref('')
const dialogMemo = ref<string | null>(null)
const dialogUrl = ref<string | null>(null)
const dialogItemId = ref('')

const showAddMemberDialog = ref(false)
const showEditTitleDialog = ref(false)
const showAddItemDialog = ref(false)
const urlCopied = ref(false)

// 未完了と完了済みに分ける
const activeItems = computed(() => items.value.filter(item => !item.is_completed))
const completedItems = computed(() => items.value.filter(item => item.is_completed))

// ドラッグ可能なアイテムリスト（双方向バインディング用）
const draggableActiveItems = computed({
  get: () => activeItems.value,
  set: (value) => {
    // 並び順が変更された時、itemsを更新
    const completedItemsList = completedItems.value
    items.value = [...value, ...completedItemsList]
  }
})

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

// リスト編集表示
const handleShowInfo = (item: BucketItem) => {
  dialogItemId.value = item.id
  dialogTitle.value = item.title
  dialogMemberName.value = item.member?.name || ''
  dialogMemo.value = item.memo
  dialogUrl.value = item.url
  isDialogOpen.value = true
}

// リスト保存
const handleSaveInfo = async (itemId: string, title: string, memberName: string, memo: string, url: string) => {
  // メンバー取得または作成
  const { data: existingMember } = await supabase
    .from('members')
    .select('*')
    .eq('bucket_id', bucketId)
    .eq('name', memberName)
    .single()

  let memberId = existingMember?.id

  if (!existingMember) {
    const { data: newMember, error: memberError } = await supabase
      .from('members')
      .insert({ bucket_id: bucketId, name: memberName })
      .select()
      .single()

    if (memberError) {
      console.error('Error creating member:', memberError)
      return
    }
    memberId = newMember?.id
  }

  // アイテム更新
  await updateItem(itemId, {
    title: title,
    member_id: memberId,
    memo: memo || null,
    url: url || null
  })

  await Promise.all([
    fetchItems(),
    fetchMembers()
  ])
}

// メンバー追加
const handleAddMember = async (name: string) => {
  const result = await addMember(name)
  if (result) {
    await fetchMembers()
  }
}

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

// アイテム削除
const handleDeleteItem = async (id: string) => {
  if (confirm('この項目を削除しますか？')) {
    await deleteItem(id)
    await fetchItems()
  }
}

// バケットリスト保存
const handleSaveBucket = async (bucketId: string, title: string, memo: string) => {
  const result = await updateBucket(bucketId, title, memo)
  if (result) {
    await fetchBucket()
  }
}

// ドラッグ終了時の処理
const handleDragEnd = async () => {
  const itemIds = draggableActiveItems.value.map(item => item.id)
  await updateDisplayOrders(itemIds)
}

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

  // 訪問履歴に保存
  saveVisitedBucketId(bucketId)

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

.title-section {
  margin-bottom: 0.5rem;
}

.bucket-memo {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: var(--border-radius);
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.clickable-memo {
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #FFFAF5;
  }
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

h1 {
  color: #333333;
  font-size: 2rem;
  margin: 0;
}

.clickable-title {
  cursor: pointer;
  display: inline-block;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
}

.add-item-button-wrapper {
  margin: 1.5rem 0;
  text-align: center;
}

.btn-add-item {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(255, 101, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 101, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.items-container {
  margin-top: 1rem;
  padding-bottom: 8rem;

  @media (max-width: 640px) {
    padding-bottom: 6rem;
  }
}

.active-items {
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  background: white;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0.6rem;
  background: #FFE5CC;
  color: var(--color-text);
  border-radius: 20px;
  font-size: 0.85rem;
}

.btn-remove-member {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }
}

.btn-add-member {
  background: #FFE5CC;
  color: var(--color-text);
  border: none;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;

  &:hover {
    background: #FFD4B3;
  }
}
</style>
