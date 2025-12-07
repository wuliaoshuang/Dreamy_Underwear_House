import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Rarity } from '../types';

/**
 * 触觉反馈服务
 * 提供统一的触觉反馈接口
 */
export const HapticsService = {
  /**
   * 轻触反馈 - 用于普通按钮点击
   */
  light: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 中等强度反馈 - 用于重要操作
   */
  medium: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 重度反馈 - 用于关键操作或高稀有度
   */
  heavy: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 成功通知反馈
   */
  success: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 警告通知反馈
   */
  warning: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 错误通知反馈
   */
  error: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 选择开始 - 用于拖动或长按开始
   */
  selectionStart: async () => {
    try {
      await Haptics.selectionStart();
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 选择改变 - 用于滑动选择
   */
  selectionChanged: async () => {
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 选择结束
   */
  selectionEnd: async () => {
    try {
      await Haptics.selectionEnd();
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 自定义振动
   * @param duration 振动时长(毫秒)
   */
  vibrate: async (duration: number = 300) => {
    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  },

  /**
   * 根据稀有度触发反馈
   * @param rarity 物品稀有度
   */
  rarityFeedback: async (rarity: Rarity) => {
    try {
      switch (rarity) {
        case Rarity.LEGENDARY:
          // 至臻: 成功通知 + 重度震动
          await Haptics.notification({ type: NotificationType.Success });
          await new Promise(resolve => setTimeout(resolve, 100));
          await Haptics.impact({ style: ImpactStyle.Heavy });
          await new Promise(resolve => setTimeout(resolve, 100));
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case Rarity.EPIC:
          // 无敌: 成功通知 + 中度震动
          await Haptics.notification({ type: NotificationType.Success });
          await new Promise(resolve => setTimeout(resolve, 80));
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case Rarity.RARE:
          // 超级: 中度震动
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case Rarity.COMMON:
          // 普通: 轻度震动
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
      }
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }
};
