// Byte Avatar - using Bible Strong vendored runtime with Freddy definition
import { forwardRef, useImperativeHandle, useRef } from 'react';
import Avatar from './bible-strong/Avatar';
import { avatarData } from './freddy.avatar';
import type { AnimationName } from './freddy.avatar';

export type { AnimationName } from './freddy.avatar';

export type AvatarHandle = {
  play: (animation?: AnimationName) => void;
};

export type AvatarProps = {
  animation?: AnimationName;
  playing?: boolean;
  loop?: boolean;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onAnimationEnd?: (animation: AnimationName) => void;
};

export const ByteAvatar = forwardRef<AvatarHandle, AvatarProps>(
  function ByteAvatar(
    { animation = 'idle', playing = true, size = 96, className, style },
    ref
  ) {
    const avatarRef = useRef<any>(null);

    useImperativeHandle(
      ref,
      () => ({
        play(anim = animation) {
          avatarRef.current?.play(anim);
        },
      }),
      [animation]
    );

    return (
      <Avatar
        ref={avatarRef}
        definition={avatarData as any}
        defaultAnimation={animation}
        autoplay={playing}
        size={size}
        className={className}
        style={style}
        ariaLabel="Byte, the portfolio companion"
      />
    );
  }
);

export default ByteAvatar;
