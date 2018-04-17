import React from 'react';
import debounce from 'lodash/debounce';
import ResizeObserver from 'resize-observer-polyfill';

export default function withParentSize(
  BaseComponent,
  containerProps = {
    style: {
      width: '100%',
      height: '100%',
    },
  },
) {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        parentWidth: null,
        parentHeight: null,
      }

      this.handleResize = debounce(
        this.resize.bind(this),
        props.resizeDebounceTime,
      ).bind(this);
      this.setContainerRef = this.setContainerRef.bind(this);
    }

    componentDidMount() {
      this.resizeObserver = new ResizeObserver((entries, observer) => {
        for (const entry of entries) {
          // use contentRect over getBoundingClientRect() because this is called before paint
          this.resize(entry.contentRect);
        }
      });

      this.resizeObserver.observe(this.container);
      this.resize();
    }

    componentWillUnmount() {
      this.resizeObserver.disconnect();
    }

    setContainerRef(ref) {
      this.container = ref;
    }

    resize(contentRect) {
      console.log('resize', contentRect)
      if (this.container) {
        const rect = contentRect || this.container.getBoundingClientRect();
        const { width: parentWidth, height: parentHeight } = rect;
        this.setState(() => ({ parentWidth, parentHeight }));
      }
    }

    render() {
      const { parentWidth, parentHeight } = this.state;
      return (
        <div ref={this.setContainerRef} {...containerProps}>
          {parentWidth !== null && parentHeight !== null &&
            <BaseComponent
              parentWidth={parentWidth}
              parentHeight={parentHeight}
              {...this.props}
            />}
        </div>
      );
    }
  }

  WrappedComponent.defaultProps = {
    resizeDebounceTime: 300,
  };

  return WrappedComponent;
}
