import React from 'react';

const Rank = ( {name, entries} ) => {
	return(
		<div>
			<div className='white f3'>
				{`Hi ${name}, the total number of image URLs you have submitted is:`}
			</div>
			<div className='white f1'>
				{entries}
			</div>
		</div>
	);
}

export default Rank;