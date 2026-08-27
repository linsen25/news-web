type WechatConfig = { appId:string; timestamp:number; nonceStr:string; signature:string };
type WechatShareData = { title:string; desc:string; link:string; imgUrl:string };
type WechatSdk = {
  config(input:WechatConfig & { debug:boolean; jsApiList:string[] }):void;
  ready(callback:()=>void):void;
  error(callback:(error:unknown)=>void):void;
  updateAppMessageShareData(input:WechatShareData):void;
  updateTimelineShareData(input:Omit<WechatShareData,'desc'>):void;
};

declare global { interface Window { wx?:WechatSdk; __wechatSdkPromise?:Promise<WechatSdk> } }

const loadWechatSdk = ():Promise<WechatSdk> => {
  if (window.wx) return Promise.resolve(window.wx);
  if (window.__wechatSdkPromise) return window.__wechatSdkPromise;
  window.__wechatSdkPromise = new Promise((resolve,reject) => {
    const script=document.createElement('script');
    script.src='https://res.wx.qq.com/open/js/jweixin-1.6.0.js'; script.async=true;
    script.onload=()=>window.wx ? resolve(window.wx) : reject(new Error('微信 JS-SDK 加载失败'));
    script.onerror=()=>reject(new Error('微信 JS-SDK 加载失败'));
    document.head.appendChild(script);
  });
  return window.__wechatSdkPromise;
};

export const useWechatShare = () => {
  const configure = async (share:WechatShareData) => {
    if (!import.meta.client || !/MicroMessenger/i.test(navigator.userAgent)) return;
    const pageUrl=window.location.href.split('#')[0];
    const [wx,signature]=await Promise.all([
      loadWechatSdk(),
      $fetch<WechatConfig>('/api/wechat/jssdk',{ query:{ url:pageUrl } }),
    ]);
    wx.config({ ...signature, debug:false, jsApiList:['updateAppMessageShareData','updateTimelineShareData'] });
    wx.ready(() => {
      wx.updateAppMessageShareData(share);
      wx.updateTimelineShareData({ title:share.title, link:share.link, imgUrl:share.imgUrl });
    });
    wx.error((error) => console.warn('WeChat JS-SDK configuration failed', error));
  };
  return { configure };
};
