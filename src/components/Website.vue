<template>
  <div class="container">
    <div class="site-list-container">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div v-for="(siteChunk, index) in chunkedSites" :key="index" class="swiper-slide">
            <div class="row">
              <div v-for="(site, i) in siteChunk" :key="i" class="site-box" @click="openLink(site.url)">
                <div class="site-content">
                  <i :class="[site.icon]" aria-hidden="true"></i>
                  <h3>{{ site.name }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import siteData from '../config/site.json';

const allSites = ref(siteData);
const chunkedSites = ref([]);
let swiper = null;

const chunkSites = () => {
  const chunkSize = 6;
  for (let i = 0; i < allSites.value.length; i += chunkSize) {
    chunkedSites.value.push(allSites.value.slice(i, i + chunkSize));
  }
};

const initSwiper = () => {
  nextTick(() => {
    swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      mousewheel: true,
    });
  });
};

const openLink = (url) => {
  window.open(url, '_blank');
};

onMounted(() => {
  chunkSites();
  initSwiper();

  nextTick(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      span.swiper-pagination-bullet.swiper-pagination-bullet-active {
        background: #8c8c8c94;
        width: 20px;
        border-radius: 5px;
      }
    `;
    document.head.appendChild(style);
  });
});
</script>

<style scoped>
.container {
  max-width: 700px;
  width: 100%;
}

.site-list-container {
  position: relative;
}

.swiper-container {
  overflow: hidden;
}

.swiper-slide {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 30px 0 20px 0;
  gap: 15px;
}

.site-box {
  padding: 30px;
  backdrop-filter: blur(6px);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  text-align: center;
  width: calc(33.33% - 10px);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 1px 8px var(--shadow-color);
  }
}

.site-content {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;

  i {
    font-size: var(--icon-size);
  }
}

h3 {
  margin: 0;
}

@media screen and (max-width: 768px) {
  .site-content {
    gap: 5px;
    flex-direction: column;
  }

  .site-box {
    padding: 15px;
    border-radius: 8px;
  }

  h3 {
    font-size: 16px;
  }

  .site-content i {
    font-size: 18px;
  }
}
</style>