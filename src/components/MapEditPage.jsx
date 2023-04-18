import React, { useState, useEffect } from 'react';
import MapCells from './MapCells';

function MapEditPage(props) {

	return (
		<div>
			<div>
				<div className="title_input_box">
					<textarea
						className='title_input'
						rows='1'
						placeholder='Set Title'
						value={props.title}
            // onChange={(e) => setTitle(e.target.value)}
          />
				</div>
				<div className="tag_box">
          <button className={`edit_page_btns`}
          // onClick={handleCharacter}
          >
						Character
					</button>
          <button className={`edit_page_btns`}
          // onClick={handleLore}
          >
						Lore
					</button>
          <button className={`edit_page_btns`}
            // onClick={handleMap}
          >
						Map
					</button>
          <button className='edit_page_btns'
            // onClick={() => { updateNote(); }}
          >
            Save Tags
          </button>
				</div>
			</div>
			<div>
				<div className='map' style={{ backgroundImage: 'url("https://i.pinimg.com/originals/ca/35/48/ca3548a64c848549747bd88a1e5a14bc.png")'}}>
					{/* <img src={props.src}></img> */}
					<MapCells />
				</div>
			</div>
			<div>
				{/* <button onClick={handleDelete}>Trash</button> */}
			</div>
		</div>
	)
}

export default MapEditPage;