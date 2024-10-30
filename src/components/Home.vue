<template>
  <div class="content">
    <div class="user-profile-container">
      <div class="user-profile-image" v-motion-pop>
        <img :src="profileImage" alt="头像" @click.stop="toggleInfo">
        <span class="status-ball"></span>
      </div>
      <div class="user-name" v-motion-slide-left>
        <h1>Hi,</h1>
        <h1>I'm <span class="name-style">{{ userName }}</span></h1>
      </div>
    </div>
    <div class="description">
      <p ref="descriptionElement"></p>
    </div>
    <div class="contact-section" v-motion-pop>
      <template v-for="contact in contacts" :key="contact.type">
        <a v-if="contact.url" :href="contact.url" target="_blank" class="contact-item" :style="{ '--hover-color': contact.hoverColor }">
          <i :class="contact.icon"></i>
          <span class="tooltip">{{ contact.type }}</span>
        </a>
        <span v-else @click="toggleQRCode(contact.qrCode)" class="contact-item" :style="{ '--hover-color': contact.hoverColor }">
          <i :class="contact.icon"></i>
          <span class="tooltip">{{ contact.type }}</span>
        </span>
      </template>
      <span class="contact-item" @click="toggleDarkMode" :style="{ '--hover-color': isDarkMode ? '#ffcc00' : '#666' }">
        <i :class="darkModeIconClass"></i>
        <span class="tooltip">{{ isDarkMode ? '浅色' : '深色' }}</span>
      </span>
    </div>
    <Website /> 
    <VisitTimer />

    <Transition name="fade">
      <div v-if="showAbout" class="overlay" @click="showAbout = false">
        <div class="modal-content">
          <AboutPage @close="showAbout = false" />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showQR" class="overlay" @click="hideQRCode">
        <div class="modal-content">
          <img :src="qrCodeSrc" alt="QR Code" class="qr-image" @click.stop>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import contactsData from '../config/links.json';
import Website from './Website.vue';
import AboutPage from './AboutPage.vue';
import VisitTimer from './VisitTimer.vue';
import Typed from 'typed.js';

const contacts = ref(contactsData);
const showQR = ref(false);
const showAbout = ref(false);
const qrCodeSrc = ref('');
const profileImage = ref(import.meta.env.VITE_APP_PROFILE_IMAGE_URL);
const userName = ref(import.meta.env.VITE_APP_USER_NAME);
const descriptionElement = ref(null);

const predefinedDescriptions = [
  "你好鸭，欢迎来到我的主页！！",
  "随时可以联系我，期待与你交流。",
  "愿你历尽千帆，归来仍是少年。",
  "梦想还是要有的，万一实现了呢？",
  "I hope you have a happy day every day."
];

let typedInstance = null;

const initializeTyped = () => {
  typedInstance = new Typed(descriptionElement.value, {
    strings: predefinedDescriptions,
    typeSpeed: 120,
    backSpeed: 80,
    showCursor: true,
    cursorChar: '|',
    loop: true,
  });
};

onMounted(() => {
  initializeTyped();
});

const toggleQRCode = (qrCode) => {
  qrCodeSrc.value = qrCode || '';
  showQR.value = !showQR.value;
};

const hideQRCode = () => {
  showQR.value = false;
};

const toggleInfo = () => {
  showAbout.value = !showAbout.value;
};

const isDarkMode = ref(false);
const darkModeIconClass = ref('fas fa-moon');

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);

  localStorage.setItem('darkMode', isDarkMode.value);

  darkModeIconClass.value = isDarkMode.value ? 'fas fa-sun' : 'fas fa-moon';
};

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode.value);
  }

  darkModeIconClass.value = isDarkMode.value ? 'fas fa-sun' : 'fas fa-moon';
});
</script>

<style scoped>
.content {
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 20px;

  .user-profile-container {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .user-profile-image {
    display: flex;
    border-radius: 50%;
    box-shadow: 0 2px 8px var(--shadow-color);
    padding: 5px;
    border: 3px solid var(--border-color);
    position: relative;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }

    .status-ball {
      position: absolute;
      background: #00c800;
      width: 2em;
      height: 2em;
      border-radius: 20px;
      border: 3px solid #eee;
      bottom: 5px;
      right: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      z-index: 1;
      cursor: pointer;
      overflow: hidden;

      &::before {
        content: "在线中";
        color: #00c800;
        opacity: 0;
        transition: opacity 0.3s ease-in-out, color 0.1s ease-in-out;
      }

      &:hover {
        width: 4.5em;
        height: 2em;
      }

      &:hover::before {
        opacity: 1;
        color: #eee;
      }
    }
  }

  .user-name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.3em;

    h1 {
      margin: 0;
    }
  }

  .name-style {
    position: relative;

    &:before {
      position: absolute;
      border-radius: 5px;
      bottom: 0;
      left: 50%;
      transform: translate(-50%);
      z-index: -1;
      content: "";
      background: #ffcc00ad;
      height: 30%;
      width: 110%;
      transition: height 0.3s ease-in-out;
    }
    &:hover::before {
      height: 60%;
    }
  }

  .description {
    display: flex;
    min-height: 32px;
    width: 100%;
    max-width: 500px;
    font-family: 'Georgia', serif;
    font-size: 1.2rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;

    &::before,
    &::after {
      content: '"';
      font-size: 1.5em;
      color: #999;
      margin: 0 10px;
    }

    p {
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .contact-section {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 5px 10px;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    transition: all 0.3s ease-in-out;

    .contact-item {
      color: var(--text-color);
      font-size: var(--icon-size);
      cursor: pointer;
      transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
      position: relative;

      .fas.fa-moon {
        width: 20px;
        height: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }

      &:hover {
        transform: translateY(-5px) rotate(10deg);
        color: var(--hover-color);

        .tooltip {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translate(-50%, 10px);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        white-space: nowrap;
        pointer-events: none;
      }
    }

    &:hover {
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      box-shadow: 0 2px 8px var(--shadow-color);
      background-color: rgba(var(--background-color-rgb), 0.2);
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease-out;
    
    .modal-content {
      transition: all 0.3s ease-out;
    }
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    
    .modal-content {
      transform: translateY(30px) scale(0.8);
      opacity: 0;
    }
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
    
    .modal-content {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  .qr-image {
    width: 300px;
    height: 300px;
    background: white;
    padding: 20px;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 8px var(--shadow-color);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    &:hover {
      transform: scale(1.03) translateY(-5px);
      box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);
    }
  }
}

@media screen and (max-width: 768px) {
  .content {
    gap: 15px;
  }
  .content .user-profile-container {
    flex-direction: column;
    gap: 0;
  }

  h1 {
    font-size: 1.5em;
  }
}
</style>