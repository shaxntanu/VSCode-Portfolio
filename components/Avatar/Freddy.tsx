
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from 'react'
import { loadAvatarRuntime, type RuntimeAvatar } from './avatar-runtime'
import { avatarData, type AnimationName } from './freddy.avatar'

export type { AnimationName } from './freddy.avatar'
export type AvatarHandle = {
  play: (animation?: AnimationName) => void
  pause: () => void
  stop: () => void
}
export type AvatarProps = {
  animation?: AnimationName
  playing?: boolean
  loop?: boolean
  size?: number | string
  className?: string
  style?: CSSProperties
  onAnimationEnd?: (animation: AnimationName) => void
}

export const Freddy = forwardRef<AvatarHandle, AvatarProps>(function Freddy(
  {
    animation = "idle",
    playing = true,
    loop,
    size = 240,
    className,
    style,
    onAnimationEnd,
  },
  ref
) {
  const host = useRef<HTMLSpanElement>(null)
  const controller = useRef<RuntimeAvatar<AnimationName> | null>(null)
  const animationRef = useRef(animation)
  const playingRef = useRef(playing)
  const onAnimationEndRef = useRef(onAnimationEnd)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  animationRef.current = animation
  playingRef.current = playing
  onAnimationEndRef.current = onAnimationEnd

  useEffect(() => {
    if (!host.current) return
    let disposed = false
    let avatar: RuntimeAvatar<AnimationName> | null = null
    
    console.log('[Freddy] Starting avatar load...')
    setIsLoading(true)
    setLoadError(null)
    
    void loadAvatarRuntime<AnimationName>(avatarData)
      .then(runtime => {
        if (disposed || !host.current) {
          console.log('[Freddy] Disposed before runtime loaded')
          return
        }
        console.log('[Freddy] Runtime loaded, creating avatar')
        avatar = runtime.createAvatar(host.current, {
          animation: animationRef.current,
          autoplay: playingRef.current,
          loop,
          size: '100%',
          onAnimationEnd: next => onAnimationEndRef.current?.(next),
        })
        controller.current = avatar
        setIsLoading(false)
        console.log('[Freddy] Avatar created successfully')
      })
      .catch(error => {
        console.error('[Freddy] Failed to load avatar:', error)
        setLoadError(error.message)
        setIsLoading(false)
      })
    
    return () => {
      disposed = true
      avatar?.destroy()
      controller.current = null
      console.log('[Freddy] Cleanup')
    }
  }, [loop])

  useEffect(() => {
    const avatar = controller.current
    if (!avatar) return
    if (playing) avatar.play(animation)
    else avatar.pause()
  }, [animation, playing])

  useImperativeHandle(ref, () => ({
    play(next = animation) { controller.current?.play(next) },
    pause() { controller.current?.pause() },
    stop() { controller.current?.stop() },
  }), [animation])

  const dimension = typeof size === 'number' ? size + 'px' : size
  
  if (loadError) {
    return <span 
      className={className} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension, 
        height: dimension,
        background: 'rgba(255,0,0,0.1)',
        border: '2px solid red',
        fontSize: '10px',
        color: 'red',
        ...style 
      }}
    >
      Error
    </span>
  }
  
  return <span 
    ref={host} 
    className={className} 
    style={{ 
      display: 'inline-block', 
      width: dimension, 
      height: dimension,
      background: isLoading ? 'rgba(230, 133, 92, 0.1)' : 'transparent',
      ...style 
    }} 
  />
})

export default Freddy
