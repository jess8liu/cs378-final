import React, { useState, useEffect } from 'react';
import MapCells from './MapCells';

import trash from "../images/trash.svg";

function MapEditPage(props) {
	function alertFunction() {
		alert("Saved!");
	}

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
				</div>
			</div>
			<div className='box'>
				<div className='map' style={{ backgroundImage: 'url("https://i.pinimg.com/originals/ca/35/48/ca3548a64c848549747bd88a1e5a14bc.png")' }}>
					{/* <img src={props.src}></img> */}
					<MapCells />
				</div>
				<button className="trash_edit_btn img_btn"
					title="Delete">
					<img className="btn_img" src={trash} />
				</button>
				<button className='edit_save_btn' onClick={alertFunction}> Save Changes </button>
			</div>
		</div>
	)
}

export default MapEditPage;