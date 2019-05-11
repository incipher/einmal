import * as React from 'react';

type State = {
  seconds: number;
};

type InjectedProps = {
  seconds: number;
};

export default function withClock<OriginalProps>(
  WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>,
) {
  return class extends React.Component<{}, State> {
    state: State = {
      seconds: 0,
    };

    _timerId: number = 0;

    componentDidMount() {
      /* FIXME: Use UNIX seconds (factual passage of time) */
      this._timerId = setInterval(this._incrementSeconds, 1000);
    }

    componentWillUnmount() {
      clearInterval(this._timerId);
    }

    _incrementSeconds = () => {
      this.setState(state => ({
        seconds: state.seconds + 1,
      }));
    };

    render() {
      return (
        <WrappedComponent
          seconds={this.state.seconds}
          {...this.props as OriginalProps}
        />
      );
    }
  };
}

export type ClockData = InjectedProps;
