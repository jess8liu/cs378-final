import React, { useState } from "react";
import SettingList from "./SettingList";

function MapNote(props) {
	const [setting, setSetting] = useState(false);
	const edit_funct = props.edit_funct;

	const toggleSetting = (e) => {
		e.preventDefault();
		setSetting(!setting);
	};

	return (
		<>
			<div className="singular_note">
				<div className="title_section">
					<div className="title">
						{props.title}
					</div>
					<button className="save_btn img_btn"
						onClick={props.edit_funct} title="Edit Note">
						<img className="btn_img" src={note_edit} alt="Note editing icon."/>
					</button>
				</div>

				<div className="body_section">
					{/* Input Section (for notes) */}
					<div className="body_image">
						<img src={props.src} width="100%" />
					</div>
				</div>

				<div className="body_section">
					<button className="setting_btn"
					onClick={toggleSetting}
					>
						Settings
					</button>

					<button className="trash_btn"
						onClick={() => props.deleteImage(props.src)}
					>
						Trash
					</button>
				</div>

				{/* Settings List */}
				{
					setting &&
					<>
						<div className="dropdown_div">
							<SettingList
								edit_funct={edit_funct} />
						</div>
					</>

				}
			</div>
		</>
	);
}

export default MapNote;