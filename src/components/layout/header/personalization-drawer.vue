<template>
  <el-drawer v-model="drawerVisible" title="个性化设置" size="360px" append-to-body>
    <div class="theme-drawer">
      <!-- 外观主题 -->
      <section class="theme-drawer__section">
        <div class="theme-drawer__heading">
          <span class="theme-drawer__title">外观主题</span>
          <span class="theme-drawer__description">选择界面的亮色或暗黑外观</span>
        </div>
        <div class="theme-drawer__theme-options" role="radiogroup" aria-label="外观主题">
          <button
            v-for="option in THEME_OPTIONS"
            :key="option.value"
            type="button"
            role="radio"
            :aria-checked="mode === option.value"
            class="theme-drawer__theme-option"
            :class="{ 'is-active': mode === option.value }"
            @click="setMode(option.value)"
          >
            <span class="theme-preview" :class="`theme-preview--${option.value}`">
              <span class="theme-preview__sidebar"></span>
              <span class="theme-preview__content">
                <span></span>
                <span></span>
              </span>
            </span>
            <span class="theme-preview__label">{{ option.label }}</span>
            <span class="theme-preview__description">{{ option.description }}</span>
          </button>
        </div>
      </section>

      <!-- 主题色彩 -->
      <section class="theme-drawer__section">
        <div class="theme-drawer__heading">
          <span class="theme-drawer__title">主题色彩</span>
          <span class="theme-drawer__description">自定义系统主色调，全站界面实时联动</span>
        </div>
        <div class="theme-drawer__color-options" role="radiogroup" aria-label="主题色彩">
          <button
            v-for="color in presetThemeColors"
            :key="color.label"
            type="button"
            role="radio"
            :aria-checked="isPresetColorActive(color)"
            :title="color.label"
            class="theme-drawer__color-option"
            :class="{ 'is-active': isPresetColorActive(color) }"
            @click="setPrimaryColors({ light: color.light, dark: color.dark })"
          >
            <span
              class="theme-drawer__swatch"
              :style="{ background: `linear-gradient(180deg, ${color.dark} 50%, ${color.light} 50%)` }"
            >
              <i v-if="isPresetColorActive(color)" class="theme-drawer__swatch-check"></i>
            </span>
            <span class="theme-drawer__label">{{ color.label }}</span>
            <span v-if="!isPresetColorActive(color) && isHalfMatched(color)" class="theme-drawer__half-match">
              当前单色匹配
            </span>
          </button>
        </div>
        <div class="theme-drawer__custom-row">
          <span class="theme-drawer__custom-label">自定义主色</span>
          <div class="theme-drawer__custom-picker">
            <el-color-picker
              :model-value="resolvedPrimaryColor"
              color-format="hex"
              :show-alpha="false"
              @change="(value: string | null) => setSinglePrimaryColor(value ?? resolvedPrimaryColor)"
            />
            <span class="theme-drawer__custom-value">{{ resolvedPrimaryColor.toUpperCase() }}</span>
          </div>
        </div>
      </section>

      <div class="theme-drawer__footnote">
        偏好保存在本地浏览器 system-theme-color 键，仅对当前设备生效。
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
/**
 * 个性化设置抽屉（迁移自 guibiao 的 PersonalizationDrawer）：
 * - 外观主题：带迷你界面预览的选择卡（亮/暗/跟随系统）
 * - 主题色彩：预设色卡按「上暗下亮」双色渐变展示，激活要求亮暗两档均一致；
 *   底部提供自定义主色取色器（应用为亮暗同值）
 */
import {
  PRESET_THEME_COLORS,
  useSystemTheme,
  type PresetThemeColor,
  type ThemeMode,
} from '@/utils/system-style'

/** 外观主题选项：预览卡片的标识与文案 */
const THEME_OPTIONS: Array<{ label: string; description: string; value: ThemeMode }> = [
  { label: '亮色', description: '清爽的日间界面', value: 'light' },
  { label: '暗色', description: '低亮度夜读环境', value: 'dark' },
  { label: '跟随系统', description: '自动匹配系统偏好', value: 'system' },
]

const {
  mode,
  isDark,
  drawerVisible,
  primaryColors,
  resolvedPrimaryColor,
  setMode,
  setPrimaryColors,
  setSinglePrimaryColor,
} = useSystemTheme()

