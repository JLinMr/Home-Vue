<template>
  <div class="visit-timer-container">
    <div class="visit-timer" 
         v-motion
         :initial="{ opacity: 0, y: 50, x: '-50%', scale: 0.5 }"
         :enter="{ opacity: 1, y: 0, x: '-50%', scale: 1, transition: { duration: 300 } }"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave"
         @click="toggleCalendar">
      <div class="timer-content">
        <i class="fas fa-clock"></i>
        <span>停留时间 : </span>
        <div class="time">
          <template v-for="(value, unit) in timeUnits" :key="unit">
            <div class="time-wrapper">
              <Transition name="flip">
                <span :key="value" class="time-unit">{{ value }}</span>
              </Transition>
            </div>
            <span v-if="unit !== 'seconds'" class="separator">:</span>
          </template>
        </div>
      </div>
    </div>

    <Transition name="calendar">
      <div v-if="showCalendar" 
           class="calendar-popup"
           @mouseleave="handleMouseLeave">
        <div class="calendar-header">
          <i class="fas fa-calendar-alt"></i>
          {{ dateTime.dateOnly }}
        </div>
        <div class="calendar-time">
          <i class="fas fa-clock"></i>
          <span>{{ dateTime.weekday }}</span>
          <span>{{ dateTime.timeWithoutSeconds }}</span>
          <span v-if="isCalendarPinned" class="pin-indicator">
            <i class="fas fa-thumbtack"></i>
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// === 合并计时和日期时间逻辑 ===
const useTimeManager = () => {
  const startTime = ref(Date.now());
  const currentTime = ref(Date.now());

  onMounted(() => {
    const timer = setInterval(() => {
      currentTime.value = Date.now();
    }, 1000);
    
    onUnmounted(() => clearInterval(timer));
  });

  // 计算属性
  const timeUnits = computed(() => {
    const totalSeconds = Math.floor((currentTime.value - startTime.value) / 1000);
    return {
      hours: Math.floor(totalSeconds / 3600).toString().padStart(2, '0'),
      minutes: Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0'),
      seconds: (totalSeconds % 60).toString().padStart(2, '0')
    };
  });

  const dateTime = computed(() => {
    const now = new Date(currentTime.value);
    return {
      dateOnly: now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      weekday: now.toLocaleDateString('zh-CN', { weekday: 'long' }),
      timeWithoutSeconds: now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  });

  return {
    timeUnits,
    dateTime
  };
};

// === 简化组件状态管理 ===
const showCalendar = ref(false);
const isCalendarPinned = ref(false);

const { timeUnits, dateTime } = useTimeManager();

// 简化事件处理
const handleMouseEnter = () => showCalendar.value = true;
const handleMouseLeave = () => !isCalendarPinned.value && (showCalendar.value = false);
const toggleCalendar = () => {
  isCalendarPinned.value = !isCalendarPinned.value;
  showCalendar.value = true;
};
</script>

<style scoped lang="less">
/* 基础组件样式 */
.visit-timer-container {
  position: fixed;
  z-index: 100;
  pointer-events: none;
  width: 100%;
  height: 0;

  /* 在移动端隐藏组件 */
  @media (max-width: 768px) {
    display: none;
  }
}

.visit-timer, .calendar-popup {
  pointer-events: auto;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  font-weight: bold;
}

.visit-timer {
  bottom: 50px;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateX(-50%) translateY(-5px);
    box-shadow: 0 2px 8px var(--shadow-color);
  }

  .timer-content {
    display: flex;
    align-items: baseline;
    gap: 5px;
    font-size: 0.9em;

    .time {
      display: flex;
    }
  }
}

/* 时间单位样式 */
.time-wrapper {
  position: relative;
  width: 1.6em;
  height: 1.2em;
  overflow: visible;

  .time-unit {
    display: inline-block;
    width: 1.6em;
    text-align: center;
    height: 1.2em;
    line-height: 1.2em;
  }
}

.separator { 
  margin: 0 2px; 
}

/* 日历弹窗样式 */
.calendar-popup {
  bottom: calc(50px + 50px);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 12px var(--shadow-color);
  min-width: 188px;

  .calendar-header {
    text-align: center;
    font-weight: bold;
  }

  .calendar-time {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 5px;
    font-weight: bold;
  }
}

/* 固定图钉样式 */
.pin-indicator {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: -10px;
  border-radius: 50%;
  background-color: var(--background-color);
  box-shadow: 0 2px 12px var(--shadow-color);
  color: red;
  transform: rotate(45deg);
  animation: pin-in 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

/* 添加图钉动画关键帧 */
@keyframes pin-in {
  0% {
    transform: rotate(0deg) scale(0.5) translateY(-10px);
    opacity: 0;
  }
  30% {
    transform: rotate(0deg) scale(1.2) translateY(0);
    opacity: 1;
  }
  100% {
    transform: rotate(45deg) scale(1) translateY(0);
    opacity: 1;
  }
}

/* 动画样式 */
.calendar {
  &-enter-active,
  &-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(20px) scale(0.5);
  }
}

.flip {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: absolute;
    width: 100%;
    left: 0;
  }

  &-enter-from {
    transform: translateY(20px);
    opacity: 0;
  }

  &-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }
}
</style>