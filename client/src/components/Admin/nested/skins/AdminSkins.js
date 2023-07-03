import {AddSkinPopup} from "./AddSkinPopup";
import './AdminSkins.scss'
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllSkinsSelector} from "../../../Shop/selectors/selectors";
import {getAllSkins} from "../../../../store/slices/ShopSlice";
import {$api} from "../../../../api/api";
import {addSkin, deleteSkin, getAllUsers} from "../../../../store/slices/AdminSlice";
import {toast} from "react-toastify";

const AdminSkins = () => {
	const [showAddPopup, setShowAddPopup] = useState(false);
	const dispatch = useDispatch()
	const skins = useSelector(getAllSkinsSelector)
	const serverUrl = $api.defaults.baseURL

	const handleAddSkin = (newSkin) => {
		const formData = new FormData()
		formData.append("file", newSkin.image)
		formData.append("name", newSkin.name)
		formData.append("price", newSkin.price)
		dispatch(addSkin(formData))
			.then((response) => {
				if (response.type.toLowerCase().includes("rejected")) {
					toast.error(response.payload || response.payload.message);
				} else {
					toast.success('Скин успешно добавлен');
					dispatch(getAllSkins());
				}
			})
	};

	const handleDeleteSkin = (skinId) => {
		dispatch(deleteSkin(skinId))
			.then((response) => {
				if (response.type.toLowerCase().includes("rejected")) {
					toast.error(response.payload);
				} else {
					toast.success('Скин успешно удален');
					dispatch(getAllSkins());
				}
			})
	};

	useEffect(() => {
		dispatch(getAllSkins())
	}, []);

	return (
		<div className="admin-skins">
			<h1>Список скинов</h1>

			<div className="skins-container">
				{skins.map((skin) => {
					return (
						<div className="skin-card" key={skin.id}>
							<img src={`${serverUrl}${skin.imageURL}`} alt={skin.name} className="skin-image"/>
							<h2 className="skin-name">{skin.name}</h2>
							<p className="skin-cost">Стоимость: {skin.cost}</p>
							<button
								className="delete-button"
								onClick={() => handleDeleteSkin(skin.id)}
							>
								Удалить
							</button>
						</div>
					);
				})}
			</div>
			<button
				className="add-skin-button"
				onClick={() => setShowAddPopup(true)}
			>
				Добавить скин
			</button>

			{showAddPopup && (
				<AddSkinPopup
					onClose={() => setShowAddPopup(false)}
					onAddSkin={handleAddSkin}
				/>
			)}
		</div>
	);
};


export default AdminSkins;