import LottieView from 'lottie-react-native';
import * as React from 'react';
import {
  Animated,
  Easing,
  Image,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LottieExamplePicker, {
  Example,
} from '../example-picker/example-picker.component';

const AnimatedSlider = Animated.createAnimatedComponent(Slider);

const playIcon = require('@@assets/images/play.png');
const pauseIcon = require('@@assets/images/pause.png');
const loopIcon = require('@@assets/images/loop.png');
const inverseIcon = require('@@assets/images/inverse.png');

const makeExample = (
  name: string,
  getJson: () => AnimationObject,
  width?: number
): Example => {
  return { name, getJson, width };
};

const EXAMPLES: ReadonlyArray<Example> = [
  makeExample('Hamburger Arrow', () =>
    require('@@assets/animations/HamburgerArrow.json')
  ),
  makeExample(
    'Hamburger Arrow (200 px)',
    () => require('@@assets/animations/HamburgerArrow.json'),
    200
  ),
  makeExample('Line Animation', () =>
    require('@@assets/animations/LineAnimation.json')
  ),
  makeExample('Lottie Logo 1', () =>
    require('@@assets/animations/LottieLogo1.json')
  ),
  makeExample('Lottie Logo 2', () =>
    require('@@assets/animations/LottieLogo2.json')
  ),
  makeExample('Lottie Walkthrough', () =>
    require('@@assets/animations/LottieWalkthrough.json')
  ),
  makeExample('Pin Jump', () => require('@@assets/animations/PinJump.json')),
  makeExample('Twitter Heart', () =>
    require('@@assets/animations/TwitterHeart.json')
  ),
  makeExample('Watermelon', () =>
    require('@@assets/animations/Watermelon.json')
  ),
  makeExample('Motion Corpse', () =>
    require('@@assets/animations/MotionCorpse-Jrcanest.json')
  ),
];

interface State {
  readonly example: Example;
  readonly duration: number;
  readonly isPlaying: boolean;
  readonly isInverse: boolean;
  readonly loop: boolean;
  readonly progress?: Animated.AnimatedValue;
}
export default class LottieAnimatedExample extends React.Component<{}, State> {
  state: State = {
    example: EXAMPLES[0],
    duration: 3000,
    isPlaying: true,
    isInverse: false,
    loop: true,
  };
  // tslint:disable-next-line:readonly-keyword
  private anim = React.createRef<LottieView>();

  render(): JSX.Element {
    const {
      duration,
      isPlaying,
      isInverse,
      progress,
      loop,
      example,
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <LottieExamplePicker
          example={example}
          examples={EXAMPLES}
          onChange={(e, index) => {
            this.stopAnimation();
            this.setState({ example: EXAMPLES[index] });
          }}
        />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <LottieView
            ref={this.anim}
            autoPlay={!progress}
            style={[
              example.width && { width: example.width },
              isInverse && styles.lottieViewInvse,
            ]}
            source={example.getJson()}
            progress={progress}
            loop={loop}
            enableMergePathsAndroidForKitKatAndAbove={true}
          />
        </View>
        <View style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={() => {
                this.stopAnimation();
                this.setState(state => ({ loop: !state.loop }));
              }}
              disabled={!!progress}
            >
              <Image
                style={[
                  styles.controlsIcon,
                  loop && styles.controlsIconEnabled,
                  !!progress && styles.controlsIconDisabled,
                ]}
                resizeMode="contain"
                source={loopIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playButton}
              onPress={this.onPlayPress}
            >
              <Image
                style={styles.playButtonIcon}
                resizeMode="contain"
                source={isPlaying ? pauseIcon : playIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onInversePress}>
              <Image
                style={styles.controlsIcon}
                resizeMode="contain"
                source={inverseIcon}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 10,
            }}
          >
            <Text>Use Imperative API:</Text>
            <View />
            <Switch
              onValueChange={i => {
                this.stopAnimation();
                this.setState(() => ({
                  progress: !i ? new Animated.Value(0) : undefined,
                }));
              }}
              value={!progress}
            />
          </View>
          <View style={{ paddingBottom: 10 }}>
            <View>
              <Text>Progress:</Text>
            </View>
            <AnimatedSlider
              minimumValue={0}
              maximumValue={1}
              value={progress || 0}
              onValueChange={this.onProgressChange}
              disabled={!progress}
            />
          </View>
          <View>
            <View>
              <Text>Duration: ({Math.round(duration)}ms)</Text>
            </View>
            <Slider
              step={50}
              minimumValue={50}
              maximumValue={4000}
              value={duration}
              onValueChange={this.onDurationChange}
              disabled={!progress}
            />
          </View>
        </View>
      </View>
    );
  }

  private manageAnimation = (shouldPlay: boolean): void => {
    if (!this.state.progress) {
      if (this.anim.current) {
        if (shouldPlay) {
          this.anim.current.play();
        } else {
          this.anim.current.reset();
        }
      }
    } else {
      this.state.progress.setValue(0);

      if (shouldPlay) {
        Animated.timing(this.state.progress, {
          toValue: 1,
          duration: this.state.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          this.setState({ isPlaying: false });
        });
      }
    }

    this.setState({ isPlaying: shouldPlay });
  };

  private onPlayPress = () => this.manageAnimation(!this.state.isPlaying);
  private stopAnimation = () => this.manageAnimation(false);

  private onInversePress = () =>
    this.setState(state => ({ isInverse: !state.isInverse }));

  private onProgressChange = (progress: number) => {
    if (this.state.progress) {
      this.state.progress.setValue(progress);
    }
  };

  private onDurationChange = (duration: number) => this.setState({ duration });
}

const PLAY_BUTTON_SIZE = 60;
const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  playButton: {
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
    backgroundColor: '#1d8bf1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonIcon: {
    width: 16,
    height: 16,
  },
  controlsIcon: {
    width: 24,
    height: 24,
    padding: 8,
  },
  controlsIconEnabled: {
    tintColor: '#1d8bf1',
  },
  controlsIconDisabled: {
    tintColor: '#aaa',
  },
  lottieView: {
    flex: 1,
  },
  lottieViewInvse: {
    backgroundColor: 'black',
  },
});
