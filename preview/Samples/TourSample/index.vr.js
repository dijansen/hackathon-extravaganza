/**
 * The examples provided by Oculus are for non-commercial testing and
 * evaluation purposes only.
 *
 * Oculus reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * OCULUS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Example ReactVR app that allows a simple tour using linked 360 photos.
 */
'use strict';

import React from 'react';
import {
  AppRegistry,
  asset,
  Image,
  Pano,
  Text,
  View,
} from 'react-vr';

import InfoButton from './InfoButton';
import NavButton from './NavButton';
import LoadingSpinner from './LoadingSpinner';
import * as TourConfig from './tourOfTheChester.json'

/**
 * ReactVR component that allows a simple tour using linked 360 photos.
 * Tour includes nav buttons, activated by gaze-and-fill or direct selection,
 * that move between tour locations and info buttons that display tooltips with
 * text and/or images. Tooltip data and photo URLs are read from a JSON file.
 */
class TourSample extends React.Component {
  constructor(props) {
    super(props);

    // Initialize the tour based on data file.
    this.state = {
      data: TourConfig,
      //locationId: TourConfig.firstPhotoId, // AJR
      locationId: null, // AJR
      nextLocationId: TourConfig.firstPhotoId,
      rotation: TourConfig.firstPhotoRotation +
        (TourConfig.photos[TourConfig.firstPhotoId].rotationOffset || 0),
    };

    // Set back UI elements from the camera (which is positioned at origin).
    this.translateZ = -3;
  }

  render() {
    if (!this.state.data) {
      return null;
    }

    const locationId = this.state.locationId;
    const photoData = (locationId && this.state.data.photos[locationId]) || null;
    const tooltips = (photoData && photoData.tooltips) || null;
    const rotation = this.state.data.firstPhotoRotation +
      ((photoData && photoData.rotationOffset) || 0);
    const isLoading = this.state.nextLocationId !== this.state.locationId;

    return (

      <View>
        <View style={{transform:[{rotateY: rotation}]}}>
          <Pano
            // Place pano in world, and by using position absolute it does not
            // contribute to the layout of other views.
            style={{
              position: 'absolute',
              backgroundColor: isLoading ? 'grey' : 'white',
            }}
            onLoad={() => {
              const data = this.state.data;
              this.setState({
                // Now that ths new photo is loaded, update the locationId.
                locationId: this.state.nextLocationId,
              });
            }}
            source={asset(this.state.data.photos[this.state.nextLocationId].uri)}
          />
          {tooltips && tooltips.map((tooltip, index) => {
            // Iterate through items related to this location, creating either
            // info buttons, which show tooltip on hover, or nav buttons, which
            // change the current location in the tour.
            if (tooltip.type) {
              return(
                <InfoButton
                  key={index}
                  rotateY={tooltip.position[0]}
                  source={asset('info_icon.png')}
                  tooltip={tooltip}
                  translateZ={this.translateZ}
                />
              );
            }
            return(
              <NavButton
                key={tooltip.linkedPhotoId}
                isLoading={isLoading}
                onInput={() => {
                  // Update nextLocationId, not locationId, so tooltips match
                  // the currently visible pano; pano will update locationId
                  // after loading the new image.
                  this.setState({nextLocationId: tooltip.linkedPhotoId});
                }}
                rotateY={tooltip.position[0]}
                source={asset(this.state.data.nav_icon)}
                textLabel={tooltip.text}
                translateZ={this.translateZ}
              />
            );
          })}
        </View>
        {locationId == null &&
          // Show a spinner while first pano is loading. Adjust layoutOrigin
          // so it appears in center of screen. Nav Buttons also show a spinner
          // if there is a delay is loading the next pano.
          <View
            style={{
              transform: [{translateZ: this.translateZ}],
              layoutOrigin: [0.5, 0.5, 0],
            }}
            height={0.5}
            width={0.5}
          >
            <LoadingSpinner />
          </View>
        }
      </View>
    );
  }
};

// Name used to create module, via reactNativeContext.createRootView('TourSample')
AppRegistry.registerComponent('TourSample', () => TourSample);
