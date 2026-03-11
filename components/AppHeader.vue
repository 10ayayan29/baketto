<template>
  <header class="app-header">
    <NuxtLink to="/" class="logo-link">
      <img src="/assets/img/logo_clear.png" alt="Baketto" class="logo-image" />
    </NuxtLink>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 2px solid var(--color-border);
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  width: fit-content;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.logo-image {
  height: 40px;
  width: auto;
}

@media (max-width: 640px) {
  .app-header {
    padding: 0.75rem 1rem;
  }

  .logo-image {
    height: 36px;
  }
}
</style>
