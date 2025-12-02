import * as React from "react";
import { cn } from "../../lib/utils";

const ScrollArea = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const scrollRef = React.useRef(null);
    const [showScrollbar, setShowScrollbar] = React.useState(false);

    React.useEffect(() => {
      const element = scrollRef.current;
      if (!element) return;

      const checkScroll = () => {
        setShowScrollbar(
          element.scrollHeight > element.clientHeight ||
          element.scrollWidth > element.clientWidth
        );
      };

      checkScroll();
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(element);

      return () => resizeObserver.disconnect();
    }, [children]);

    return (
      <div
        ref={ref || scrollRef}
        className={cn(
          "relative overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500",
          className
        )}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: showScrollbar ? "#4b5563 transparent" : "transparent transparent",
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };

