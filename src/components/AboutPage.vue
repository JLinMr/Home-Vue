<template>
  <div @click.stop>
    <div class="modal">
      <div class="modal-content">
        <div class="tech-stack">
          <h3>使用的技术栈</h3>
          <ul>
            <li v-for="tech in techStack" :key="tech.name" :class="tech.name.toLowerCase()">
              <Icon :icon="tech.icon"></Icon>
              {{ tech.name }}
            </li>
          </ul>
        </div>
        <div class="github-info">
          <h3>开源地址</h3>
          <a href="https://github.com/JLinMr/Home-Vue" target="_blank" class="github-link">
            <Icon icon="fa6-brands:github" /> Github
          </a>
        </div>
        <div class="update-info">
          <h3>最近更新</h3>
          <ul>
            <li v-if="loading" class="loading-item">
              <div class="loading-spinner"></div>
            </li>
            <li v-for="(update, index) in lastUpdates" :key="index">
              {{ update.message }} <span v-if="update.date"> ({{ update.date }})</span>
            </li>
          </ul>
        </div>
      </div>
      <button @click="closeModal" class="close-btn">
        <Icon icon="fa-solid:times" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);

const techStack = [
  { name: 'Vue3', icon: 'fa6-brands:vuejs' },
  { name: 'Vite', icon: 'fa6-solid:bolt' },
  { name: 'CSS3', icon: 'fa6-brands:css3-alt' },
  { name: 'HTML5', icon: 'fa6-brands:html5' },
  { name: 'JavaScript', icon: 'fa6-brands:js' }
];
const lastUpdates = ref([]);
const loading = ref(true);

const closeModal = () => emit('close');

const fetchCommits = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/JLinMr/Home-Vue/commits');
    const commits = await response.json();
    lastUpdates.value = commits.slice(0, 3).map(commit => ({
      message: commit.commit.message,
      date: new Date(commit.commit.author.date).toLocaleDateString()
    }));
  } catch (error) {
    console.error('获取更新信息失败', error);
    lastUpdates.value = [{ message: '无法获取更新信息', date: '' }];
  } finally {
    loading.value = false;
  }
};

fetchCommits();
</script>

<style scoped>
.modal {
  width: 100%;
  max-width: 600px;
  background: var(--background-color);
  padding: 40px;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px var(--shadow-color);
  position: relative;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 20px;
    width: 90%;
    margin: auto;
  }
}

h3 {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 10px;
}

.tech-stack ul {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.tech-stack li {
  padding: 10px 15px;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  display: flex;
  gap: 5px;
  flex-direction: column;
  align-items: center;

  &:hover {
    background-color: var(--hover-other-color);
    color: var(--hover-link-color);
  }

  i {
    font-size: 1.5em;
  }

  @media (max-width: 600px) {
    font-size: 0.8em;
  }
}

.github-link {
  display: flex;
  background-color: #040404d0;
  color: white;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  text-decoration: none;
  transition: background-color 0.3s ease;
  justify-content: center;
  gap: 5px;

  &:hover {
    background-color: #1a1a1a;
  }
}

.update-info ul {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 73px;
  justify-content: center;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease;

  &:hover {
    color: #c61b09;
  }
}

.loading-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-top-color: #ffcc00;
  animation: spin 1s ease-in-out infinite;
}

.loading-text {
  color: #7f8c8d;
  font-style: italic;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-content > div {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;

  &:nth-child(1) { animation-delay: 0.2s; }
  &:nth-child(2) { animation-delay: 0.3s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}
</style>