import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';

// Background particles effect (get from react particle js page)
const paritclesOptions = {
    particles: {
        number: {
          value: 13,
          density:{
            enable: true,
            value_area: 100
          }
        }
    }
}

const initialState = {
      input: '',      // data entered from input field
      imageUrl: '',   // image URL
      box: {},        // face box
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        password: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component{
  constructor(){
    super();
    this.state = initialState;
  }

  // Calculates face location (pass in Clarifai data)
  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: face.left_col * width, 
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  // Set box state with the passed in face location
  displayFaceBox = (box) => {
    this.setState({box});
  }

  // Set input state with data entered from input field
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // Set imageUrl state and use Clarifai to draw face box
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      // Post request to send submitted image to backend to call Clarifai API
      fetch('http://localhost:3001/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(entriesCount => {
              this.setState(Object.assign(this.state.user, { entries: entriesCount}));
            })
            .catch(err => console.log(err))
        }
        this.displayFaceBox(this.calculateFaceLocation(response))  // calculate face location and draw face box
      })
      .catch(err => console.log(err));  // catch error if any
  }

  // Handle enter pressed
  onEnterPress = event => {
    event.keyCode === 13  && this.onButtonSubmit(event);
  }

  // Load user profile
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      password: data.password,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  // Routing pages
  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    const { imageUrl, box, route, isSignedIn} = this.state;
    return (
      <div className="App">
        {/*Background pariticle effect*/}
        <Particles className='particles'
          params={paritclesOptions} 
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
          ? 
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm    // Submit image and do face detection
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
              onEnterPress={this.onEnterPress}
            />
            <FaceRecognition  //draw face box
              box={box} 
              imageUrl={imageUrl}
            />
          </div>
          : (
              route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;
