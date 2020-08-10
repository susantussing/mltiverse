import React, { createRef, useEffect } from 'react';

function ScrollableFeed({
  pauseScroll = false, children,
}) {
  const bottomRef = createRef();
  const wrapperRef = createRef();
  const prevBottom = bottomRef.current;
  const prevWrapper = wrapperRef.current;

  useEffect(() => {
    // When children update or alwaysScroll changes, scroll if necessary.
    const atBottom = () => {
      const parentRect = prevWrapper.getBoundingClientRect();
      const childRect = prevBottom.getBoundingClientRect();
      const childTopIsViewable = childRect.top <= parentRect.top
        && childRect.top >= parentRect.bottom;
      const childBottomIsViewable = childRect.bottom >= parentRect.bottom
        && childRect.bottom <= parentRect.top;
      return childTopIsViewable && childBottomIsViewable;
    };
    if (!pauseScroll || atBottom()) {
      bottomRef.current.scrollIntoView();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, pauseScroll]);

  return (
    <div ref={wrapperRef}>
      {children}
      <div ref={bottomRef} />
    </div>
  );
}

export default ScrollableFeed;