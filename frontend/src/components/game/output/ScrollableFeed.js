import React, { createRef, useEffect } from 'react';

// TODO: Make this actually save scroll state
function ScrollableFeed({
  pauseScroll = false, children,
}) {
  const bottomRef = createRef();
  const wrapperRef = createRef();
  const prevBottom = bottomRef.current;
  const prevWrapper = wrapperRef.current;

  useEffect(() => {
    // When children update or pauseScroll changes, scroll if necessary.
    let atBottom = false;
    if (prevWrapper && prevBottom) {
      // If this is changing, check where we are again.
      const parentRect = prevWrapper.getBoundingClientRect();
      const childRect = prevBottom.getBoundingClientRect();
      const childTopIsViewable = childRect.top <= parentRect.top
        && childRect.top >= parentRect.bottom;
      const childBottomIsViewable = childRect.bottom >= parentRect.bottom
        && childRect.bottom <= parentRect.top;
      atBottom = childTopIsViewable && childBottomIsViewable;
    }

    if (!pauseScroll || atBottom) {
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
