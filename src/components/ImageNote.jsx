import React, { useEffect, useState } from "react";
import { storage } from "./config.jsx";
import { ref as storageRef, uploadBytes, listAll, getDownloadURL, deleteObject, updateMetadata, uploadBytesResumable, getMetadata } from "firebase/storage";
import SettingList from "./SettingList.jsx";

// Icons & images
import note_edit from "../images/note_edit.svg";
import trash from "../images/trash.svg";

function ImageNote(props) {
	const edit_funct = props.edit_funct;
	const [title, setTitle] = useState('');
	const [setting, setSetting] = useState(false);

	const toggleSetting = (e) => {
		e.preventDefault();
		setSetting(!setting);
	};


	useEffect(() => {
		const imageRef = storageRef(storage, props.src);
		getMetadata(imageRef).then((metadata) => {
			setTitle(metadata.customMetadata.noteTitle);
		}).catch((error) => {
			alert(error);
		})
	}, []);


	return (
		<>
			<div className="singular_note">
				<div className="title_section">
					<div className="title">
						{title}
					</div>
					<button className="save_btn img_btn"
						onClick={props.edit_funct} title="Edit Note">
						<img className="btn_img" src={note_edit} alt="Note editing icon." />
					</button>
				</div>

				<div className="body_section">
					{/* Input Section (for notes) */}
					<div className="body_image">
						<img src={props.src} width="100%" />
					</div>
				</div>

				<div className="body_section">
					{/* <button className="setting_btn"
					onClick={toggleSetting}
					>
						Settings
					</button> */}

					<button className="small_img_btn" onClick={() => props.deleteImage(props.src)}>
						<img className="btn_img" src={trash} alt="Trash icon." title="Delete Note" />
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
			</div >
		</>
	);
}

export default ImageNote;