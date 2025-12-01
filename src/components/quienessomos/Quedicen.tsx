import React, { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "../../assets/medium-shot-smiley-woman-with-crossed-arms (1).png";
interface Testimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

const Quedicen: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
    {
      text:
        "rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat..... ",
      name: "Karen",
      role: "Lorem ipsum dolor",
      avatar: Avatar,
    },
  ];

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState<number>(getVisibleCount());
  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loopList = useMemo(() => [...testimonials, ...testimonials], [testimonials]);
  const innerSlides = loopList.length;

  const [index, setIndex] = useState<number>(0);

  const innerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastAdvanceRef = useRef<number>(performance.now());
  const isSnappingRef = useRef(false);
  const transitionDuration = 550;
  const AUTO_MS = 4000;

  const slideWidthInnerPercent = 100 / innerSlides;
  const containerWidthPercent = (innerSlides / visibleCount) * 100;

  const applyTransform = (idx: number, animate = true) => {
    const el = innerRef.current;
    if (!el) return;
    const translate = -(idx * slideWidthInnerPercent);
    if (animate) {
      el.style.transition = `transform ${transitionDuration}ms ease-in-out`;
    } else {
      el.style.transition = "none";
    }
    el.style.transform = `translateX(${translate}%)`;
  };

  const snapTo = (i: number) => {
    setIndex(i);
    applyTransform(i, true);
    lastAdvanceRef.current = performance.now();
    isSnappingRef.current = true;
    window.setTimeout(() => {
      isSnappingRef.current = false;
      if (innerRef.current) innerRef.current.style.transition = "";
    }, transitionDuration + 20);
  };

  const next = () => {
    const nextI = (index + 1) % testimonials.length;
    snapTo(nextI);
  };

  const prev = () => {
    const prevI = (index - 1 + testimonials.length) % testimonials.length;
    snapTo(prevI);
  };

  const onDotClick = (i: number) => {
    snapTo(i);
  };

  useEffect(() => {
    lastAdvanceRef.current = performance.now();

    const loop = (now: number) => {
      if (!isSnappingRef.current) {
        const elapsed = now - lastAdvanceRef.current;
        if (elapsed >= AUTO_MS) {
          const nextI = (index + 1) % testimonials.length;
          setIndex(nextI);
          applyTransform(nextI, true);
          lastAdvanceRef.current = now;
          isSnappingRef.current = true;
          window.setTimeout(() => {
            isSnappingRef.current = false;
            if (innerRef.current) innerRef.current.style.transition = "";
          }, transitionDuration + 20);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [index, testimonials.length, slideWidthInnerPercent, visibleCount]);

  useEffect(() => {
    applyTransform(index, false);
  }, [visibleCount, innerSlides]);

  return (
    <div className="w-full bg-[#026432] overflow-hidden py-10">
     
    

      <h2
        className="
          text-[rgba(243,243,243,1)] font-bold 
          lg:text-[64px] md:text-[48px] text-3xl
          leading-tight tracking-wide text-center max-w-7xl mx-auto mb-10 px-4
        "
      >
        ¿Qué dicen nuestros clientes?
      </h2>

      <div className="relative w-full flex items-center justify-center px-4">

        {/* LEFT ARROW — now closer to cards */}
        <button
          onClick={prev}
          aria-label="Previous testimonials"
          className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 lg:left-52
          text-orange-400 text-4xl cursor-pointer z-20 hidden md:flex items-center justify-center
          w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 transition-all"
          style={{ backdropFilter: "blur(2px)" }}
        >
          ❮
        </button>

        <div className="overflow-hidden w-full max-w-7xl">
          <div
            ref={innerRef}
            className="flex items-start gap-10 will-change-transform"
            style={{
              width: `${containerWidthPercent}%`,
            }}
          >
            {loopList.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-start mx-auto"
                style={{ width: `${slideWidthInnerPercent}%` }}
              >
                <div className="mx-auto w-full flex justify-center">
                  <div
                    className="relative bg-white rounded-[18px] shadow-md"
                    style={{
                      width: "min(92%, 380px)",
                      padding: "22px",
                    }}
                  >
                    <p
                      className="text-left text-gray-800"
                      style={{
                        fontSize: "clamp(13px, 1.3vw, 16px)",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.text}
                    </p>

                    <div className="flex text-orange-400 text-xl mt-4">★★★★★</div>

                    <div
                      aria-hidden
                      className="absolute"
                      style={{
                        width: 14,
                        height: 14,
                        background: "white",
                        left: 32,
                        bottom: -7,
                        transform: "rotate(45deg)",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 mt-6 mx-auto w-full"
                  style={{ maxWidth: 380 }}
                >
                  <img
                    src={item.avatar}
                    alt={`${item.name} avatar`}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full object-cover border border-[#707070] shadow-lg flex-shrink-0"
                  />
                  <div className="flex flex-col items-start">
                    <h3 className="text-white text-base md:text-lg font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-gray-300 text-sm">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ARROW — now closer to cards */}
        <button
          onClick={next}
          aria-label="Next testimonials"
          className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 lg:right-52 
          text-orange-400 text-4xl cursor-pointer z-20 hidden md:flex items-center justify-center
          w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 transition-all"
          style={{ backdropFilter: "blur(2px)" }}
        >
          ❯
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: testimonials.length }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-white" : "bg-gray-400/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Quedicen;
