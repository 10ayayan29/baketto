<template>
  <header class="app-header">
    <NuxtLink to="/" class="logo-link">
      <div class="logo">B</div>
      <span class="app-name">Baketto</span>
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
  gap: 0.75rem;
  text-decoration: none;
  width: fit-content;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.logo {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  font-family: 'Arial', sans-serif;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: 0.5px;
}

@media (max-width: 640px) {
  .app-header {
    padding: 0.75rem 1rem;
  }

  .logo {
    width: 36px;
    height: 36px;
    font-size: 1.3rem;
  }

  .app-name {
    font-size: 1.3rem;
  }
}
</style>