const presetThemeColors = PRESET_THEME_COLORS

/** 预设色卡激活：亮/暗两档均与当前主色一致（guibiao 语义） */
function isPresetColorActive(color: PresetThemeColor): boolean {
  return primaryColors.light === color.light && primaryColors.dark === color.dark
}

/**
 * 自定义主色与某张预设色卡「当前模式侧」同值时提示单色匹配，
 * 告知该卡仅部分档位与设置一致，再次点击即补齐两档。
 */
function isHalfMatched(color: PresetThemeColor): boolean {
  return resolvedPrimaryColor.value.toLowerCase() === (isDark.value ? color.dark : color.light).toLowerCase()
}
</script>

<style lang="less" scoped>
.theme-drawer {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__section {
    border-top: 1px solid var(--el-border-color-light);
    padding-top: 24px;

    &:first-child {
      border-top: 0;
      padding-top: 0;
    }
  }

  &__heading {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 14px;
  }

  &__title {
    color: var(--el-text-color-primary);
    font-size: 14px;
    font-weight: 600;
  }

  &__description {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  &__theme-options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
  }

  &__theme-option {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    padding: 8px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    background: transparent;
    color: var(--el-text-color-primary);
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      color 0.2s ease;

    &:hover {
      border-color: var(--sj-primary);
    }

    &.is-active {
      border-color: var(--sj-primary);
      box-shadow: 0 0 0 1px var(--sj-primary);

      .theme-preview__label {
        color: var(--sj-primary);
        font-weight: 600;
      }
    }
  }

  &__color-options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
    margin-bottom: 10px;
  }

  &__color-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    min-height: 64px;
    padding: 8px 5px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 7px;
    background: transparent;
    color: var(--el-text-color-primary);
    font-size: 12px;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      border-color: var(--sj-primary);

      .theme-drawer__swatch {
        transform: scale(1.08);
      }
    }

    &.is-active {
      border-color: var(--sj-primary);
      background: var(--el-color-primary-light-9);
      box-shadow: 0 0 0 1px var(--sj-primary);
      color: var(--sj-primary);
    }
  }

  &__swatch {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgb(0 0 0 / 12%);
    transition: transform 0.2s ease;
  }

  &__swatch-check {
    display: inline-block;
    width: 5px;
    height: 9px;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    transform: rotate(45deg) translate(-1px, -1px);
  }

  &__label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__half-match {
    color: var(--el-text-color-secondary);
    font-size: 10px;
  }

  &__custom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1px dashed var(--el-border-color-light);
    border-radius: 7px;
  }

  &__custom-label {
    color: var(--el-text-color-primary);
    font-size: 13px;
  }

  &__custom-picker {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__custom-value {
    color: var(--el-text-color-secondary);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
  }

  &__footnote {
    border-top: 1px solid var(--el-border-color-light);
    padding-top: 12px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

/* ---------- 外观主题：迷你界面预览卡 ---------- */

.theme-preview {
  display: flex;
  width: 100%;
  height: 56px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  background: #f4f6f8;

  &--dark {
    border-color: #414348;
    background: #18191b;
  }

  &--system {
    border-color: #9ca3af;
    background: linear-gradient(90deg, #f4f6f8 50%, #18191b 50%);
  }

  &__sidebar {
    width: 23%;
    flex-shrink: 0;
    background: #e8ebef;
  }

  &--dark &__sidebar {
    background: #292b2f;
  }

  &--system &__sidebar {
    background: linear-gradient(90deg, #e8ebef 50%, #292b2f 50%);
  }

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
    padding: 13px 10px;
  }

  &__content span,
  &--dark &__content span:last-child {
    display: block;
    height: 8px;
    border-radius: 3px;
    background: #ffffff;
  }

  &__content span:last-child {
    width: 66%;
  }

  &--dark &__content span {
    background: #36383d;
  }

  &--system &__content span {
    background: linear-gradient(90deg, #ffffff 50%, #36383d 50%);
  }

  &__label {
    color: var(--el-text-color-primary);
    font-size: 13px;
  }

  &__description {
    color: var(--el-text-color-secondary);
    font-size: 11px;
  }
}
</style>
