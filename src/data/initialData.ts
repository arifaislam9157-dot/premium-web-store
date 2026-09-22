import { StoreData } from '../types';

export const INITIAL_STORE_DATA: StoreData = {
  version: '1.2.0',
  lastUpdated: new Date().toISOString(),
  settings: {
    siteName: 'Premium Web store',
    tagline: 'সেরা AI প্রম্পট ও রেডি কোড দিয়ে সেকেন্ডে তৈরি করুন আপনার আইডিয়া',
    announcementBar: {
      enabled: true,
      text: '🔥 নতুন ওয়েবসাইট রেডি কোড ও 3D Wings Name AI প্রম্পট যুক্ত হয়েছে! ১০০% ফ্রি কপি করুন।',
      linkText: 'Explore Now',
      linkUrl: '#prompts-section'
    },
    telegramChannel: 'https://t.me/premiumwebstore',
    whatsappGroup: 'https://chat.whatsapp.com/',
    youtubeChannel: 'https://youtube.com',
    contactEmail: 'contact@premiumwebstore.com',
    footerText: '© 2026 Premium Web store • Free AI Prompts, Ready Web Codes & Developer Tools Hub.',
    bingImageCreatorUrl: 'https://www.bing.com/images/create',
    chatgptUrl: 'https://chatgpt.com',
    enableDirectLinkAdClick: false,
    enableGlobalAds: true
  },
  categories: [
    {
      id: 'all',
      name: 'All Prompts & Codes',
      iconName: 'Sparkles',
      description: 'সব ভাইরাল AI প্রম্পট এবং রেডি ওয়েবসাইট কোড',
      color: 'cyan'
    },
    {
      id: 'web-codes',
      name: 'Website Ready Codes',
      iconName: 'Code',
      description: 'এক ক্লিকে ওয়েবসাইট রেডি HTML, CSS ও JS স্ক্রিপ্ট',
      color: 'violet'
    },
    {
      id: 'bing-3d-wings',
      name: '3D Wings & Avatars',
      iconName: 'Flame',
      description: 'Viral 3D angelic wings with custom name on neon hoodie',
      color: 'amber'
    },
    {
      id: 'couple-portraits',
      name: 'Couple & Romance',
      iconName: 'Heart',
      description: 'Romantic couples, rainy dates, and aesthetic portraits',
      color: 'rose'
    },
    {
      id: 'cyberpunk-neon',
      name: 'Cyberpunk & Sci-Fi',
      iconName: 'Cpu',
      description: 'Futuristic neon cities, glowing holographic DP avatars',
      color: 'emerald'
    },
    {
      id: 'chatgpt-marketing',
      name: 'ChatGPT & Writing',
      iconName: 'Sparkles',
      description: 'Viral scripts, SEO articles, and business marketing prompts',
      color: 'blue'
    }
  ],
  prompts: [
    {
      id: 'future-girlfriend-prediction',
      title: 'ভবিষ্যত প্রেমিকা প্রেডিকশন ওয়েবসাইট রেডি কোড।',
      category: 'web-codes',
      platform: 'Web Scripts',
      promptText: `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>আপনার ভবিষ্যত প্রেমিকা প্রেডিকশন</title>
  <style>
    :root {
      --primary-glow: #ec4899;
      --secondary-glow: #8b5cf6;
      --bg-dark: #070913;
    }
    body {
      margin: 0;
      background: #070913;
      background-image: radial-gradient(circle at top, rgba(236,72,153,0.15), transparent 70%);
      color: #f8fafc;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: rgba(19, 28, 49, 0.85);
      border: 1px solid rgba(236, 72, 153, 0.3);
      padding: 35px 25px;
      border-radius: 24px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      backdrop-filter: blur(12px);
    }
    h1 { font-size: 24px; color: #f472b6; margin-bottom: 12px; }
    input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid rgba(236, 72, 153, 0.4);
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: 15px;
      margin-top: 15px;
      box-sizing: border-box;
      outline: none;
    }
    button {
      margin-top: 18px;
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #ec4899, #8b5cf6);
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(236,72,153,0.4);
      transition: 0.3s;
    }
    button:hover { transform: scale(1.02); }
    #result { margin-top: 20px; font-size: 18px; font-weight: bold; color: #38bdf8; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔮 আপনার ভবিষ্যত প্রেমিকা প্রেডিকশন</h1>
    <p style="color:#94a3b8; font-size:14px;">আপনার নাম লিখে নিচে ক্লিক করুন আর জানুন আপনার মনের মানুষের বৈশিষ্ট্য!</p>
    <input type="text" id="userName" placeholder="আপনার পুরো নাম লিখুন..." />
    <button onclick="predictFutureLove()">প্রেডিকশন দেখুন ✨</button>
    <div id="result"></div>
  </div>
  <script>
    function predictFutureLove() {
      const name = document.getElementById('userName').value.trim();
      if(!name) { alert('দয়া করে আপনার নাম লিখুন!'); return; }
      const traits = [
        'খুব মায়াবী চোখ, বই পড়তে ভালোবাসে আর ভীষণ কেয়ারিং!',
        'চঞ্চল ও হাসিখুশি, রান্না করতে ভালোবাসে আর গান শোনে!',
        'শান্ত স্বভাবের, তবে আপনার সাথে কথা বলতে দারুণ পছন্দ করে!',
        'অত্যন্ত বুদ্ধিমতী, ক্যারিয়ার ও পরিবার দুটোই দারুণভাবে সামলাবে!'
      ];
      const randomTrait = traits[Math.floor(Math.random() * traits.length)];
      const res = document.getElementById('result');
      res.style.display = 'block';
      res.innerHTML = '🎉 ' + name + ', আপনার ভবিষ্যত প্রেমিকা:<br><span style="color:#f472b6;">' + randomTrait + '</span>';
    }
  </script>
</body>
</html>`,
      description: 'সম্পূর্ণ রেডি এইচটিএমএল, সিএসএস ও জাভাস্ক্রিপ্ট কোড। নিজের সাইটে কপি-পেস্ট করলেই ভাইরাল প্রেডিকশন টুল চালু হয়ে যাবে।',
      thumbnailUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFnqdNe9ZqRt9Oqa1dvIt7SnVynQMx92BP_g7j9N_yRGurJGRtRtSMiuBcR2DYkJoRgCYF4B-1SzkVS-98kUvT3n9KHnnLaiPh66sRMQSuMtIaKDe1D9_svnFhEirUddee1k1qawPb3WvMdUTnr7qaYGHk2EGqb2DT0QW8_SUaZwzWTKoBHR3o59d7-tU/s320/Screenshot%202026-09-21%20124857.png',
      tags: ['Website Code', 'Viral Tool', 'HTML CSS JS', 'Prediction Game'],
      views: 4776,
      copies: 96,
      isFeatured: true,
      badge: 'Trending',
      createdAt: '2026-09-20'
    },
    {
      id: 'captcha-button-code',
      title: 'ক্যাপচা বাটন যুক্ত করার সম্পুর্ন রেডি কোড।',
      category: 'web-codes',
      platform: 'Web Scripts',
      promptText: `<div class="captcha-protect-box">
  <style>
    .captcha-protect-box {
      background: rgba(19, 28, 49, 0.9);
      border: 1px solid rgba(59, 130, 246, 0.3);
      padding: 20px;
      border-radius: 16px;
      max-width: 380px;
      margin: 20px auto;
      font-family: 'Inter', sans-serif;
      text-align: center;
      color: #fff;
    }
    .captcha-check-label {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.4);
      padding: 12px 16px;
      border-radius: 10px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.1);
      user-select: none;
    }
    .captcha-checkbox {
      width: 22px;
      height: 22px;
      cursor: pointer;
      accent-color: #3b82f6;
    }
    .download-link-ready {
      margin-top: 15px;
      display: none;
      padding: 10px;
      background: #22c55e;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
    }
  </style>

  <p style="font-size: 14px; margin-bottom: 12px; color: #94a3b8;">Human Verification Required</p>
  <label class="captcha-check-label">
    <input type="checkbox" class="captcha-checkbox" onchange="verifyHuman(this)" />
    <span>I am not a robot (আমি রোবট নই)</span>
  </label>
  <a href="#" id="verifiedDownloadBtn" class="download-link-ready">✅ লিংক আনলক হয়েছে - ডাউনলোড করুন</a>

  <script>
    function verifyHuman(checkbox) {
      if(checkbox.checked) {
        setTimeout(() => {
          document.getElementById('verifiedDownloadBtn').style.display = 'block';
        }, 600);
      }
    }
  </script>
</div>`,
      description: 'যেকোনো ব্লগে বা ওয়েবসাইটে ক্যাপচা ভেরিফিকেশন বাটন বসানোর রেডি কোড। ডাউনলোডের আগে স্প্যাম ঠেকানোর জন্য দারুণ।',
      thumbnailUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi357oyXCVujo-Vto6ooSjvxfBG1sOzJ1Q8KsDc6gw9LrIf2Zzhog0QiB3ww0p0JNqHvZysyob6n4qCl8Cetmgw9hr8-NBFRnUFK8wX2jONpKcRS3NYbgRTFh4ez9xcnZRBYWRpcnCIy5bmHqvgm4VfgIyeVMQap2-hdSgSMWiX1vrzWBcJo_1WfEC8v-U/s320/5.-captcha-min.jpg',
      tags: ['Captcha', 'Security', 'Blogger Widget', 'Ready Code'],
      views: 1534,
      copies: 454,
      isFeatured: false,
      badge: 'Hot',
      createdAt: '2026-09-18'
    },
    {
      id: 'premium-timer-button',
      title: 'প্রিমিয়াম টাইমার বাটন রেডি কোড',
      category: 'web-codes',
      platform: 'Web Scripts',
      promptText: `<div class="premium-timer-container">
  <style>
    .premium-timer-container {
      background: linear-gradient(135deg, #131c31, #0b0f19);
      border: 1px solid rgba(59, 130, 246, 0.25);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      max-width: 400px;
      margin: 20px auto;
      color: #fff;
      font-family: 'Inter', sans-serif;
    }
    .timer-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 4px solid #3b82f6;
      border-top-color: transparent;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 800;
      color: #38bdf8;
      animation: spinBorder 1s linear infinite;
    }
    @keyframes spinBorder {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .timer-text-wrap {
      animation: none;
      transform: none !important;
    }
    .timer-download-btn {
      display: none;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 10px;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
  </style>

  <div class="timer-circle" id="timerBox">
    <span class="timer-text-wrap" id="countdownNum">10</span>
  </div>
  <p id="timerMessage" style="font-size: 14px; color: #94a3b8;">দয়া করে ১০ সেকেন্ড অপেক্ষা করুন...</p>
  <a href="https://example.com" class="timer-download-btn" id="finalDownloadBtn">📥 ফাইল ডাউনলোড করুন</a>

  <script>
    let timeLeft = 10;
    const countSpan = document.getElementById('countdownNum');
    const timerBox = document.getElementById('timerBox');
    const msg = document.getElementById('timerMessage');
    const btn = document.getElementById('finalDownloadBtn');

    const interval = setInterval(() => {
      timeLeft--;
      countSpan.innerText = timeLeft;
      if(timeLeft <= 0) {
        clearInterval(interval);
        timerBox.style.display = 'none';
        msg.innerText = '✅ ডাউনলোড লিংক প্রস্তুত!';
        btn.style.display = 'inline-block';
      }
    }, 1000);
  </script>
</div>`,
      description: '১০ সেকেন্ড কাউন্টডাউন টাইমার বাটন। ব্লগ বা ওয়েবসাইটে ইউজার রিটেনশন বাড়ানো ও অ্যাড ইম্প্রেশন বৃদ্ধির জন্য সেরা।',
      thumbnailUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_p_rB4tQhjKZt33JbH5fd3IIZ8TNJRfNR5wLBPU98xBgDXxSf92xwRUaGT9lyFf0nMy9-SyMf5mFzh1aX2Z7YCDFZGrsSeTXzX2q755I4V-IZcLL5A3VpA7XYK-0VqSMfGUdNfNpUQfDMHIwrk-ImxRUESvlMH2e2kbiOyDIvZDdTtJo3zmelcGYqJBc/s320/10-seconds-countdown-timer-countdown-timer-10-second-10-second-animation-from-10-to-0-seconds-modern-flat-design-with-animation-on-black-background-full-hd-free-video.jpg',
      tags: ['Countdown Timer', 'Ad Booster', 'Button Code', 'HTML JS'],
      views: 2980,
      copies: 612,
      isFeatured: false,
      badge: 'Hot',
      createdAt: '2026-09-17'
    },
    {
      id: 'view-offer-button-code',
      title: 'ভিউ অফার বাটন রেডি কোড',
      category: 'web-codes',
      platform: 'Web Scripts',
      promptText: `<div class="offer-badge-box">
  <style>
    .offer-badge-box {
      text-align: center;
      padding: 20px;
      background: radial-gradient(circle, #1a1030 0%, #0c0818 100%);
      border: 1px solid rgba(236, 72, 153, 0.3);
      border-radius: 16px;
      max-width: 360px;
      margin: 15px auto;
    }
    .pulsing-offer-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #ec4899, #f43f5e);
      color: #fff;
      font-weight: 800;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
      animation: offerPulse 1.8s infinite;
      transition: transform 0.2s;
    }
    .pulsing-offer-btn:hover {
      transform: scale(1.05);
    }
    @keyframes offerPulse {
      0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
      70% { box-shadow: 0 0 0 16px rgba(236, 72, 153, 0); }
      100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
  </style>

  <a href="https://your-ad-or-cpa-link.com" target="_blank" class="pulsing-offer-btn">
    🎁 স্পেশাল অফার দেখুন (Limited Offer)
  </a>
</div>`,
      description: 'অ্যানিমেটেড পালসিং অফার বাটন কোড। সিপিএ বা এফিলিয়েট ক্যাম্পেইনের কনভার্সন অনেক বাড়িয়ে দেয়।',
      thumbnailUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHeTF6_oEo8jatcr-NBFFYBWAzMAC5-rNP1MUp5oK8HWZunTt1CfM1fYizDCxe-9eBv-QZ162CwHDeiRardLc_uHnByaQsbHsFHyAWwdfrNSc9f1ZR4IBRYGEmCsg6PHOFdnCwX0hQgvSxG2-9Psq-q-keZjuVKgC9tq_4VF9Lc3dxlQj1adchqjTSpIs/s320/special-offer-button-speech-bubble-banner-label-special-offer-vector.jpg',
      tags: ['CPA Offer', 'Affiliate', 'Pulse Button', 'HTML CSS'],
      views: 1820,
      copies: 380,
      isFeatured: false,
      badge: 'Free',
      createdAt: '2026-09-15'
    },
    {
      id: 'bing-3d-wings-boy-neon',
      title: '3D Wings Boy on Dark Throne with Neon Name Hoodie',
      category: 'bing-3d-wings',
      platform: 'Bing Image Creator',
      promptText: `Create a 3D realistic hyper-detailed illustration of a stylish handsome 20-year-old boy sitting casually on a black obsidian throne with majestic glowing angelic white wings behind him. The boy is wearing modern black casual sneakers, distressed dark denim jeans, and an oversized black hoodie with the name "{NAME}" illuminated in bright neon cyan graffiti font on the chest. Dramatic volumetric rim lighting, cinematic 8K photorealistic render, octane render style, soft ambient mist on the floor.`,
      description: 'ভাইরাল 3D উইংস অবতার প্রম্পট। মাইক্রোসফট বিং ইমেজ ক্রিয়েটরে নিজের নাম দিয়ে তৈরি করুন আকর্ষণীয় প্রোফাইল পিকচার।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      tags: ['3D Wings', 'Bing AI', 'Profile Picture', 'Neon Name', 'Viral'],
      variables: [
        { key: 'NAME', label: 'Your Name', defaultValue: 'ARIF' }
      ],
      views: 9420,
      copies: 1845,
      isFeatured: false,
      badge: 'Trending',
      createdAt: '2026-09-14'
    },
    {
      id: 'bing-3d-wings-girl-golden',
      title: '3D Golden Wings Girl with Sparkling Diamond Crown & Name',
      category: 'bing-3d-wings',
      platform: 'Bing Image Creator',
      promptText: `Create a stunning realistic 3D portrait of a beautiful 19-year-old girl sitting gracefully on an elegant marble bench. Behind her are enormous glowing golden feathery wings with soft sparkles floating in the air. She is wearing a chic pastel pink silk hoodie with her name "{NAME}" elegantly written on the front in glowing rose-gold cursive font. Delicate golden tiara on her hair, warm sunset golden hour lighting, cinematic bokeh background, 8k ultra realistic.`,
      description: 'মেয়েদের জন্য ট্রেন্ডিং গোল্ডেন উইংস ও টিয়ারা সহ রিয়্যালিস্টিক 3D অবতার প্রম্পট।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      tags: ['3D Girl', 'Golden Wings', 'Bing Image Creator', 'Princess Avatar'],
      variables: [
        { key: 'NAME', label: "Girl's Name", defaultValue: 'AYESHA' }
      ],
      views: 7850,
      copies: 1320,
      isFeatured: false,
      badge: 'Hot',
      createdAt: '2026-09-12'
    },
    {
      id: 'romantic-rain-couple-umbrella',
      title: 'Romantic Couple Under Glowing Umbrella in Monsoon Rain',
      category: 'couple-portraits',
      platform: 'Bing Image Creator',
      promptText: `A realistic 3D romantic couple standing close together under a transparent neon umbrella during gentle evening monsoon rain. The boy has "{BOY_NAME}" written in warm yellow neon text on the back of his stylish denim jacket. The girl is leaning affectionately onto his shoulder with "{GIRL_NAME}" written on her cozy knitted sweater. Raindrops falling through golden streetlight bokeh, reflective wet asphalt street, hyper-realistic emotional cinematic shot.`,
      description: 'রোমান্টিক বৃষ্টির দিনে কাপল ডিপি তৈরির জন্য সবচেয়ে জনপ্রিয় বিং AI প্রম্পট।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
      tags: ['Couple', 'Romantic Rain', 'Monsoon DP', 'Bing AI', 'Love'],
      variables: [
        { key: 'BOY_NAME', label: "Boy's Name", defaultValue: 'ARIF' },
        { key: 'GIRL_NAME', label: "Girl's Name", defaultValue: 'PRIYA' }
      ],
      views: 6540,
      copies: 1120,
      isFeatured: false,
      badge: 'Trending',
      createdAt: '2026-09-10'
    },
    {
      id: 'cyberpunk-neon-hacker-dp',
      title: 'Cyberpunk Neon Hacker with Holographic Interface',
      category: 'cyberpunk-neon',
      platform: 'Midjourney',
      promptText: `Cinematic medium close-up shot of a cybernetic hacker inside a neon-drenched Tokyo high-rise rooftop at 3 AM. Glowing cyan and magenta neon visor reflecting floating holographic terminal code. Raindrops streaming down the window, chromatic aberration, ray-traced reflections, volumetric blue smoke, photorealistic 8K render, Unreal Engine 5 aesthetic --ar 16:9 --v 6.0`,
      description: 'প্রফেশনাল সাইবারপাঙ্ক নিয়ন লুক অবতার তৈরির জন্য মিডজার্নি ও বিং প্রম্পট।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      tags: ['Cyberpunk', 'Neon', 'Hacker', 'Midjourney', 'Futuristic'],
      views: 4320,
      copies: 870,
      isFeatured: false,
      badge: 'Pro',
      createdAt: '2026-09-08'
    },
    {
      id: 'chatgpt-viral-youtube-script',
      title: 'Viral YouTube Video Script Blueprint & Hook Formula',
      category: 'chatgpt-marketing',
      platform: 'ChatGPT',
      promptText: `Act as a top-tier YouTube creator and master retention scriptwriter with over 5 million subscribers. Write an engaging, high-retention 8-minute YouTube video script on the topic "{TOPIC}". 
Include:
1. Irresistible 5-second Hook with psychological cliffhanger.
2. Visual pacing notes and B-roll sound effect cues (SFX).
3. Value-packed 3 core pillars with fast conversational pacing.
4. Smooth mid-roll call-to-action that does not drop audience retention.
5. High-converting ending CTA urging viewers to watch the next recommended video.`,
      description: 'ChatGPT দিয়ে হাই-রিটেনশন ভাইরাল ইউটিউব ভিডিও স্ক্রিপ্ট লেখার মাস্টার ফ্রেমওয়ার্ক।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
      tags: ['YouTube Script', 'ChatGPT', 'Viral Hook', 'Content Creator'],
      variables: [
        { key: 'TOPIC', label: 'Video Topic', defaultValue: 'How AI will replace traditional jobs in 2026' }
      ],
      views: 5210,
      copies: 1430,
      isFeatured: false,
      badge: 'Free',
      createdAt: '2026-09-05'
    }
  ],
  adSlots: [
    {
      id: 'slot-header-banner',
      name: 'Header Responsive Banner (728x90)',
      placement: 'header_banner',
      network: 'Adsterra',
      code: `<div style="background: rgba(19, 28, 49, 0.4); border: 2px dashed rgba(59, 130, 246, 0.25); border-radius: 12px; padding: 10px; text-align: center; max-width: 728px; margin: 0 auto;">
  <span style="font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Advertisement (728x90 Banner)</span>
  <div style="margin-top: 6px; font-size: 12px; color: #38bdf8;">Your Adsterra / Monetag / CPMBid / HilltopAds Banner appears here</div>
</div>`,
      codeSnippet: `<div style="background: rgba(19, 28, 49, 0.4); border: 2px dashed rgba(59, 130, 246, 0.25); border-radius: 12px; padding: 10px; text-align: center; max-width: 728px; margin: 0 auto;">
  <span style="font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Advertisement (728x90 Banner)</span>
  <div style="margin-top: 6px; font-size: 12px; color: #38bdf8;">Your Adsterra / Monetag / CPMBid / HilltopAds Banner appears here</div>
</div>`,
      enabled: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'slot-in-feed-native',
      name: 'In-Feed Native Grid Card',
      placement: 'in_feed_native',
      network: 'Monetag',
      code: `<div style="background: rgba(19, 28, 49, 0.85); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%; min-height: 280px;">
  <span style="display: inline-block; font-size: 10px; text-transform: uppercase; background: rgba(59, 130, 246, 0.15); color: #38bdf8; padding: 3px 8px; border-radius: 6px; font-weight: bold; width: fit-content; margin: 0 auto 10px;">Sponsored Partner</span>
  <h4 style="font-size: 15px; font-weight: bold; color: #fff; margin-bottom: 6px;">Discover Premium Web Tools & Offers</h4>
  <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">Instant downloads, AI enhancers, and web resources for developers.</p>
  <a href="https://example.com" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none;">Explore Offer ➔</a>
</div>`,
      codeSnippet: `<div style="background: rgba(19, 28, 49, 0.85); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%; min-height: 280px;">
  <span style="display: inline-block; font-size: 10px; text-transform: uppercase; background: rgba(59, 130, 246, 0.15); color: #38bdf8; padding: 3px 8px; border-radius: 6px; font-weight: bold; width: fit-content; margin: 0 auto 10px;">Sponsored Partner</span>
  <h4 style="font-size: 15px; font-weight: bold; color: #fff; margin-bottom: 6px;">Discover Premium Web Tools & Offers</h4>
  <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">Instant downloads, AI enhancers, and web resources for developers.</p>
  <a href="https://example.com" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: bold; text-decoration: none;">Explore Offer ➔</a>
</div>`,
      enabled: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'slot-under-code-modal',
      name: 'Under Code Snippet Ad (High CTR)',
      placement: 'under_prompt_modal',
      network: 'CPMBid',
      code: `<div style="background: rgba(19, 28, 49, 0.6); border: 1px dashed rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 12px; text-align: center; margin: 16px 0;">
  <span style="font-size: 10px; color: #94a3b8; font-weight: bold;">SPONSORED ADVERTISEMENT</span>
  <p style="font-size: 12px; color: #38bdf8; margin: 4px 0 0;">Place your Adsterra 468x60, 300x250, or native ad code here</p>
</div>`,
      codeSnippet: `<div style="background: rgba(19, 28, 49, 0.6); border: 1px dashed rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 12px; text-align: center; margin: 16px 0;">
  <span style="font-size: 10px; color: #94a3b8; font-weight: bold;">SPONSORED ADVERTISEMENT</span>
  <p style="font-size: 12px; color: #38bdf8; margin: 4px 0 0;">Place your Adsterra 468x60, 300x250, or native ad code here</p>
</div>`,
      enabled: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'slot-sticky-footer',
      name: 'Sticky Floating Bottom Banner',
      placement: 'sticky_footer',
      network: 'HilltopAds',
      code: `<div style="text-align: center; padding: 4px 0;">
  <span style="font-size: 10px; color: #94a3b8;">Sponsor Banner (HilltopAds / Clickadu / Monetag)</span>
  <div style="font-size: 12px; color: #e2e8f0; font-weight: bold;">Unlock High Speed Downloads & AI Pro Prompts</div>
</div>`,
      codeSnippet: `<div style="text-align: center; padding: 4px 0;">
  <span style="font-size: 10px; color: #94a3b8;">Sponsor Banner (HilltopAds / Clickadu / Monetag)</span>
  <div style="font-size: 12px; color: #e2e8f0; font-weight: bold;">Unlock High Speed Downloads & AI Pro Prompts</div>
</div>`,
      enabled: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'slot-direct-link-popunder',
      name: 'Direct Link / Popunder Script',
      placement: 'direct_link_popunder',
      network: 'Clickadu',
      code: `<!-- Place Clickadu / Adsterra / Monetag Popunder / Direct Link script here -->`,
      codeSnippet: `<!-- Place Clickadu / Adsterra / Monetag Popunder / Direct Link script here -->`,
      enabled: false,
      lastUpdated: new Date().toISOString()
    }
  ]
};
