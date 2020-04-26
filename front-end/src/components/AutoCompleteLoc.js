import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Input } from 'reactstrap';

const google = window.google

const searchOptions = {
    location: new google.maps.LatLng(37.9838106, 23.727539),
    radius: 200000,
    types: ['address']
}
 
class AutoCompleteLoc extends Component {
    constructor(props) {
        super(props);
        this.state = { address: '' };
    }

    handleChange = address => {
        this.setState({ 
          address: address 
        }, () => {
          this.props.handleLocation(address)
        });
    };

    render() {
    return (
      <PlacesAutocomplete value={this.state.address} onChange={this.handleChange} searchOptions={searchOptions}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <Input {...getInputProps({ className: 'location-search-input'})}/>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';

                const style = suggestion.active
                  ? { backgroundColor: '#f5f5f5', cursor: 'pointer'}
                  : { backgroundColor: '#ffffff', cursor: 'pointer'};
                return (
                  <div {...getSuggestionItemProps(suggestion, { className, style })}>
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
    }
}

export default AutoCompleteLoc