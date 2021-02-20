import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit, onEnterPress }) => {
	return(
		<div>
			<p className='f3'>
				{'This appplication detects faces in your pictures. Upload a picture now.'}
			</p>
			<div className='center'>
				<div className='pa4 br3 shadow-5 form center'>
					<input 
						className='f4 pa2 w-70 center' 
						type='text' 
						onChange={onInputChange}	// Updates input state
						onKeyDown={onEnterPress}	// Get Clarifai data and draw face box
					/>
					<button 
						className='w-25 grow f4 link ph3 pv2 dib white bg-light-red' 
						onClick={onButtonSubmit}	// Get clarifai data and draw face box
					>Detect</button>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm;