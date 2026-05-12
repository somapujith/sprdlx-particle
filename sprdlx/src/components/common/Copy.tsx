import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CopyProps {
  children: React.ReactElement;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
}

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = '#000',
  stagger = 0.15,
  duration = 0.75,
}: CopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefsRef = useRef<any[]>([]);
  const linesRef = useRef<HTMLElement[]>([]);
  const blocksRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    splitRefsRef.current = [];
    linesRef.current = [];
    blocksRef.current = [];

    let elements: Element[] = [];
    if (containerRef.current.hasAttribute('data-copy-wrapper')) {
      elements = Array.from(containerRef.current.children);
    } else {
      elements = [containerRef.current];
    }

    elements.forEach((element) => {
      const split = SplitText.create(element, {
        type: 'lines',
        linesClass: 'block-line++',
        lineThreshold: 0.1,
      });

      splitRefsRef.current.push(split);

      split.lines.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'block-line-wrapper';
        wrapper.style.overflow = 'hidden';
        if (line.parentNode) {
          line.parentNode.insertBefore(wrapper, line);
        }
        wrapper.appendChild(line);

        const block = document.createElement('div');
        block.className = 'block-revealer';
        block.style.backgroundColor = blockColor;
        block.style.position = 'absolute';
        block.style.top = '0';
        block.style.left = '0';
        block.style.width = '100%';
        block.style.height = '100%';
        block.style.pointerEvents = 'none';
        wrapper.style.position = 'relative';
        wrapper.appendChild(block);

        linesRef.current.push(line as HTMLElement);
        blocksRef.current.push(block);
      });
    });

    gsap.set(linesRef.current, { opacity: 0 });
    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: 'left center' });

    const createBlockRevealAnimation = (
      block: HTMLElement,
      line: HTMLElement,
      index: number
    ) => {
      const tl = gsap.timeline({ delay: delay + index * stagger });

      tl.to(block, { scaleX: 1, duration, ease: 'power4.inOut' });
      tl.set(line, { opacity: 1 });
      tl.set(block, { transformOrigin: 'right center' });
      tl.to(block, { scaleX: 0, duration, ease: 'power4.inOut' });

      return tl;
    };

    if (animateOnScroll) {
      blocksRef.current.forEach((block, index) => {
        const tl = createBlockRevealAnimation(
          block,
          linesRef.current[index],
          index
        );
        tl.pause();

        ScrollTrigger.create({
          trigger: containerRef.current!,
          start: 'top 90%',
          once: true,
          onEnter: () => tl.play(),
        });
      });
    } else {
      blocksRef.current.forEach((block, index) => {
        createBlockRevealAnimation(block, linesRef.current[index], index);
      });
    }

    return () => {
      splitRefsRef.current.forEach((split) => {
        if (split && typeof split.revert === 'function') {
          split.revert();
        }
      });

      const wrappers = containerRef.current?.querySelectorAll(
        '.block-line-wrapper'
      );
      wrappers?.forEach((wrapper) => {
        if (wrapper.parentNode && wrapper.firstChild) {
          wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
          wrapper.remove();
        }
      });
    };
  }, [animateOnScroll, delay, blockColor, stagger, duration]);

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef } as any);
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
