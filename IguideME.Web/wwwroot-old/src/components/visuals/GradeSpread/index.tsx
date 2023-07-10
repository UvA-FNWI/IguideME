import React, { Component } from "react";

export default class GradeSpread extends Component<{
  average: number | undefined, grades: number[]
}> {

  wrapperRef = React.createRef<HTMLDivElement>();

  render(): React.ReactNode {
    const { average, grades } = this.props;
    const height = 5;
    const width = this.wrapperRef.current ?
      this.wrapperRef.current.getBoundingClientRect().width : 0

    return (
      <div ref={this.wrapperRef}>
        <svg width={width} height={30}>
          <rect x={0}
                y={height}
                fill={'#bbbbbb'}
                height={height}
                width={width}
          />

          { average &&
            <rect x={((average / 10) * width) - 4}
                  y={0}
                  fill={'rgb(90, 50, 255)'}
                  height={height * 3}
                  width={4}
            />
          }

          <rect x={(Math.min(...grades) / 10) * width}
                y={height}
                fill={'rgb(90, 50, 255)'}
                height={height}
                width={((Math.max(...grades) / 10) * width) - ((Math.min(...grades) / 10) * width)}
          />
        </svg>
      </div>
    )
  }
}