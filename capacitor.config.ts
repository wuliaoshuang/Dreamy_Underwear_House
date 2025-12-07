import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neinei.moxiang',
  appName: '梦幻内衣屋',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "LIGHT",
      backgroundColor: "#fffffcfd",
    },
  },
};

export default config;
