import { logger } from '@/utils/logger';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

type EngineState = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';

interface YouTubeEngineCallbacks {
  onStateChange?: (state: EngineState) => void;
  onDurationChange?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onError?: (errorCode: number) => void;
  onEnded?: () => void;
}

class YouTubeAudioEngine {
  private player: any = null;
  private isApiLoaded = false;
  private isPlayerReady = false;
  private queuedVideoId: string | null = null;
  private tickerInterval: any = null;
  private callbacks: YouTubeEngineCallbacks = {};
  private currentDuration = 0;
  private volumeLevel = 80;

  constructor() {
    this.initApi();
  }

  /**
   * Carrega dinamicamente o script da YouTube IFrame API
   */
  private initApi() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.isApiLoaded = true;
      this.mountPlayer();
      return;
    }

    // Registra o callback global esperado pela API do YouTube
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousReady) previousReady();
      this.isApiLoaded = true;
      logger.info('[YouTubeAudioEngine] YouTube IFrame API pronta!');
      this.mountPlayer();
    };

    // Insere o script no DOM se ainda não foi inserido
    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }

  /**
   * Cria o contêiner invisível e inicializa a instância do player YT
   */
  private mountPlayer() {
    if (!this.isApiLoaded || this.player) return;

    let container = document.getElementById('moosic-yt-engine');
    if (!container) {
      container = document.createElement('div');
      container.id = 'moosic-yt-engine';
      // Posiciona fora da tela de forma 100% imperceptível
      container.style.position = 'fixed';
      container.style.bottom = '-9999px';
      container.style.right = '-9999px';
      container.style.width = '200px';
      container.style.height = '200px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-100';
      document.body.appendChild(container);
    }

    try {
      this.player = new window.YT.Player('moosic-yt-engine', {
        height: '200',
        width: '200',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            this.isPlayerReady = true;
            logger.info('[YouTubeAudioEngine] Player invisível pronto!');
            event.target.setVolume(this.volumeLevel);
            if (this.queuedVideoId) {
              const vid = this.queuedVideoId;
              this.queuedVideoId = null;
              this.loadVideo(vid, true);
            }
          },
          onStateChange: (event: any) => {
            this.handleStateChange(event.data);
          },
          onError: (event: any) => {
            logger.warn('[YouTubeAudioEngine] Erro no player:', event.data);
            if (this.callbacks.onError) {
              this.callbacks.onError(event.data);
            }
          },
        },
      });
    } catch (err) {
      logger.error('[YouTubeAudioEngine] Erro ao instanciar YT.Player:', err);
    }
  }

  private handleStateChange(stateCode: number) {
    let stateStr: EngineState = 'unstarted';
    switch (stateCode) {
      case -1:
        stateStr = 'unstarted';
        break;
      case 0:
        stateStr = 'ended';
        this.stopTicker();
        if (this.callbacks.onEnded) this.callbacks.onEnded();
        break;
      case 1:
        stateStr = 'playing';
        this.startTicker();
        // Atualiza a duração oficial da música completa
        if (this.player && typeof this.player.getDuration === 'function') {
          const dur = this.player.getDuration();
          if (dur > 0) {
            this.currentDuration = dur;
            if (this.callbacks.onDurationChange) {
              this.callbacks.onDurationChange(dur);
            }
          }
        }
        break;
      case 2:
        stateStr = 'paused';
        this.stopTicker();
        break;
      case 3:
        stateStr = 'buffering';
        break;
      case 5:
        stateStr = 'cued';
        break;
    }

    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(stateStr);
    }
  }

  private startTicker() {
    this.stopTicker();
    // Ticker a cada 100ms para manter a timeline suave
    this.tickerInterval = setInterval(() => {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        const cur = this.player.getCurrentTime();
        const dur = this.player.getDuration() || this.currentDuration;
        if (this.callbacks.onTimeUpdate) {
          this.callbacks.onTimeUpdate(cur, dur);
        }
      }
    }, 100);
  }

  private stopTicker() {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
  }

  /**
   * Registra callbacks de evento para o player context
   */
  public subscribe(callbacks: YouTubeEngineCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Carrega um vídeo do YouTube e inicia reprodução imediata
   */
  public loadVideo(videoId: string, autoPlay = true) {
    if (!this.isPlayerReady || !this.player) {
      this.queuedVideoId = videoId;
      logger.info(`[YouTubeAudioEngine] Player ainda inicializando, enfileirando: ${videoId}`);
      return;
    }

    logger.info(`[YouTubeAudioEngine] Carregando faixa: ${videoId}`);
    try {
      if (autoPlay) {
        this.player.loadVideoById({
          videoId,
          startSeconds: 0,
        });
      } else {
        this.player.cueVideoById({
          videoId,
          startSeconds: 0,
        });
      }
    } catch (err) {
      logger.error('[YouTubeAudioEngine] Falha ao chamar loadVideoById:', err);
    }
  }

  public play() {
    if (this.player && typeof this.player.playVideo === 'function') {
      this.player.playVideo();
    }
  }

  public pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo();
    }
  }

  public seekTo(seconds: number) {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(seconds, true);
    }
  }

  public setVolume(volume0to100: number) {
    this.volumeLevel = Math.max(0, Math.min(100, volume0to100));
    if (this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(this.volumeLevel);
    }
  }

  public mute() {
    if (this.player && typeof this.player.mute === 'function') {
      this.player.mute();
    }
  }

  public unMute() {
    if (this.player && typeof this.player.unMute === 'function') {
      this.player.unMute();
    }
  }

  public getCurrentTime(): number {
    if (this.player && typeof this.player.getCurrentTime === 'function') {
      return this.player.getCurrentTime() || 0;
    }
    return 0;
  }

  public getDuration(): number {
    if (this.player && typeof this.player.getDuration === 'function') {
      return this.player.getDuration() || this.currentDuration;
    }
    return this.currentDuration;
  }

  public isReady(): boolean {
    return this.isPlayerReady;
  }
}

export const youtubeAudioEngine = new YouTubeAudioEngine();
